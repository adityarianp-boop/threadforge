type AtmPromptInput = {
  content: string;
  context?: string;
  locale: "en" | "id";
  variantInstruction?: string;
};

export function buildAtmPrompt(input: AtmPromptInput) {
  const defaultContext =
    input.locale === "id"
      ? "kreator konten Indonesia, aktif di Threads, fokus membangun personal brand yang autentik"
      : "Indonesian content creator on Threads focused on authentic personal branding";

  const creatorContext = input.context?.trim() || defaultContext;
  const lang = input.locale === "id" ? "Bahasa Indonesia gaul, conversational, internet-native" : "Natural conversational English";

  return `You are a viral content strategist specializing in Indonesian Threads culture and creator psychology.

TASK: Perform ATM analysis (Amati, Tiru, Modifikasi) on the post below.

=== POST TO ANALYZE ===
${input.content}
======================

Creator context: ${creatorContext}
${input.variantInstruction ? `Variant direction: ${input.variantInstruction}` : ""}

ANALYSIS INSTRUCTIONS:

AMATI — Analyze these dimensions (write in ${lang}):
- Hook type: what psychological trigger? (curiosity gap / contradiction / confession / shocking fact / pattern interrupt / identity signal)
- Emotional arc: how does tension build across the post?
- Identity signal: what does this reveal about the writer's worldview?
- Engagement mechanic: why would someone reply, share, or save this?
- Pacing: how do short/long sentences create rhythm?
Write 3-4 sentences. Be specific, not generic.

TIRU — Extract the reusable framework (write in ${lang}):
- The hook pattern (not the words, the psychological structure)
- The tension-building method
- The resolution/closing style
- How to adapt this to ANY niche
Write 3-4 sentences. Make it actionable.

MODIFIKASI — Write a full remixed post (write in ${lang}):
- New hook using the SAME psychological trigger type
- Same emotional arc and pacing
- Completely adapted to creator context: ${creatorContext}
- Different examples, different industry references
- Must feel written by a real creator, NOT an AI
- 150-250 words
- No hashtags, no emoji labels
- Sound like: a real person thinking out loud on Threads at midnight
- Do NOT sound like: a marketing coach, LinkedIn guru, or AI assistant

CRITICAL OUTPUT RULES:
1. Your ENTIRE response must be valid JSON
2. Start with { and end with }
3. No text before {, no text after }
4. No markdown fences, no code blocks
5. Use double quotes for all strings
6. Escape any quotes inside strings with backslash

Required JSON structure:
{"amati": "your analysis here", "tiru": "your framework here", "modifikasi": "your remixed post here"}`;
}
