"use client";

import { useSettingsStore } from "@/store/settings-store";
import { Card } from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { LanguageSwitcher } from "@/components/language/language-switcher";

const toneOptions = ["casual", "bold", "empathetic", "expert"] as const;
const formatOptions = ["insight", "story", "myth", "tips", "hot_take", "case_study", "long_form"] as const;

export default function SettingsPage() {
  const persona = useSettingsStore((s) => s.persona);
  const niche = useSettingsStore((s) => s.niche);
  const defaultTone = useSettingsStore((s) => s.defaultTone);
  const defaultFormat = useSettingsStore((s) => s.defaultFormat);
  const setPersona = useSettingsStore((s) => s.setPersona);
  const setNiche = useSettingsStore((s) => s.setNiche);
  const setDefaultTone = useSettingsStore((s) => s.setDefaultTone);
  const setDefaultFormat = useSettingsStore((s) => s.setDefaultFormat);

  const inputClass =
    "w-full rounded-lg border border-borderSoft bg-surfaceSecondary px-3 py-2 text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-accent/30";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Card className="space-y-4">
        <h2 className="text-base font-semibold text-textPrimary">Persona &amp; Niche</h2>
        <div className="space-y-2">
          <label htmlFor="settings-persona" className="block text-sm font-medium text-textPrimary">
            Siapa kamu?
          </label>
          <textarea
            id="settings-persona"
            className={`${inputClass} min-h-[120px] resize-y`}
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="Contoh: Performance marketer 3 tahun, fokus Meta Ads untuk brand fashion dan F&amp;B di Indonesia."
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="settings-niche" className="block text-sm font-medium text-textPrimary">
            Niche utama kontenmu
          </label>
          <input
            id="settings-niche"
            type="text"
            className={inputClass}
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Contoh: Meta Ads, personal branding, TikTok Shop"
          />
        </div>
        <Button
          type="button"
          onClick={() => {
            setPersona(persona);
            setNiche(niche);
          }}
        >
          Simpan
        </Button>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-base font-semibold text-textPrimary">Default Generator</h2>
        <div className="space-y-2">
          <label htmlFor="settings-tone" className="block text-sm font-medium text-textPrimary">
            Tone default
          </label>
          <select
            id="settings-tone"
            className={inputClass}
            value={defaultTone}
            onChange={(e) => setDefaultTone(e.target.value)}
          >
            {toneOptions.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="settings-format" className="block text-sm font-medium text-textPrimary">
            Format default
          </label>
          <select
            id="settings-format"
            className={inputClass}
            value={defaultFormat}
            onChange={(e) => setDefaultFormat(e.target.value)}
          >
            {formatOptions.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-base font-semibold text-textPrimary">Bahasa</h2>
        <LanguageSwitcher />
      </Card>
    </div>
  );
}
