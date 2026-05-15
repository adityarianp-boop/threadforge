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
  link: z.string().url().optional(),
  locale: z.enum(["en", "id"]).default("en"),
  regenerate: z.boolean().optional()
});

const responseSchema = z.object({ amati: z.string().min(1), tiru: z.string().min(1), modifikasi: z.string().min(1) });

function fallback(locale: "en" | "id") {
  return locale === "id"
    ? { amati: "Gagal memparse output ATM. Silakan regenerate.", tiru: "Belum ada formula valid.", modifikasi: "Belum ada versi adaptasi valid." }
    : { amati: "Failed to parse ATM response. Please retry.", tiru: "No valid extracted formula yet.", modifikasi: "No valid adapted version yet." };
}

function safeParseAtm(raw: string, locale: "en" | "id") {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  const candidate = jsonStart >= 0 && jsonEnd > jsonStart ? cleaned.slice(jsonStart, jsonEnd + 1) : cleaned;

  try {
    const parsed = JSON.parse(candidate);
    const validated = responseSchema.safeParse(parsed);
    if (validated.success) return validated.data;
  } catch {
    return fallback(locale);
  }
  return fallback(locale);
}

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const limit = checkRateLimit(`atm:${ip}`, 20, 60_000);
  if (!limit.ok) return NextResponse.json({ ...fallback("en"), error: "Rate limit exceeded" }, { status: 429 });

  try {
    const input = schema.parse(await req.json());

    if (!input.content && !input.link) {
      return NextResponse.json({ error: "content or link is required" }, { status: 400 });
    }

    const isLinkOnly = !input.content && input.link;
    const contentToAnalyze = isLinkOnly
      ? `[USER PROVIDED A THREADS/INSTAGRAM LINK: ${input.link}]\n\nIMPORTANT: You cannot fetch this URL. Ask the user to paste the actual post text instead. Return this exact JSON:\n{"amati": "Link tidak bisa dianalisis langsung. Silakan paste teks konten postingannya di kolom 'Paste Konten'.", "tiru": "Salin teks dari postingan yang ingin dianalisis, lalu paste di tab 'Paste Konten'.", "modifikasi": "Belum bisa dibuat karena konten belum tersedia. Paste teks postingannya dulu ya."}`
      : input.content || "";
    const prompt = buildAtmPrompt({
      ...input,
      content: contentToAnalyze,
      variantInstruction: input.regenerate ? "Create a DIFFERENT hook from previous output." : undefined
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
          max_tokens: 1100,
          messages: [{ role: "user", content: prompt }]
        })
      }).then(r => r.json()),
      20_000,
      "OpenRouter timeout"
    );
    const raw = completion.choices?.[0]?.message?.content ?? "{}";
    return NextResponse.json(safeParseAtm(raw, input.locale));
  } catch (error) {
    return NextResponse.json({ ...fallback("id"), error: error instanceof Error ? error.message : "ATM failed" }, { status: 400 });
  }
}
