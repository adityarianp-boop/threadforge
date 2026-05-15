"use client";

import { Copy, Download, RefreshCw, TriangleAlert } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { defaultFormat, defaultTone, formatOptions, toneOptions, type FormatId, type ToneId } from "@/lib/constants/options";
import { downloadTextFile, toMarkdown } from "@/lib/utils/export";
import { useHistoryStore } from "@/store/history-store";
import { useSettingsStore } from "@/store/settings-store";
import { useWorkspaceStore } from "@/store/workspace-store";

export function GeneratorForm() {
  const routeLocale = useLocale() as "en" | "id";
  const t = useTranslations("generator");
  const addItem = useHistoryStore((state) => state.addItem);
  const { persona, niche, recentTopics, recentFormats, addRecentTopic, addRecentFormat } = useSettingsStore();
  const saveDraft = useWorkspaceStore((state) => state.saveDraft);

  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState<FormatId>(defaultFormat);
  const [tone, setTone] = useState<ToneId>(defaultTone);
  const [locale, setLocale] = useState<"en" | "id">(routeLocale);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const trimmedTopic = topic.trim();
  const canGenerate = trimmedTopic.length >= 3;
  const neededChars = Math.max(0, 3 - trimmedTopic.length);

  const run = async (regenerate = false) => {
    console.log("run triggered", { regenerate, topic, canGenerate, loading });
    if (!canGenerate) {
      setError(t("topicMin"));
      return;
    }
    setLoading(true);
    setError("");

    try {
      console.log("posting to /api/generate", { topic, format, tone, locale, regenerate });
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          format,
          tone,
          locale,
          regenerate,
          persona,
          niche,
          recentTopics,
          recentFormats
        })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? t("error"));
        return;
      }

      const content = data.content ?? "";
      setResult(content);

      if (content) {
        addRecentTopic(topic);
        addRecentFormat(format);
        addItem({
          kind: "generator",
          title: `${formatOptions.find((item) => item.id === format)?.label ?? "Generated"}: ${topic.slice(0, 72)}`,
          content,
          locale
        });
      }
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
  };

  return (
    <div className="grid gap-3 xl:grid-cols-2">
      <Card className="space-y-3">
        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-textSecondary">{t("topicLabel")}</p>
          <textarea
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder={t("topicPlaceholder")}
            className="min-h-28 w-full resize-y rounded-xl border border-borderSoft bg-surfaceSecondary p-3 text-sm"
          />
          <p className="mt-2 text-xs text-textSecondary">
            {canGenerate ? `${trimmedTopic.length} characters entered` : `Enter ${neededChars} more character${neededChars === 1 ? "" : "s"} to enable Generate.`}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <select value={format} onChange={(event) => setFormat(event.target.value as FormatId)} className="w-full rounded-xl border border-borderSoft bg-surfaceSecondary p-2 text-sm">
            {formatOptions.map((item) => (<option key={item.id} value={item.id}>{item.label}</option>))}
          </select>
          <select value={tone} onChange={(event) => setTone(event.target.value as ToneId)} className="w-full rounded-xl border border-borderSoft bg-surfaceSecondary p-2 text-sm">
            {toneOptions.map((item) => (<option key={item.id} value={item.id}>{item.label[locale]}</option>))}
          </select>
        </div>

        <select value={locale} onChange={(event) => setLocale(event.target.value as "en" | "id")} className="w-full rounded-xl border border-borderSoft bg-surfaceSecondary p-2 text-sm sm:w-52">
          <option value="id">Bahasa Indonesia</option>
          <option value="en">English</option>
        </select>

        <div className="sticky bottom-2 z-10 -mx-1 flex gap-2 rounded-xl bg-surface/95 p-1 backdrop-blur">
          <Button
            type="button"
            onClick={() => run(false)}
            disabled={loading || !canGenerate}
            title={!canGenerate ? `Enter ${neededChars} more character${neededChars === 1 ? "" : "s"} to enable Generate.` : undefined}
            className="flex-1"
          >
            {loading ? t("generating") : t("generate")}
          </Button>
          <Button type="button" variant="outline" onClick={() => run(true)} disabled={loading || !result}>{t("regenerate")}</Button>
        </div>
      </Card>

      <Card>
        <p className="mb-2 text-sm text-textSecondary">{t("previewLabel")}</p>

        {loading ? (
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-surfaceSecondary" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-surfaceSecondary" />
            <div className="h-4 w-10/12 animate-pulse rounded bg-surfaceSecondary" />
          </div>
        ) : (
          <pre className="min-h-56 whitespace-pre-wrap text-sm leading-7">{result || t("previewEmpty")}</pre>
        )}

        {error ? (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-300">
            <TriangleAlert size={14} /> {error}
            <Button type="button" size="sm" variant="outline" onClick={() => run(false)} className="ml-auto">{t("retry")}</Button>
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={copy} disabled={!result}><Copy size={14} className="mr-1" />{t("copy")}</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => downloadTextFile("threadforge-generation.txt", result)} disabled={!result}><Download size={14} className="mr-1" />TXT</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => downloadTextFile("threadforge-generation.md", toMarkdown("ThreadForge Generation", result), "text/markdown;charset=utf-8")} disabled={!result}>MD</Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => saveDraft({ topic, content: result, format, tone })}
            disabled={!result}
          >
            Simpan Draft
          </Button>
          <p className="ml-auto text-xs text-textSecondary">{result ? `${result.length} ${t("characters")}` : t("empty")}</p>
        </div>
      </Card>
    </div>
  );
}
