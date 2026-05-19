"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useSettingsStore } from "@/store/settings-store";
import { Card } from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { Copy, RefreshCw, TriangleAlert } from "lucide-react";

const replyStyles = [
  { id: "observational", label: "Observasional", desc: "Balas dengan nuansa, bukan jawaban langsung" },
  { id: "witty", label: "Witty", desc: "Sharp, clever, internet-timing" },
  { id: "soft_disagree", label: "Soft Disagree", desc: "Tidak setuju tapi tidak agresif" },
  { id: "authority", label: "Authority", desc: "Dari pengalaman, bukan ego" },
  { id: "empathetic", label: "Empatik", desc: "Acknowledge dulu, baru tambahkan" },
] as const;

type ReplyStyle = (typeof replyStyles)[number]["id"];

export default function ReplyPage() {
  const locale = useLocale() as "en" | "id";
  const { persona } = useSettingsStore();
  const [originalPost, setOriginalPost] = useState("");
  const [comment, setComment] = useState("");
  const [style, setStyle] = useState<ReplyStyle>("observational");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!originalPost.trim() || !comment.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ originalPost, comment, replyStyle: style, locale, persona }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal generate");
        return;
      }
      setResult(data.reply);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-borderSoft bg-surfaceSecondary p-3 text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-medium">AI Reply Strategist</h1>
        <p className="mt-1 text-sm text-textSecondary">
          Balas komen dengan cara yang autentik, nuanced, dan sesuai identitasmu.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider text-textSecondary">
            Post kamu (opsional, untuk konteks)
          </label>
          <textarea
            value={originalPost}
            onChange={(e) => setOriginalPost(e.target.value)}
            className={`${inputClass} min-h-[80px] resize-y`}
            placeholder="Paste isi postingan kamu yang mendapat komentar..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider text-textSecondary">
            Komentar yang ingin dibalas
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={`${inputClass} min-h-[70px] resize-y`}
            placeholder="Paste komentar yang ingin kamu balas..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider text-textSecondary">Gaya balasan</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {replyStyles.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s.id)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  style === s.id
                    ? "border-accent bg-accent/10"
                    : "border-borderSoft bg-surfaceSecondary hover:border-accent/40"
                }`}
              >
                <p className={`text-sm font-medium ${style === s.id ? "text-accent" : "text-textPrimary"}`}>
                  {s.label}
                </p>
                <p className="text-xs text-textSecondary mt-0.5">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <Button type="button" onClick={generate} disabled={loading || !comment.trim()} className="w-full">
          {loading ? "Generating..." : "Generate Reply →"}
        </Button>
      </Card>

      {error && (
        <Card>
          <div className="flex items-center gap-2 text-xs text-red-300">
            <TriangleAlert size={14} />
            {error}
          </div>
        </Card>
      )}

      {result && (
        <Card className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-textSecondary">Reply suggestion</p>
          <p className="text-sm leading-7 text-textPrimary">{result}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(result)}>
              <Copy size={13} className="mr-1" />
              Salin
            </Button>
            <Button size="sm" variant="outline" onClick={generate} disabled={loading}>
              <RefreshCw size={13} className="mr-1" />
              Variasi lain
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
