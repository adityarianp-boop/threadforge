import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenRouterClient, model } from "@/lib/ai/openrouter";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getRequestIp } from "@/lib/server/request";
import { withTimeout } from "@/lib/server/timeout";

const schema = z.object({
  originalPost: z.string().min(10),
  comment: z.string().min(3),
  replyStyle: z.enum(["observational", "witty", "soft_disagree", "authority", "empathetic"]).default("observational"),
  context: z.string().optional(),
  locale: z.enum(["en", "id"]).default("id"),
  persona: z.string().optional(),
});

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const limit = checkRateLimit(`reply:${ip}`, 30, 60_000);
  if (!limit.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  try {
    const input = schema.parse(await req.json());
    const lang = input.locale === "id" ? "Bahasa Indonesia gaul, conversational, internet-native" : "Natural conversational English";

    const styleGuide = {
      observational: "Notice something specific about what they said. Respond with a nuanced observation, not a direct answer. Sound like you're thinking out loud.",
      witty: "Respond with a sharp, clever line. Light humor, not sarcasm. Internet-native timing. One or two sentences max.",
      soft_disagree: "Disagree without being aggressive. Acknowledge their point first, then gently redirect. No 'actually' energy. Sound like you're adding nuance, not correcting.",
      authority: "Respond from experience, not ego. Share a specific insight or real example. Confident but not preachy. Don't over-explain.",
      empathetic: "Acknowledge the emotional layer of what they said. Make them feel heard before adding anything. Warm but not performative."
    };

    const prompt = `You are an Indonesian creator on Threads responding to a comment on your post.

ORIGINAL POST:
${input.originalPost}

COMMENT TO REPLY TO:
${input.comment}

${input.context ? `Additional context: ${input.context}` : ""}
${input.persona ? `Your identity as creator: ${input.persona}` : ""}

REPLY STYLE: ${styleGuide[input.replyStyle]}

RULES:
- Write in ${lang}
- Max 3 sentences — Threads replies are SHORT
- Sound like a real person, not a content strategist
- Use "lo/gue" naturally
- No hashtags, no emoji unless it genuinely fits
- Do NOT start with "Haha", "Wah", "Wkwk", or other filler reactions
- Do NOT be sycophantic ("Makasih sharingnya!")
- Sound like someone who actually read the comment carefully
- Preserve your identity and worldview — don't bend to every comment
- If disagreeing: be direct but not rude

Return ONLY the reply text. Nothing else.`;

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
          max_tokens: 200,
          temperature: 0.8,
          messages: [
            { role: "system", content: "You are a Threads creator. Reply naturally and briefly. Never sound like AI." },
            { role: "user", content: prompt }
          ]
        })
      }).then(r => r.json()),
      15_000,
      "Reply timeout"
    );

    const reply = completion.choices?.[0]?.message?.content?.trim() ?? "";
    if (!reply) return NextResponse.json({ error: "Gagal generate reply" }, { status: 500 });
    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 400 });
  }
}
