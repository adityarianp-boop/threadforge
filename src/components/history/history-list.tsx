"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/shared/card";
import { Button } from "@/components/shared/button";
import { useHistoryStore } from "@/store/history-store";
import type { HistoryKind } from "@/types/history";

export function HistoryList() {
  const t = useTranslations("history");
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<HistoryKind | "all">("all");
  const items = useHistoryStore((state) => state.items);
  const filterItems = useHistoryStore((state) => state.filterItems);
  const clearAll = useHistoryStore((state) => state.clearAll);

  const filtered = useMemo(() => filterItems(query, kind), [filterItems, kind, query]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(["all", "generator", "idea", "atm"] as const).map((value) => (
          <Button key={value} size="sm" variant={kind === value ? "default" : "outline"} onClick={() => setKind(value)}>
            {value}
          </Button>
        ))}
        <Button size="sm" variant="outline" onClick={clearAll} className="ml-auto">{t("clear")}</Button>
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("search")}
        className="w-full rounded-xl border border-borderSoft bg-surfaceSecondary p-3"
      />

      <div className="space-y-2">
        {filtered.map((item) => (
          <Card key={item.id}>
            <p className="text-xs uppercase tracking-wider text-textSecondary">{item.kind} · {new Date(item.createdAt).toLocaleString()}</p>
            <p className="mt-1 text-sm font-medium">{item.title}</p>
            <pre className="mt-2 whitespace-pre-wrap text-sm text-textSecondary">{item.content}</pre>
          </Card>
        ))}
        {!filtered.length ? <Card><p className="text-sm text-textSecondary">{t("empty")}</p></Card> : null}
      </div>
    </div>
  );
}
