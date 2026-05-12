import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenRouterClient, model } from "@/lib/ai/openrouter";
import { buildGeneratorPrompt } from "@/lib/prompts/generator";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getRequestIp } from "@/lib/server/request";
import { withTimeout } from "@/lib/server/timeout";

const schema = z.object({
  topic: z.string().min(3),
  format: z.enum(["insight", "story", "myth", "tips", "hot_take", "case_study", "long_form"]),
  tone: z.enum(["casual", "bold", "empathetic", "expert"]),
  locale: z.enum(["en", "id"]).default("en"),
  regenerate: z.boolean().optional()
});

const fallback = {
  en: "Generation unavailable right now. Please retry.",
  id: "Generate sedang tidak tersedia. Silakan coba lagi."
};

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const limit = checkRateLimit(`generate:${ip}`, 20, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": "60" } });
  }

  try {
    const input = schema.parse(await req.json());
    const prompt = buildGeneratorPrompt({
      ...input,
      variantInstruction: input.regenerate ? "Create a DIFFERENT hook and a fresh angle from previous version." : undefined
    });

    const config = getOpenRouterClient();
    if (!config) return NextResponse.json({ content: fallback[input.locale], fallback: true });

    const completion = await withTimeout(
      (async () => {
        const res = await fetch(`${config.baseURL}/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://threadforge.app",
            "X-Title": "ThreadForge"
          },
          body: JSON.stringify({
            model,
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }]
          })
        });
        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`OpenRouter ${res.status}: ${errBody.slice(0, 300)}`);
        }
        return res.json() as Promise<{
          choices?: Array<{ message?: { content?: string | null } }>;
        }>;
      })(),
      20_000,
      "OpenRouter timeout"
    );

    const text = completion.choices?.[0]?.message?.content ?? fallback[input.locale];
    return NextResponse.json({ content: text, fallback: false });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate content", content: fallback.en, fallback: true },
      { status: 400 }
    );
  }
}
