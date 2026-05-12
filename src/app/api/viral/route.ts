import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenRouterClient, model } from "@/lib/ai/openrouter";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getRequestIp } from "@/lib/server/request";
import { withTimeout } from "@/lib/server/timeout";

const schema = z.object({
  topic: z.string().min(3),
  locale: z.enum(["en", "id"]).default("id")
});

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const limit = checkRateLimit(`viral:${ip}`, 20, 60_000);
  if (!limit.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  try {
    const input = schema.parse(await req.json());
    const lang = input.locale === "id" ? "Bahasa Indonesia natural dan tajam" : "natural conversational English";

    const prompt = `Kamu adalah social media strategist yang ahli menganalisis konten viral di Threads Indonesia.

Analisis potensi viral dari topik/konten berikut: "${input.topic}"

Berikan output dalam JSON ONLY (no markdown fences):
{
  "score": <angka 1-100 potensi viral>,
  "verdict": "<Rendah | Sedang | Tinggi | Meledak>",
  "reasons": ["<alasan 1>", "<alasan 2>", "<alasan 3>"],
  "triggers": ["<emotional/social trigger yang ada>"],
  "weaknesses": ["<kelemahan yang bisa menghambat viral>"],
  "hooks": ["<hook versi 1>", "<hook versi 2>", "<hook versi 3>"],
  "best_format": "<format terbaik: Insight Post | Real Story | Hot Take | Myth Busting | Tips | Case Study>",
  "best_time": "<waktu terbaik posting>",
  "viral_angle": "<sudut pandang paling berpotensi viral dalam 2-3 kalimat>",
  "similar_viral": "<contoh topik serupa yang pernah viral di Indonesia dan kenapa>"
}

Gunakan ${lang}. Jawab HANYA dengan JSON, tanpa penjelasan lain.`;

    const config = getOpenRouterClient();
    if (!config) return NextResponse.json({ error: "AI tidak tersedia" }, { status: 503 });
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
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      }).then(r => r.json()),
      20_000,
      "OpenRouter timeout"
    );
    const raw = completion.choices?.[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");
    const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze" },
      { status: 400 }
    );
  }
}
