import type { IdeaCategory } from "@/lib/constants/ideas";

type IdeasPromptInput = {
  query: string;
  category: IdeaCategory;
  locale: "en" | "id";
};

export function buildIdeasPrompt(input: IdeasPromptInput) {
  const lang = input.locale === "id"
    ? "Bahasa Indonesia gaul, internet-native, conversational"
    : "Natural conversational English";

  return `You are a Threads content strategist who understands internet culture, creator psychology, and viral mechanics.

Generate 5 content ideas about: "${input.query}"
${input.category !== "all" ? `Focus area: ${input.category}` : ""}

QUALITY BAR — each idea must be:
- Counter-intuitive (goes against common wisdom)
- Tension-driven (has a built-in conflict or contradiction)
- Specific (names platforms, prices, situations — never "many people")
- Culturally grounded (references real Indonesian creator/business situations)
- One of: observational, confessional, hot take, pattern interrupt, or uncomfortable truth

BANNED IDEAS (do not generate):
- "5 tips untuk..." → too listicle
- "Kenapa X itu penting" → too educational
- "Rahasia sukses..." → too fake guru
- Generic marketing advice without specific tension

Output language: ${lang}

Return in this exact format:
1. [Specific provocative title]
Hook: "[opening line that makes someone stop scrolling]"
Tension: [what makes this counter-intuitive or uncomfortable]
Format: [Insight Post / Hot Take / Real Story / Myth Busting / Mini Case Study]

---

Continue for all 5 ideas.`;
}
