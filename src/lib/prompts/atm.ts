type AtmPromptInput = {
  content: string;
  context?: string;
  locale: "en" | "id";
  variantInstruction?: string;
};

export function buildAtmPrompt(input: AtmPromptInput) {
  const defaultContext =
    input.locale === "id"
      ? "performance marketer, fokus di Meta Ads dan growth strategy untuk brand Indonesia"
      : "performance marketer focused on Meta Ads and growth strategy";

  const creatorContext = input.context?.trim() || defaultContext;

  return `You are a viral content strategist who specializes in Indonesian Threads culture.

Your job is NOT to paraphrase. Your job is to STRATEGICALLY REMIX.

Analyze this original post and create a creator-specific adaptation:
=== ORIGINAL POST ===
${input.content}
===================

Creator context: ${creatorContext}
${input.variantInstruction ? `Variant direction: ${input.variantInstruction}` : ""}

ANALYSIS FRAMEWORK:
1. Hook type: what psychological trigger does the opener use? (curiosity gap / contradiction / confession / shocking fact / pattern interrupt)
2. Emotional arc: how does tension build and release across the post?
3. Identity signal: what does this post say about WHO the writer is?
4. Engagement mechanic: why would someone reply, share, or save this?
5. Structural rhythm: how are short/long sentences alternated for pacing?

REMIX RULES:
- Extract the STRATEGIC STRUCTURE, not the words
- Adapt to creator context completely — different industry, different examples, different voice
- Hook must be completely new but use the same psychological trigger type
- Maintain the same emotional arc (tension → insight → resolution)
- Output must feel like it was written by the creator, not translated
- Use "lo/gue" and Indonesian gaul naturally
- 150-250 words
- No hashtags, no emoji labels

Output language: ${input.locale === "id" ? "Bahasa Indonesia gaul, conversational" : "Natural English"}.

Return JSON ONLY, no markdown fences, no explanation:
{
  "amati": "Strategic analysis: hook type used, emotional arc structure, identity signals, engagement mechanics, and pacing rhythm. Be specific and actionable. (4-5 sentences)",
  "tiru": "Extracted framework: the reusable strategic template — hook pattern, tension-building method, resolution style, and how to adapt this structure to any niche. (3-4 sentences)",
  "modifikasi": "Full remixed post adapted for this creator. New hook using same psychological trigger, same emotional arc, completely different examples and voice. Ready to post."
}`;
}
