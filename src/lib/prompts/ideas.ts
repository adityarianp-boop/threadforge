import type { IdeaCategory } from "@/lib/constants/ideas";

type IdeasPromptInput = {
  query: string;
  category: IdeaCategory;
  locale: "en" | "id";
};

export function buildIdeasPrompt(input: IdeasPromptInput) {
  const localeRule =
    input.locale === "id"
      ? "Gunakan Bahasa Indonesia natural, tajam, dan relevan dengan marketer Indonesia."
      : "Use natural English with strategic marketer vocabulary, not generic AI language.";

  return `You are a highly creative performance marketing strategist on Threads.
Generate 5 NON-GENERIC and MIND-BLOWING content ideas about: "${input.query}".
${input.category !== "all" ? `Category focus: ${input.category}.` : ""}

For each idea provide:
1) Specific niche title
2) Hook-first opening sentence
3) Why this angle is interesting
4) Best format

Quality bar:
- Counter-intuitive
- Data or real-experience driven
- Tension-driven
- Actionable today

Output language: ${input.locale === "id" ? "Bahasa Indonesia" : "English"}. ${localeRule}
Return plain text in this exact structure:
1. [Title]
Hook: "..."
Why it works: ...
Format: ...`;
}
