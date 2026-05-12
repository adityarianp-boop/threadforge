"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/shared/card";
import { useHistoryStore } from "@/store/history-store";

export default function DashboardPage() {
  useTranslations();
  const items = useHistoryStore((state) => state.items);

  const totalGenerate = items.filter((item) => item.kind === "generator").length;
  const totalAtm = items.filter((item) => item.kind === "atm").length;
  const totalIde = items.filter((item) => item.kind === "idea").length;
  const latestItems = items.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-textSecondary">Total Generate</p>
          <p className="mt-2 text-3xl font-semibold">{totalGenerate}</p>
          <p className="mt-1 text-sm text-textSecondary">Jumlah konten generator yang sudah dibuat.</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-textSecondary">Total ATM</p>
          <p className="mt-2 text-3xl font-semibold">{totalAtm}</p>
          <p className="mt-1 text-sm text-textSecondary">Total analisis Amati Tiru Modifikasi.</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-textSecondary">Total Ide</p>
          <p className="mt-2 text-3xl font-semibold">{totalIde}</p>
          <p className="mt-1 text-sm text-textSecondary">Jumlah ide yang pernah digenerate.</p>
        </Card>
      </div>

      <Card className="space-y-3">
        <h2 className="text-sm font-semibold">Riwayat Terbaru</h2>
        {latestItems.length ? (
          <div className="space-y-2">
            {latestItems.map((item) => (
              <div key={item.id} className="rounded-lg border border-borderSoft bg-surfaceSecondary p-3">
                <div className="mb-1 inline-flex rounded-full border border-borderSoft px-2 py-0.5 text-[11px] uppercase tracking-wide text-textSecondary">
                  {item.kind === "generator" ? "Generator" : item.kind === "atm" ? "ATM" : "Ide"}
                </div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-textSecondary">{item.locale}</p>
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
