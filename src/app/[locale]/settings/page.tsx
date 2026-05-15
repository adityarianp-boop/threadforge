"use client";
import { useState, useEffect } from "react";
import { useSettingsStore } from "@/store/settings-store";
import { Card } from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { Sparkles, Brain, Zap, CheckCircle2 } from "lucide-react";

const toneOptions = [
  { id: "casual", label: "Santai & Relatable" },
  { id: "bold", label: "Bold & Provokatif" },
  { id: "empathetic", label: "Empatik" },
  { id: "expert", label: "Expert Authority" },
] as const;

const formatOptions = [
  { id: "insight", label: "Insight Post" },
  { id: "story", label: "Real Story" },
  { id: "myth", label: "Myth Busting" },
  { id: "tips", label: "Practical Tips" },
  { id: "hot_take", label: "Hot Take" },
  { id: "case_study", label: "Mini Case Study" },
  { id: "long_form", label: "Thread Panjang" },
] as const;

const archetypeChips = [
  "Personal Branding", "Performance Marketing", "Visual Storytelling",
  "Photography", "Videography", "Design", "Human Stories",
  "Creative Strategy", "Social Media", "Branding", "Content Strategy",
  "Meta Ads", "TikTok Shop", "E-commerce", "UMKM",
];

const personaExamples = [
  "Aku membantu UMKM berkembang lewat Meta Ads, visual storytelling, dan konten yang terasa manusiawi.",
  "Fotografer human-interest yang suka mengangkat cerita kecil sehari-hari lewat visual dan tulisan reflektif.",
  "Performance marketer 3 tahun, fokus Meta Ads untuk brand fashion dan F&B di Indonesia.",
  "Content strategist yang percaya bahwa konten terbaik lahir dari kejujuran, bukan dari template.",
];

function generateAISummary(persona: string, niche: string): { summary: string; contentTypes: string[] } {
  const p = persona.toLowerCase();
  const n = niche.toLowerCase();
  const isMarketer = p.includes("marketing") || p.includes("ads") || p.includes("iklan") || n.includes("marketing");
  const isCreative = p.includes("foto") || p.includes("visual") || p.includes("design") || n.includes("visual");
  const isStoryteller = p.includes("cerita") || p.includes("story") || p.includes("human") || n.includes("story");
  const isUMKM = p.includes("umkm") || p.includes("bisnis") || n.includes("umkm");

  let role = "Creative strategist";
  if (isMarketer && isCreative) role = "Performance marketer dengan pendekatan visual storytelling";
  else if (isMarketer) role = "Performance marketer yang data-driven";
  else if (isCreative && isStoryteller) role = "Visual storyteller dengan sentuhan human interest";
  else if (isCreative) role = "Creative professional berbasis visual";
  else if (isStoryteller) role = "Storyteller observasional";
  else if (isUMKM) role = "Business strategist fokus growth UMKM";

  const contentTypes: string[] = [];
  if (isMarketer) contentTypes.push("insight strategic", "case study ads");
  if (isCreative) contentTypes.push("visual hooks", "storytelling observasional");
  if (isStoryteller) contentTypes.push("narasi personal", "human interest");
  if (isUMKM) contentTypes.push("business insight", "edukasi growth");
  if (contentTypes.length === 0) contentTypes.push("insight personal", "hot take", "opini ringan");

  return {
    summary: `${role}${niche ? ` dengan fokus di ${niche}` : ""}.`,
    contentTypes: contentTypes.slice(0, 4),
  };
}

