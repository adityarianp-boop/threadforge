"use client";

import { Copy, Download, TriangleAlert } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { downloadTextFile, toMarkdown } from "@/lib/utils/export";
import { useHistoryStore } from "@/store/history-store";

type AtmResult = { amati: string; tiru: string; modifikasi: string };

export function AtmAnalyzer() {
  const locale = useLocale() as "en" | "id";
  const t = useTranslations("atm");
  const addItem = useHistoryStore((state) => state.addItem);

  const [inputMode, setInputMode] = useState<"link" | "paste">("link");
  const [content, setContent] = useState("");
  const [context, setContext] = useState("");
  const [link, setLink] = useState("");
  const [result, setResult] = useState<AtmResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async (regenerate = false) => {
    if (inputMode === "link") {
      setError("Link tidak bisa dianalisis langsung. Salin teks postingan Threads-nya, lalu paste di tab 'Paste Konten'.");
      return;
    }
    if (inputMode === "link" && !link.trim()) return;
    if (inputMode === "paste" && !content.trim()) return;
    setLoading(true);
    setError("");
    try {
      const body =
        inputMode === "link"
          ? { content: "", link, context, locale, regenerate }
          : { content, link: "", context, locale, regenerate };

      const response = await fetch("/api/atm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = (await response.json()) as AtmResult & { error?: string };
      if (!response.ok) {
        setError(data.error ?? t("error"));
        return;
      }
      setResult(data);
      addItem({ kind: "atm", title: `ATM: ${link ? link.slice(0, 72) : content.slice(0, 72)}`, content: `${data.amati}

${data.tiru}

${data.modifikasi}`, locale });
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = inputMode === "link" ? link.trim() !== "" : content.trim() !== "";

  return (
    <div className="space-y-3">
      <Card className="space-y-3">
        <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-borderSoft bg-surfaceSecondary">
          <button
            type="button"
            onClick={() => {
              setInputMode("link");
              setContent("");
            }}
            className={[
              "px-3 py-2 text-sm",
              inputMode === "link" ? "bg-surface font-medium" : "text-textSecondary hover:bg-surface/60"
            ].join(" ")}
          >
            Link (Referensi)
          </button>
          <button
            type="button"
            onClick={() => {
              setInputMode("paste");
              setLink("");
            }}
            className={[
              "px-3 py-2 text-sm",
              inputMode === "paste" ? "bg-surface font-medium" : "text-textSecondary hover:bg-surface/60"
            ].join(" ")}
          >
            Paste Konten
          </button>
        </div>

        {inputMode === "link" ? (
          <>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full rounded-xl border border-borderSoft bg-surfaceSecondary p-3 text-sm"
              placeholder="Paste link postingan Threads atau LinkedIn..."
              type="url"
            />
            <p className="text-xs text-textSecondary mt-1">
              💡 Threads tidak mengizinkan akses konten via link. Salin teks postingannya, lalu gunakan tab "Paste Konten".
            </p>
            <p className="text-xs text-textSecondary mt-2">
              Threads tidak mengizinkan fetch konten via link. Gunakan tab ini sebagai referensi saja, atau switch ke "Paste Konten" untuk analisis langsung.
            </p>
          </>
        ) : (
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-52 w-full rounded-xl border border-borderSoft bg-surfaceSecondary p-3 text-sm"
            placeholder="Paste isi konten Threads atau LinkedIn yang ingin di-ATM..."
          />
        )}
        <input value={context} onChange={(event) => setContext(event.target.value)} className="w-full rounded-xl border border-borderSoft bg-surfaceSecondary p-3 text-sm" placeholder={t("contextPlaceholder")} />
        <div className="sticky bottom-2 z-10 -mx-1 flex gap-2 rounded-xl bg-surface/95 p-1 backdrop-blur">
          <Button onClick={() => run(false)} disabled={loading || !canAnalyze} className="flex-1">{loading ? t("loading") : t("analyze")}</Button>
          <Button variant="outline" onClick={() => run(true)} disabled={loading || !result}>{t("variant")}</Button>
        </div>
      </Card>

      {loading ? <Card><div className="h-28 animate-pulse rounded-xl bg-surfaceSecondary" /></Card> : null}
      {error ? <Card><div className="flex items-center gap-2 text-xs text-red-300"><TriangleAlert size={14} />{error}<Button size="sm" variant="outline" onClick={() => run(false)} className="ml-auto">{t("retry")}</Button></div></Card> : null}
      {!loading && !result && !error ? <Card><p className="text-sm text-textSecondary">{t("empty")}</p></Card> : null}

      {result ? (
        <div className="grid gap-3 xl:grid-cols-3">
          <Card><p className="mb-2 text-xs uppercase tracking-wider text-textSecondary">{t("observe")}</p><p className="text-sm leading-7">{result.amati}</p></Card>
          <Card><p className="mb-2 text-xs uppercase tracking-wider text-textSecondary">{t("extract")}</p><p className="text-sm leading-7">{result.tiru}</p></Card>
          <Card>
            <p className="mb-2 text-xs uppercase tracking-wider text-textSecondary">{t("modify")}</p>
            <pre className="whitespace-pre-wrap text-sm leading-7">{result.modifikasi}</pre>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(result.modifikasi)}><Copy size={14} className="mr-1" />{t("copy")}</Button>
              <Button size="sm" variant="outline" onClick={() => downloadTextFile("threadforge-atm.txt", result.modifikasi)}><Download size={14} className="mr-1" />TXT</Button>
              <Button size="sm" variant="outline" onClick={() => downloadTextFile("threadforge-atm.md", toMarkdown("ThreadForge ATM", result.modifikasi), "text/markdown;charset=utf-8")}>MD</Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
