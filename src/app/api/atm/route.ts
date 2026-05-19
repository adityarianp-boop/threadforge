import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenRouterClient, model } from "@/lib/ai/openrouter";
import { buildAtmPrompt } from "@/lib/prompts/atm";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getRequestIp } from "@/lib/server/request";
import { withTimeout } from "@/lib/server/timeout";

const schema = z.object({
  content: z.string().optional(),
  context: z.string().optional(),
  link: z.string().optional(),
  locale: z.enum(["en", "id"]).default("en"),
  regenerate: z.boolean().optional()
});

const responseSchema = z.object({
  amati: z.string().min(1),
  tiru: z.string().min(1),
  modifikasi: z.string().min(1)
});

function fallback(locale: "en" | "id") {
  return locale === "id"
    ? {
        amati: "Analisis belum berhasil. Coba paste teks kontennya langsung dan klik regenerate.",
        tiru: "Formula belum bisa diekstrak. Pastikan konten yang dipaste cukup panjang (minimal 2-3 kalimat).",
        modifikasi: "Versi adaptasi belum bisa dibuat. Silakan coba lagi."
      }
    : {
        amati: "Analysis failed. Try pasting the content text directly and regenerate.",
        tiru: "Formula extraction failed. Make sure the content is long enough.",
        modifikasi: "Adapted version could not be generated. Please retry."
      };
}

function safeParseAtm(raw: string, locale: "en" | "id") {
  if (!raw || raw.trim() === "" || raw.trim() === "{}") return fallback(locale);

  // Multiple cleaning passes
  let cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .replace(/^\s*json\s*/i, "")
    .trim();

  // Find JSON boundaries
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    // Try to extract fields manually if JSON is broken
    const amatiMatch = cleaned.match(/"amati"\s*:\s*"([^"]+)"/);
    const tiruMatch = cleaned.match(/"tiru"\s*:\s*"([^"]+)"/);
    const modifikasiMatch = cleaned.match(/"modifikasi"\s*:\s*"([\s\S]+?)(?:"\s*}|"\s*,\s*")/);

    if (amatiMatch && tiruMatch && modifikasiMatch) {
      return {
        amati: amatiMatch[1],
        tiru: tiruMatch[1],
        modifikasi: modifikasiMatch[1]
      };
    }
    return fallback(locale);
  }

  const candidate = cleaned.slice(jsonStart, jsonEnd + 1);

  try {
    const parsed = JSON.parse(candidate);
    const validated = responseSchema.safeParse(parsed);
    if (validated.success) return validated.data;

    // Partial recovery — use what we have
    if (parsed && typeof parsed === "object") {
      return {
        amati: typeof parsed.amati === "string" && parsed.amati.length > 0 ? parsed.amati : fallback(locale).amati,
        tiru: typeof parsed.tiru === "string" && parsed.tiru.length > 0 ? parsed.tiru : fallback(locale).tiru,
        modifikasi: typeof parsed.modifikasi === "string" && parsed.modifikasi.length > 0 ? parsed.modifikasi : fallback(locale).modifikasi
      };
    }
  } catch {
    // JSON parse failed — try one more time with escaped quotes fixed
    try {
      const fixed = candidate.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");
      const parsed = JSON.parse(fixed);
      const validated = responseSchema.safeParse(parsed);
      if (validated.success) return validated.data;
    } catch {
      return fallback(locale);
    }
  }

  return fallback(locale);
}

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const limit = checkRateLimit(`atm:${ip}`, 20, 60_000);
  if (!limit.ok) return NextResponse.json({ ...fallback("en"), error: "Rate limit exceeded" }, { status: 429 });

  try {
    const input = schema.parse(await req.json());

    if (!input.content?.trim() && !input.link?.trim()) {
      return NextResponse.json({ error: "content or link is required" }, { status: 400 });
    }

    let contentToAnalyze = input.content?.trim() || "";

    if (!contentToAnalyze && input.link?.trim()) {
      try {
        const jinaUrl = `https://r.jina.ai/${input.link.trim()}`;
        const jinaRes = await withTimeout(
          fetch(jinaUrl, {
            headers: { Accept: "text/plain" }
          }).then((r) => r.text()),
          15_000,
          "Jina fetch timeout"
        );

        if (jinaRes && jinaRes.length > 50) {
          // Clean up Jina response — remove image markdown, keep text
          contentToAnalyze = jinaRes
            .replace(/!\[.*?\]\(.*?\)/g, "")
            .replace(/\n{3,}/g, "\n\n")
            .trim()
            .slice(0, 8000);
        }
      } catch {
        // Jina fetch failed — fall through to empty content check
      }
    }

    if (!contentToAnalyze) {
      return NextResponse.json({
        ...fallback(input.locale),
        error: input.link?.trim()
          ? "Gagal ambil teks dari link. Coba salin teks postingan dan paste langsung."
          : "Paste teks kontennya dulu ya — link tidak bisa dianalisis langsung."
      });
    }

    const prompt = buildAtmPrompt({
      content: contentToAnalyze,
      context: input.context,
      locale: input.locale,
      variantInstruction: input.regenerate ? "Create a completely DIFFERENT hook and angle from previous output. Same strategic structure, fresh perspective." : undefined
    });

    const config = getOpenRouterClient();
    if (!config) return NextResponse.json(fallback(input.locale));

    const completion = await withTimeout(
      fetch(`${config.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://threadforge.app",
          "X-Title": "ThreadForge"
        },
        body: JSON.stringify({
          model,
          max_tokens: 1200,
          temperature: 0.95,
          messages: [
            {
              role: "system",
              content: "You are a viral content strategist. You ALWAYS respond with valid JSON only. Never add markdown, never add explanation outside JSON. Your response must start with { and end with }."
            },
            { role: "user", content: prompt }
          ]
        })
      }).then(r => r.json()),
      25_000,
      "OpenRouter timeout"
    );

    const raw = completion.choices?.[0]?.message?.content ?? "{}";
    return NextResponse.json(safeParseAtm(raw, input.locale));
  } catch (error) {
    return NextResponse.json(
      { ...fallback("id"), error: error instanceof Error ? error.message : "ATM failed" },
      { status: 400 }
    );
  }
}
