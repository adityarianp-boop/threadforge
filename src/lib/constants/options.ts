import type { AppLocale } from "@/i18n";

export type FormatId = "insight" | "story" | "myth" | "tips" | "hot_take" | "case_study" | "long_form";
export type ToneId = "casual" | "bold" | "empathetic" | "expert";

export type FormatOption = { id: FormatId; label: string; description: Record<AppLocale, string> };
export type ToneOption = { id: ToneId; label: Record<AppLocale, string>; styleGuide: Record<AppLocale, string> };

export const formatOptions: FormatOption[] = [
  { id: "insight", label: "Insight Post", description: { en: "Strong-opinion insight with one main lesson", id: "Insight post dengan opini kuat dan satu pelajaran utama" } },
  { id: "story", label: "Real Story", description: { en: "Real-experience storytelling with emotional arc", id: "Storytelling berbasis pengalaman nyata dengan arc emosional" } },
  { id: "myth", label: "Myth Busting", description: { en: "Myth busting with contrarian industry angle", id: "Myth busting yang membantah asumsi umum di industri marketing" } },
  { id: "tips", label: "Practical Tips", description: { en: "Actionable and specific list-based tips", id: "Practical tips dalam format list, actionable dan spesifik" } },
  { id: "hot_take", label: "Hot Take", description: { en: "Controversial point of view that drives discussion", id: "Hot take atau pendapat kontroversial yang memancing diskusi" } },
  { id: "case_study", label: "Mini Case Study", description: { en: "Short case study: problem -> action -> result -> lesson", id: "Mini case study singkat: masalah -> aksi -> hasil -> pelajaran" } },
  {
    id: "long_form",
    label: "Thread Panjang",
    description: {
      en: "Multi-section long-form thread with labeled sections for deep storytelling",
      id: "Thread panjang multi-section dengan label per bagian untuk storytelling mendalam"
    }
  }
];

export const toneOptions: ToneOption[] = [
  { id: "casual", label: { en: "Casual", id: "Santai & relatable" }, styleGuide: { en: "casual, warm, relatable like a smart peer", id: "santai, relatable, seperti ngobrol dengan teman yang ngerti bisnis" } },
  { id: "bold", label: { en: "Bold", id: "Bold & provocative" }, styleGuide: { en: "bold, provocative, direct to core problem", id: "berani, provokatif, langsung ke pokok masalah" } },
  { id: "empathetic", label: { en: "Empathetic", id: "Empatik" }, styleGuide: { en: "empathetic, supportive, validating audience pain", id: "empatik, supportif, membuat pembaca merasa dipahami" } },
  { id: "expert", label: { en: "Expert", id: "Expert authority" }, styleGuide: { en: "authoritative, evidence-based, confident", id: "percaya diri, berbasis data dan pengalaman, authoritative" } }
];

export const defaultFormat: FormatId = "insight";
export const defaultTone: ToneId = "casual";
