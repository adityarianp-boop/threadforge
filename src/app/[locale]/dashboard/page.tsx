"use client";

import { useState } from "react";
import { FlaskConical, Lightbulb, TrendingUp, Wand2 } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { useHistoryStore } from "@/store/history-store";
import { useSettingsStore } from "@/store/settings-store";
import type { HistoryKind } from "@/types/history";

function reusePath(locale: string, kind: HistoryKind) {
  if (kind === "generator") return `/${locale}/generator`;
  if (kind === "atm") return `/${locale}/atm`;
  return `/${locale}/ideas`;
}

export default function DashboardPage() {
  useTranslations();
  const [quickTopic, setQuickTopic] = useState("");
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickResult, setQuickResult] = useState("");
  const router = useRouter();
  const locale = useLocale();
  const { persona, niche, defaultTone, defaultFormat } = useSettingsStore();
  const items = useHistoryStore((state) => state.items);

  const starterPrompts = [
    "Kenapa ROAS tinggi belum tentu bisnis untung",
    "Hal yang gue pelajari setelah gagal di bulan pertama",
    "Kesalahan yang sering dilakukan owner skincare lokal",
    "Loker host live streaming: peluang atau jebakan?",
    "Kenapa konten jelek kadang lebih viral dari yang rapi"
  ];

  const quickGenerate = async () => {
    if (!quickTopic.trim() || quickTopic.trim().length < 3) return;
    setQuickLoading(true);
    setQuickResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topic: quickTopic,
          format: defaultFormat || "insight",
          tone: defaultTone || "casual",
          locale,
          regenerate: false,
          persona,
          niche
        })
      });
      const data = await res.json();
      if (data.content) setQuickResult(data.content);
    } catch {
      /* ignore */
    } finally {
      setQuickLoading(false);
    }
  };

  const totalGenerate = items.filter((item) => item.kind === "generator").length;
  const totalAtm = items.filter((item) => item.kind === "atm").length;
  const totalIde = items.filter((item) => item.kind === "idea").length;
  const latestItems = items.slice(0, 5);

  const hasPersona = persona.trim().length > 0;

  const quickActions = [
    { href: `/${locale}/generator`, icon: Wand2, title: "Generate Konten", desc: "Buat konten Threads baru" },
    { href: `/${locale}/atm`, icon: FlaskConical, title: "ATM Analyzer", desc: "Amati, tiru, modifikasi konten viral" },
    { href: `/${locale}/viral`, icon: TrendingUp, title: "Riset Viral", desc: "Cek potensi viral topikmu" },
    { href: `/${locale}/ideas`, icon: Lightbulb, title: "Mesin Ide", desc: "Generate ide konten mindblowing" }
  ] as const;

  const openReuse = (item: { content: string; kind: HistoryKind }) => {
    sessionStorage.setItem("threadforge-reuse", JSON.stringify({ content: item.content, kind: item.kind }));
    router.push(reusePath(locale, item.kind) as any);
  };

  return (
    <div className="space-y-8">
      <Card className="space-y-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-textSecondary">Quick Generate</p>
          <p className="mt-1 text-sm text-textSecondary">Tulis topik atau pilih starter prompt di bawah</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setQuickTopic(prompt)}
              className="rounded-full border border-borderSoft bg-surfaceSecondary px-3 py-1 text-xs text-textSecondary transition-colors hover:border-accent hover:text-textPrimary"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={quickTopic}
            onChange={(e) => setQuickTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && quickGenerate()}
            placeholder="Ketik topik konten Threads kamu..."
            className="flex-1 rounded-xl border border-borderSoft bg-surfaceSecondary px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <Button type="button" onClick={quickGenerate} disabled={quickLoading || quickTopic.trim().length < 3}>
            {quickLoading ? "..." : "Generate →"}
          </Button>
        </div>

        {quickLoading && (
          <div className="space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-surfaceSecondary" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-surfaceSecondary" />
            <div className="h-3 w-3/5 animate-pulse rounded bg-surfaceSecondary" />
          </div>
        )}

        {quickResult && !quickLoading && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm leading-7">{quickResult}</pre>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(quickResult)}>
                Salin
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  sessionStorage.setItem("threadforge-reuse", JSON.stringify({ kind: "generator", content: quickTopic }));
                  router.push("/generator" as any);
                }}
              >
                Buka di Generator →
              </Button>
            </div>
          </div>
        )}
      </Card>

      <section>
        {hasPersona ? (
          <h1 className="text-2xl font-semibold text-textPrimary">
            Halo, {niche.trim() || "creator"} 👋
          </h1>
        ) : (
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-textPrimary">Selamat datang di ThreadForge</h1>
            <p className="max-w-lg text-sm text-textSecondary">
              Setup persona kamu dulu biar AI lebih ngerti gaya nulis lo.
            </p>
            <Link
              href={`/${locale}/settings`}
              className="mt-1 inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
              Buka pengaturan
            </Link>
          </div>
        )}
      </section>

      <section>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {quickActions.map(({ href, icon: Icon, title, desc }) => (
            <Link key={href} href={href} className="group block">
              <Card className="h-full transition-colors hover:border-accent/40 hover:bg-surfaceSecondary/80">
                <div className="flex flex-col gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-borderSoft bg-surfaceSecondary text-accent group-hover:border-accent/30">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <p className="text-sm font-semibold text-textPrimary">{title}</p>
                  <p className="text-xs leading-snug text-textSecondary">{desc}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="grid gap-3 md:grid-cols-3">
          <Card className="py-4">
            <p className="text-[11px] uppercase tracking-wider text-textSecondary">Total Generate</p>
            <p className="mt-1 text-xl font-semibold text-textPrimary">{totalGenerate}</p>
            <p className="mt-1 text-xs text-textSecondary">Jumlah konten generator yang sudah dibuat.</p>
          </Card>
          <Card className="py-4">
            <p className="text-[11px] uppercase tracking-wider text-textSecondary">Total ATM</p>
            <p className="mt-1 text-xl font-semibold text-textPrimary">{totalAtm}</p>
            <p className="mt-1 text-xs text-textSecondary">Total analisis Amati Tiru Modifikasi.</p>
          </Card>
          <Card className="py-4">
            <p className="text-[11px] uppercase tracking-wider text-textSecondary">Total Ide</p>
            <p className="mt-1 text-xl font-semibold text-textPrimary">{totalIde}</p>
            <p className="mt-1 text-xs text-textSecondary">Jumlah ide yang pernah digenerate.</p>
          </Card>
        </div>
      </section>

      <Card className="space-y-3">
        <h2 className="text-sm font-semibold">Riwayat Terbaru</h2>
        {latestItems.length ? (
          <div className="space-y-2">
            {latestItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-lg border border-borderSoft bg-surfaceSecondary p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 inline-flex rounded-full border border-borderSoft px-2 py-0.5 text-[11px] uppercase tracking-wide text-textSecondary">
                    {item.kind === "generator" ? "Generator" : item.kind === "atm" ? "ATM" : "Ide"}
                  </div>
                  <p className="text-sm font-medium text-textPrimary">{item.title}</p>
                  <p className="mt-1 text-xs text-textSecondary">{item.locale}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 self-start sm:self-center"
                  onClick={() => openReuse(item)}
                >
                  Buka lagi →
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-textSecondary">Belum ada aktivitas.</p>
        )}
      </Card>
    </div>
  );
}
