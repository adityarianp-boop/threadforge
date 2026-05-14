"use client";

import { TriangleAlert, Zap, TrendingUp, AlertCircle, Clock, Copy } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";

type ViralResult = {
  score: number;
  verdict: string;
  reasons: string[];
  triggers: string[];
  weaknesses: string[];
  hooks: string[];
  best_format: string;
  best_time: string;
  viral_angle: string;
  similar_viral: string;
};

export function ViralAnalyzer() {
  const locale = useLocale() as "en" | "id";
  const [inputMode, setInputMode] = useState<"topic" | "link">("topic");
  const [topic, setTopic] = useState("");
  const [link, setLink] = useState("");
  const [result, setResult] = useState<ViralResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contentFormat, setContentFormat] = useState("insight");
  const [generatedContent, setGeneratedContent] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatingCard, setGeneratingCard] = useState<number | null>(null);

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const verdictColor = (verdict: string) => {
    if (verdict === "Meledak") return "bg-green-500/20 text-green-400 border-green-500/30";
    if (verdict === "Tinggi") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (verdict === "Sedang") return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const analyze = async () => {
    const source = inputMode === "link" ? link : topic;
    if (!source.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setGeneratedContent("");
    try {
      const res = await fetch("/api/viral", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic: source, locale })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal menganalisis");
        return;
      }
      setResult(data);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const generateViralContent = async () => {
    if (!result) return;
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topic: `${result.viral_angle}. Hook terbaik: ${result.hooks[0] ?? ""}`,
          format: contentFormat,
          tone: "bold",
          locale,
          regenerate: false
        })
      });
      const data = (await res.json()) as { content?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Gagal generate konten.");
        return;
      }
      setGeneratedContent(data.content ?? "");
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setGenerating(false);
    }
  };

  const viralIdeas = [
    { emoji: "🔥", topic: "Loker host live streaming", hook: "Gaji 5 juta sebulan cuma modal ngomong di depan kamera. Ini faktanya.", trigger: "Kesempatan kerja", potential: 95 },
    { emoji: "💸", topic: "UMKM bangkrut karena salah strategi ads", hook: "Saya habiskan Rp 50 juta untuk Meta Ads. Hasilnya nol. Ini yang salah.", trigger: "Fear & loss", potential: 92 },
    { emoji: "😤", topic: "Klien yang tidak mau bayar harga wajar", hook: "Klien minta harga murah, hasil premium. Ini cara saya menolaknya.", trigger: "Frustrasi relatable", potential: 88 },
    { emoji: "🎯", topic: "Side hustle yang benar-benar tembus 10 juta", hook: "Saya coba 7 side hustle. Yang ini saja yang tembus 10 juta per bulan.", trigger: "Aspirasi finansial", potential: 90 },
    { emoji: "📱", topic: "TikTok Shop vs Shopee perbandingan nyata", hook: "Saya jual produk yang sama di dua platform. Ini bedanya dalam 30 hari.", trigger: "Data perbandingan", potential: 87 },
    { emoji: "🧠", topic: "Jebakan produktivitas yang menipu", hook: "Saya kerja 12 jam sehari selama 3 bulan. Revenue tidak naik.", trigger: "Kejutan & validasi", potential: 85 }
  ];
  const generateFromIdea = async (idea: typeof viralIdeas[0], index: number) => {
    setGeneratingCard(index);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topic: idea.topic + ". Hook: " + idea.hook,
          format: "hot_take",
          tone: "bold",
          locale,
          regenerate: false
        })
      });
      const data = await res.json();
      if (data.content) {
        await navigator.clipboard.writeText(data.content);
        alert("Konten berhasil digenerate dan disalin ke clipboard!");
      }
    } catch {
      alert("Gagal generate. Coba lagi.");
    } finally {
      setGeneratingCard(null);
    }
  };
  const canAnalyze = inputMode === "link" ? link.trim() !== "" : topic.trim() !== "";

  return (
    <div className="space-y-3">
      <Card className="space-y-3">
        <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-borderSoft bg-surfaceSecondary">
          <button
            type="button"
            onClick={() => {
              setInputMode("topic");
              setLink("");
            }}
            className={[
              "px-3 py-2 text-sm",
              inputMode === "topic" ? "bg-surface font-medium" : "text-textSecondary hover:bg-surface/60"
            ].join(" ")}
          >
            Topik / Konten
          </button>
          <button
            type="button"
            onClick={() => {
              setInputMode("link");
              setTopic("");
            }}
            className={[
              "px-3 py-2 text-sm",
              inputMode === "link" ? "bg-surface font-medium" : "text-textSecondary hover:bg-surface/60"
            ].join(" ")}
          >
            Dari Link
          </button>
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-textSecondary">Topik atau isi konten yang ingin dianalisis</p>
          {inputMode === "topic" ? (
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: loker host live streaming TikTok gaji 5 juta per bulan... atau paste konten Threads kamu"
              className="min-h-36 w-full resize-y rounded-xl border border-borderSoft bg-surfaceSecondary p-3 text-sm"
            />
          ) : (
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Paste link Threads atau LinkedIn..."
              className="w-full rounded-xl border border-borderSoft bg-surfaceSecondary p-3 text-sm"
            />
          )}
        </div>
        <div className="sticky bottom-2 z-10 -mx-1 flex gap-2 rounded-xl bg-surface/95 p-1 backdrop-blur">
          <Button type="button" onClick={analyze} disabled={loading || !canAnalyze} className="flex-1">
            {loading ? "Menganalisis potensi viral..." : "Analisis Potensi Viral →"}
          </Button>
        </div>
      </Card>

      {loading && (
        <Card>
          <div className="space-y-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-surfaceSecondary" />
            <div className="h-24 animate-pulse rounded-xl bg-surfaceSecondary" />
          </div>
        </Card>
      )}

      {error && (
        <Card>
          <div className="flex items-center gap-2 text-xs text-red-300">
            <TriangleAlert size={14} />
            {error}
          </div>
        </Card>
      )}

      {result && (
        <div className="space-y-3">
          <Card className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-5xl font-bold ${scoreColor(result.score)}`}>{result.score}</div>
              <div className="mt-1 text-xs text-textSecondary">Skor Viral</div>
            </div>
            <div className="flex-1">
              <span className={`inline-block rounded-full border px-3 py-1 text-sm font-medium ${verdictColor(result.verdict)}`}>
                {result.verdict === "Meledak" ? "🔥 " : result.verdict === "Tinggi" ? "⚡ " : ""}
                {result.verdict}
              </span>
              <p className="mt-2 text-sm leading-6 text-textSecondary">{result.viral_angle}</p>
            </div>
          </Card>

          <div className="grid gap-3 md:grid-cols-2">
            <Card className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-textSecondary">
                <TrendingUp size={12} /> Kenapa Berpotensi Viral
              </div>
              <ul className="space-y-1">
                {result.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 text-green-400">✓</span>
                    {r}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-textSecondary">
                <AlertCircle size={12} /> Kelemahan yang Perlu Diperbaiki
              </div>
              <ul className="space-y-1">
                {result.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 text-red-400">✗</span>
                    {w}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-textSecondary">
                <Zap size={12} /> Emotional Triggers
              </div>
              <div className="flex flex-wrap gap-2">
                {result.triggers.map((t, i) => (
                  <span key={i} className="rounded-full border border-borderSoft bg-surfaceSecondary px-3 py-1 text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-textSecondary">
                <Clock size={12} /> Strategi Posting
              </div>
              <p className="text-sm">
                <span className="text-textSecondary">Format terbaik: </span>
                {result.best_format}
              </p>
              <p className="text-sm">
                <span className="text-textSecondary">Waktu terbaik: </span>
                {result.best_time}
              </p>
              <p className="text-sm">
                <span className="text-textSecondary">Referensi viral: </span>
                {result.similar_viral}
              </p>
            </Card>
          </div>

          <Card className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-textSecondary">3 Variasi Hook Siap Pakai</p>
            {result.hooks.map((hook, i) => (
              <div key={i} className="flex items-start justify-between gap-3 rounded-xl border border-borderSoft bg-surfaceSecondary p-3">
                <p className="text-sm leading-6">{hook}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(hook)}
                  className="mt-0.5 flex-shrink-0 text-textSecondary hover:text-textPrimary"
                >
                  <Copy size={14} />
                </button>
              </div>
            ))}
          </Card>

          <Card className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-textSecondary">Buat Konten dari Analisis Ini</p>
            <select
              value={contentFormat}
              onChange={(e) => setContentFormat(e.target.value)}
              className="w-full rounded-xl border border-borderSoft bg-surfaceSecondary p-3 text-sm"
            >
              <option value="insight">Insight Post</option>
              <option value="story">Real Story</option>
              <option value="hot_take">Hot Take</option>
              <option value="myth">Myth Busting</option>
              <option value="long_form">Thread Panjang</option>
            </select>
            <Button type="button" onClick={generateViralContent} disabled={generating} className="w-full">
              {generating ? "Generating..." : "Generate Konten Viral →"}
            </Button>

            {generatedContent ? (
              <div className="space-y-2">
                <pre className="whitespace-pre-wrap rounded-xl border border-borderSoft bg-surfaceSecondary p-3 text-sm leading-7">{generatedContent}</pre>
                <Button type="button" variant="outline" onClick={() => navigator.clipboard.writeText(generatedContent)}>
                  <Copy size={14} className="mr-1" />
                  Copy
                </Button>
              </div>
            ) : null}
          </Card>
        </div>
      )}

      <div className="space-y-3 pt-2">
        <div>
          <h2 className="text-sm font-medium">Ide Konten Berpotensi Viral</h2>
          <p className="mt-1 text-xs text-textSecondary">
            Topik yang sedang relevan dan berpotensi meledak di Threads — klik Analisis untuk cek skor, atau Generate untuk langsung buat konten.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {viralIdeas.map((idea, i) => (
            <Card key={i} className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{idea.emoji}</span>
                  <p className="text-sm font-medium leading-5">{idea.topic}</p>
                </div>
                <span
                  className={`flex-shrink-0 text-sm font-bold ${
                    idea.potential >= 90 ? "text-green-400" : idea.potential >= 85 ? "text-yellow-400" : "text-orange-400"
                  }`}
                >
                  {idea.potential}
                </span>
              </div>

              <p className="text-sm italic leading-6 text-textSecondary">{`${idea.hook}`}</p>

              <div className="flex items-center justify-between">
                <span className="rounded-full border border-borderSoft bg-surfaceSecondary px-2 py-0.5 text-xs text-textSecondary">
                  {idea.trigger}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTopic(idea.topic);
                      setInputMode("topic");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Analisis →
                  </Button>
                  <Button type="button" size="sm" onClick={() => generateFromIdea(idea, i)} disabled={generatingCard === i}>
                    {generatingCard === i ? "..." : "Generate →"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
