import { NextResponse } from "next/server";
import { getOpenRouterClient } from "@/lib/ai/openrouter";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getRequestIp } from "@/lib/server/request";
import { withTimeout } from "@/lib/server/timeout";

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const limit = checkRateLimit(`img-analyze:${ip}`, 10, 60_000);
  if (!limit.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  try {
    const { imageBase64, locale = "id", context = "" } = await req.json();
    if (!imageBase64) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    const lang = locale === "id" ? "Bahasa Indonesia gaul, conversational" : "Natural English";

    const prompt = `You are a Threads content strategist analyzing a screenshot of social media content.

${context ? `Creator context: ${context}` : ""}

Analyze this image and provide:

1. WHAT TYPE OF CONTENT IS THIS?
(Threads post / Instagram caption / carousel / quote card / other)

2. CREATOR VIBE ANALYSIS
What does the visual + text communicate about the creator's identity and positioning?

3. HOOK PSYCHOLOGY
What makes the opening line/visual stop someone from scrolling?

4. EMOTIONAL RHYTHM
How does the pacing feel? (fast/slow, tense/calm, fragmented/flowing)

5. WHAT MAKES THIS WORK (or not work)?
Be specific. Reference actual elements in the image.

6. CONTENT DIRECTION FOR ADAPTATION
Suggest 2-3 specific angles this creator could adapt for their own Threads content.

Write in ${lang}. Be specific, not generic. Sound like a strategist who actually understands creator culture, not a marketing textbook.`;

    const config = getOpenRouterClient();
    if (!config) return NextResponse.json({ error: "AI tidak tersedia" }, { status: 503 });

    const completion = await withTimeout(
      fetch(`${config.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://threadforge.app",
          "X-Title": "ThreadForge"
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          max_tokens: 800,
          messages: [
            {
              role: "user",
              content: [
                { type: "image_url", image_url: { url: imageBase64 } },
                { type: "text", text: prompt }
              ]
            }
          ]
        })
      }).then((r) => r.json()),
      25_000,
      "Image analysis timeout"
    );

    const analysis = completion.choices?.[0]?.message?.content ?? "";
    if (!analysis) return NextResponse.json({ error: "Analisis gagal" }, { status: 500 });
    return NextResponse.json({ analysis });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 400 });
  }
}
