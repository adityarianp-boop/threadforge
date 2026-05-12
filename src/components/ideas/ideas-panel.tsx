"use client";

import { Copy, Download, TriangleAlert } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { ideaCategories, ideaData, type IdeaCategory } from "@/lib/constants/ideas";
import { downloadTextFile, toMarkdown } from "@/lib/utils/export";
import { useHistoryStore } from "@/store/history-store";

export function IdeasPanel() {
  const locale = useLocale() as "en" | "id";
  const t = useTranslations("ideas");
  const addItem = useHistoryStore((state) => state.addItem);

  const [category, setCategory] = useState<IdeaCategory>("all");
  const [query, setQuery] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => (category === "all" ? ideaData : ideaData.filter((item) => item.cat === category)), [category]);

  const generateIdeas = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query, category, locale })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? t("error"));
        return;
      }

      setGenerated(data.generated ?? "");

      if (data.generated) {
        addItem({ kind: "idea", title: `Ideas: ${query.slice(0, 72)}`, content: data.generated, locale });
      }
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {ideaCategories.map((cat) => (
          <button key={cat.id} onClick={() => setCategory(cat.id)} className={`rounded-full border px-3 py-1.5 text-xs transition ${category === cat.id ? "border-accent bg-accent text-white" : "border-borderSoft bg-surfaceSecondary text-textSecondary"}`}>
            {cat.label[locale]}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((idea) => (
          <Card key={`${idea.cat}-${idea.title}`} className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-textSecondary">{idea.cat}</p>
            <h3 className="text-sm font-medium">{idea.title}</h3>
            <p className="text-sm italic text-textSecondary">{idea.hook}</p>
            <p className="text-xs text-textSecondary">{idea.why}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => addItem({ kind: "idea", title: idea.title, content: `${idea.hook}

${idea.why}`, locale })}>{t("saveIdea")}</Button>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(`${idea.title}
${idea.hook}`)}><Copy size={14} className="mr-1" />{t("copy")}</Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="space-y-3">
        <input type="text" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("aiPlaceholder")} className="w-full rounded-xl border border-borderSoft bg-surfaceSecondary p-3 text-sm" />
        <div className="sticky bottom-2 z-10 -mx-1 flex gap-2 rounded-xl bg-surface/95 p-1 backdrop-blur">
          <Button onClick={generateIdeas} disabled={loading || !query.trim()} className="flex-1">{loading ? t("loading") : t("generate")}</Button>
          <Button variant="outline" onClick={generateIdeas} disabled={loading || !query.trim()}>{t("retry")}</Button>
        </div>

        {loading ? <div className="h-24 animate-pulse rounded-xl bg-surfaceSecondary" /> : null}
        {!loading && generated ? <pre className="whitespace-pre-wrap text-sm leading-7">{generated}</pre> : null}
        {!loading && !generated && !error ? <p className="text-sm text-textSecondary">{t("empty")}</p> : null}

        {error ? <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-300"><TriangleAlert size={14} />{error}</div> : null}

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(generated)} disabled={!generated}><Copy size={14} className="mr-1" />{t("copyResult")}</Button>
          <Button size="sm" variant="outline" onClick={() => downloadTextFile("threadforge-ideas.txt", generated)} disabled={!generated}><Download size={14} className="mr-1" />TXT</Button>
          <Button size="sm" variant="outline" onClick={() => downloadTextFile("threadforge-ideas.md", toMarkdown("ThreadForge Ideas", generated), "text/markdown;charset=utf-8")} disabled={!generated}>MD</Button>
        </div>
      </Card>
    </div>
  );
}
