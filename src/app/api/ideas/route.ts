import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenRouterClient, model } from "@/lib/ai/openrouter";
import { ideaData, type IdeaCategory } from "@/lib/constants/ideas";
import { buildIdeasPrompt } from "@/lib/prompts/ideas";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getRequestIp } from "@/lib/server/request";
import { withTimeout } from "@/lib/server/timeout";

const schema = z.object({
  query: z.string().min(3),
  category: z.enum(["all", "meta", "perf", "brand", "funnel", "design", "video", "music", "life"]).default("all"),
  locale: z.enum(["en", "id"]).default("en")
});

function filterSeed(category: IdeaCategory) {
  return category === "all" ? ideaData : ideaData.filter((item) => item.cat === (category as string));
}

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const limit = checkRateLimit(`ideas:${ip}`, 20, 60_000);
  if (!limit.ok) return NextResponse.json({ error: "Rate limit exceeded", generated: "", seed: ideaData }, { status: 429 });

  try {
    const input = schema.parse(await req.json());
    const prompt = buildIdeasPrompt(input);
    const seed = filterSeed(input.category);

    const config = getOpenRouterClient();
    if (!config) {
      return NextResponse.json({
        generated: input.locale === "id" ? "AI belum tersedia. Coba lagi nanti." : "AI is currently unavailable.",
        seed,
        fallback: true
      });
    }
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
          max_tokens: 900,
          messages: [{ role: "user", content: prompt }]
        })
      }).then(r => r.json()),
      20_000,
      "OpenRouter timeout"
    );
    const generated = completion.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ generated, seed, fallback: false });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate ideas", generated: "", seed: ideaData, fallback: true },
      { status: 400 }
    );
  }
}