export default function SettingsPage() {
  const persona = useSettingsStore((s) => s.persona);
  const niche = useSettingsStore((s) => s.niche);
  const defaultTone = useSettingsStore((s) => s.defaultTone);
  const defaultFormat = useSettingsStore((s) => s.defaultFormat);
  const setPersona = useSettingsStore((s) => s.setPersona);
  const setNiche = useSettingsStore((s) => s.setNiche);
  const setDefaultTone = useSettingsStore((s) => s.setDefaultTone);
  const setDefaultFormat = useSettingsStore((s) => s.setDefaultFormat);

  const [localPersona, setLocalPersona] = useState(persona);
  const [localNiche, setLocalNiche] = useState(niche);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [aiSummary, setAiSummary] = useState<{ summary: string; contentTypes: string[] } | null>(null);
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    setLocalPersona(persona);
    setLocalNiche(niche);
    if (persona && niche) setAiSummary(generateAISummary(persona, niche));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setExampleIndex((i) => (i + 1) % personaExamples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) => {
      const next = prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip];
      const nicheFromChips = next.join(", ");
      setLocalNiche(nicheFromChips);
      return next;
    });
  };

  const handleSave = () => {
    setPersona(localPersona);
    setNiche(localNiche);
    setSaved(true);
    setAiSummary(generateAISummary(localPersona, localNiche));
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass = "w-full rounded-lg border border-borderSoft bg-surfaceSecondary px-3 py-2 text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all";

  return (
    <div className="mx-auto max-w-xl space-y-5">

      {/* AI Guidance Header */}
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          <p className="text-sm font-medium text-textPrimary">Identitas kreator = kualitas AI</p>
        </div>
        <p className="text-sm text-textSecondary leading-6">
          Semakin spesifik identitas kreatormu, semakin personal dan strategis output AI nantinya.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Brain, text: "Gaya berpikir & ritme konten" },
            { icon: Zap, text: "Sudut pandang & storytelling style" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs text-textSecondary">
              <Icon size={12} className="text-accent flex-shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Persona & Niche Card */}
      <Card className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-textPrimary">Persona & Niche</h2>
          <p className="text-xs text-textSecondary">Ceritakan identitas kreatormu — ini yang membuat AI benar-benar mengenal kamu.</p>
        </div>

        {/* Persona Input */}
        <div className="space-y-2">
          <label htmlFor="settings-persona" className="block text-sm font-medium text-textPrimary">
            Siapa kamu?
          </label>
          <textarea
            id="settings-persona"
            className={`${inputClass} min-h-[110px] resize-y`}
            value={localPersona}
            onChange={(e) => setLocalPersona(e.target.value)}
            placeholder={personaExamples[exampleIndex]}
          />
          {/* Why this matters */}
          <div className="rounded-lg border border-borderSoft bg-surfaceSecondary/50 px-3 py-2.5 space-y-1.5">
            <p className="text-xs font-medium text-textSecondary">Persona digunakan AI untuk:</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {[
                "menentukan ritme tulisan",
                "menyesuaikan hook",
                "menjaga konsistensi brand",
                "output lebih manusiawi",
              ].map((item) => (
                <p key={item} className="text-xs text-textSecondary flex items-center gap-1">
                  <span className="text-accent">•</span> {item}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Niche Input */}
        <div className="space-y-2">
          <label htmlFor="settings-niche" className="block text-sm font-medium text-textPrimary">
            Niche utama kontenmu
          </label>
          <input
            id="settings-niche"
            type="text"
            className={inputClass}
            value={localNiche}
            onChange={(e) => setLocalNiche(e.target.value)}
            placeholder="Contoh: Meta Ads, personal branding, TikTok Shop"
          />

          {/* Archetype Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {archetypeChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => toggleChip(chip)}
                className={`rounded-full border px-3 py-1 text-xs transition-all ${
                  selectedChips.includes(chip)
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-borderSoft bg-surfaceSecondary text-textSecondary hover:border-accent/50 hover:text-textPrimary"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Button
          type="button"
          onClick={handleSave}
          disabled={!localPersona.trim() && !localNiche.trim()}
          className="w-full"
        >
          {saved ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} /> Tersimpan!
            </span>
          ) : (
            "Simpan Persona"
          )}
        </Button>

        {/* AI Identity Summary */}
        {aiSummary && (
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-accent" />
              <p className="text-xs font-medium text-accent uppercase tracking-wider">AI Identity</p>
            </div>
            <p className="text-sm text-textPrimary leading-6">
              ThreadForge memahami kamu sebagai: <span className="font-medium">{aiSummary.summary}</span>
            </p>
            <div>
              <p className="text-xs text-textSecondary mb-2">Kontenmu cenderung cocok untuk:</p>
              <div className="flex flex-wrap gap-2">
                {aiSummary.contentTypes.map((type) => (
                  <span key={type} className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs text-accent">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Default Generator Card */}
      <Card className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-textPrimary">Default Generator</h2>
          <p className="text-xs text-textSecondary">Preferensi ini dipakai otomatis saat generate konten.</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="settings-tone" className="block text-sm font-medium text-textPrimary">Tone default</label>
          <select id="settings-tone" className={inputClass} value={defaultTone} onChange={(e) => setDefaultTone(e.target.value)}>
            {toneOptions.map(({ id, label }) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="settings-format" className="block text-sm font-medium text-textPrimary">Format default</label>
          <select id="settings-format" className={inputClass} value={defaultFormat} onChange={(e) => setDefaultFormat(e.target.value)}>
            {formatOptions.map(({ id, label }) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* AI Continuity Widget */}
      <div className="rounded-xl border border-borderSoft bg-surfaceSecondary/40 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Brain size={14} className="text-textSecondary" />
          <p className="text-xs font-medium text-textSecondary uppercase tracking-wider">AI Insight</p>
        </div>
        <p className="text-sm text-textPrimary">
          {persona ? "AI sudah mengenal gaya kontenmu. Output akan makin personal setiap sesi." : "Isi persona dulu agar AI bisa menyesuaikan gaya konten secara personal."}
        </p>
        {!persona && (
          <p className="text-xs text-textSecondary">Creator yang mengisi persona mendapat output 3x lebih relevan.</p>
        )}
      </div>

      {/* Language Card */}
      <Card className="space-y-3">
        <h2 className="text-base font-semibold text-textPrimary">Bahasa</h2>
        <LanguageSwitcher />
      </Card>

    </div>
  );
}
