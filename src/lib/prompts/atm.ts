type AtmPromptInput = {
  content: string;
  context?: string;
  locale: "en" | "id";
  variantInstruction?: string;
};

export function buildAtmPrompt(input: AtmPromptInput) {
  const defaultContext =
    input.locale === "id"
      ? "performance marketer, fokus di Meta Ads dan growth strategy"
      : "performance marketer focused on Meta Ads and growth strategy";

  return `You are a performance marketing specialist who can analyze and adapt social content.
Perform ATM analysis for this original post:
=== ORIGINAL POST ===
${input.content}
=====================
Business context: ${input.context?.trim() || defaultContext}
${input.variantInstruction ? `Variant note: ${input.variantInstruction}` : ""}
Output language must be ${input.locale === "id" ? "Bahasa Indonesia" : "English"}, natural and human.

Return JSON ONLY, no markdown fences:
{
  "amati": "Deep analysis: hook type, narrative structure, persuasion techniques, engagement drivers, and why it works (3-4 sentences)",
  "tiru": "Extracted framework: reusable structure, hook pattern, sentence rhythm, and adaptation method (3-4 sentences)",
  "modifikasi": "Fully adapted original Threads post for performance marketing domain. New hook, same strategic structure, 150-250 words."
}`;
}
