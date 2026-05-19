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

  const [inputMode, setInputMode] = useState<"link" | "paste" | "image">("paste");
  const [content, setContent] = useState("");
  const [context, setContext] = useState("");
  const [link, setLink] = useState("");
  const [result, setResult] = useState<AtmResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState("");
  const [analyzingImage, setAnalyzingImage] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageFile(reader.result as string);
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!imageFile) return;
    setAnalyzingImage(true);
    setImageAnalysis("");
    try {
      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageBase64: imageFile, locale, context })
      });
      const data = await res.json();
      if (data.analysis) setImageAnalysis(data.analysis);
    } catch {
      /* ignore */
    } finally {
      setAnalyzingImage(false);
    }
  };

  const run = async (regenerate = false) => {
    if (inputMode === "image") return;
    if (inputMode === "link" && !link.trim()) return;
    if (inputMode === "link") {
      setLoading(true);
      setError("");
      setResult(null);
      try {
        const response = await fetch("/api/atm", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ content: "", link, context, locale, regenerate })
        });
        const data = (await response.json()) as AtmResult & { error?: string };
        if (!response.ok || data.error) {
          setError(data.error ?? t("error"));
          return;
        }
        setResult(data);
        addItem({
          kind: "atm",
          title: `ATM: ${link.slice(0, 72)}`,
          content: `${data.amati}\n\n${data.tiru}\n\n${data.modifikasi}`,
          locale
        });
      } catch {
        setError(t("error"));
      } finally {
        setLoading(false);
      }
      return;
    }
    if (inputMode === "paste" && !content.trim()) return;
    setLoading(true);
    setError("");
    try {
      const body = { content, link: "", context, locale, regenerate };

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
      addItem({
        kind: "atm",
        title: `ATM: ${link ? link.slice(0, 72) : content.slice(0, 72)}`,
        content: `${data.amati}\n\n${data.tiru}\n\n${data.modifikasi}`,
        locale
      });
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze =
    inputMode === "link" ? link.trim() !== "" : inputMode === "paste" ? content.trim() !== "" : false;

  return (
    <div className="space-y-3">
      <Card className="space-y-3">
        <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-borderSoft bg-surfaceSecondary">
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
          <button
            type="button"
            onClick={() => setInputMode("image")}
            className={[
              "px-3 py-2 text-sm",
              inputMode === "image" ? "bg-surface font-medium" : "text-textSecondary hover:bg-surface/60"
            ].join(" ")}
          >
            Screenshot
          </button>
        </div>

        {inputMode === "link" && (
          <>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full rounded-xl border border-borderSoft bg-surfaceSecondary p-3 text-sm"
              placeholder="Paste link postingan Threads atau LinkedIn..."
              type="url"
            />
            <p className="mt-1 text-xs text-textSecondary">
              💡 Paste link Threads atau LinkedIn — AI akan otomatis membaca kontennya.
            </p>
          </>
        )}

        {inputMode === "paste" && (
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-52 w-full rounded-xl border border-borderSoft bg-surfaceSecondary p-3 text-sm"
            placeholder="Paste isi konten Threads atau LinkedIn yang ingin di-ATM..."
          />
        )}

        {inputMode === "image" && (
          <div className="space-y-3">
            <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-borderSoft bg-surfaceSecondary transition-colors hover:border-accent/50">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              {imageFile ? (
                <img src={imageFile} alt="preview" className="h-full w-full rounded-xl object-contain p-2" />
              ) : (
                <div className="text-center">
                  <p className="text-sm text-textSecondary">Klik untuk upload screenshot</p>
                  <p className="mt-1 text-xs text-textSecondary">Threads, Instagram, LinkedIn, dsb.</p>
                </div>
              )}
            </label>
            {imageFile && (
              <Button type="button" onClick={analyzeImage} disabled={analyzingImage} className="w-full">
                {analyzingImage ? "Menganalisis..." : "Analisis Screenshot →"}
              </Button>
            )}
            {imageAnalysis && (
              <div className="rounded-xl border border-borderSoft bg-surfaceSecondary p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-textPrimary">{imageAnalysis}</pre>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  className="mt-3"
                  onClick={() => navigator.clipboard.writeText(imageAnalysis)}
                >
                  Salin analisis
                </Button>
              </div>
            )}
          </div>
        )}

        <input
          value={context}
          onChange={(event) => setContext(event.target.value)}
          className="w-full rounded-xl border border-borderSoft bg-surfaceSecondary p-3 text-sm"
          placeholder={t("contextPlaceholder")}
        />
        {inputMode !== "image" && (
          <div className="sticky bottom-2 z-10 -mx-1 flex gap-2 rounded-xl bg-surface/95 p-1 backdrop-blur">
            <Button type="button" onClick={() => run(false)} disabled={loading || !canAnalyze} className="flex-1">
              {loading ? t("loading") : t("analyze")}
            </Button>
            <Button type="button" variant="outline" onClick={() => run(true)} disabled={loading || !result}>
              {t("variant")}
            </Button>
          </div>
        )}
      </Card>

      {inputMode !== "image" && loading ? (
        <Card>
          <div className="h-28 animate-pulse rounded-xl bg-surfaceSecondary" />
        </Card>
      ) : null}
      {inputMode !== "image" && error ? (
        <Card>
          <div className="flex items-center gap-2 text-xs text-red-300">
            <TriangleAlert size={14} />
            {error}
            <Button type="button" size="sm" variant="outline" onClick={() => run(false)} className="ml-auto">
              {t("retry")}
            </Button>
          </div>
        </Card>
      ) : null}
      {inputMode !== "image" && !loading && !result && !error ? (
        <Card>
          <p className="text-sm text-textSecondary">{t("empty")}</p>
        </Card>
      ) : null}

      {result ? (
        <div className="grid gap-3 xl:grid-cols-3">
          <Card>
            <p className="mb-2 text-xs uppercase tracking-wider text-textSecondary">{t("observe")}</p>
            <p className="text-sm leading-7">{result.amati}</p>
          </Card>
          <Card>
            <p className="mb-2 text-xs uppercase tracking-wider text-textSecondary">{t("extract")}</p>
            <p className="text-sm leading-7">{result.tiru}</p>
          </Card>
          <Card>
            <p className="mb-2 text-xs uppercase tracking-wider text-textSecondary">{t("modify")}</p>
            <pre className="whitespace-pre-wrap text-sm leading-7">{result.modifikasi}</pre>
            <div className="mt-3 flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(result.modifikasi)}>
                <Copy size={14} className="mr-1" />
                {t("copy")}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => downloadTextFile("threadforge-atm.txt", result.modifikasi)}>
                <Download size={14} className="mr-1" />
                TXT
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  downloadTextFile("threadforge-atm.md", toMarkdown("ThreadForge ATM", result.modifikasi), "text/markdown;charset=utf-8")
                }
              >
                MD
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
