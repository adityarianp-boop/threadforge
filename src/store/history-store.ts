"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { HistoryItem, HistoryKind } from "@/types/history";

type AddPayload = Omit<HistoryItem, "id" | "createdAt">;
const MAX_ITEMS = 200;

const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

const safeStorage = createJSONStorage(() => {
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
});

type HistoryState = {
  items: HistoryItem[];
  addItem: (payload: AddPayload) => void;
  clearAll: () => void;
  filterItems: (query: string, kind: HistoryKind | "all") => HistoryItem[];
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (payload) =>
        set((state) => {
          const key = `${payload.kind}:${normalize(payload.title)}:${normalize(payload.content).slice(0, 220)}`;
          const withoutDuplicate = state.items.filter(
            (item) => `${item.kind}:${normalize(item.title)}:${normalize(item.content).slice(0, 220)}` !== key
          );

          const next = [
            {
              ...payload,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString()
            },
            ...withoutDuplicate
          ]
            .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
            .slice(0, MAX_ITEMS);

          return { items: next };
        }),
      clearAll: () => set({ items: [] }),
      filterItems: (query, kind) => {
        const q = normalize(query);
        return get().items.filter((item) => {
          const byKind = kind === "all" || item.kind === kind;
          const haystack = `${item.title} ${item.content} ${item.locale} ${item.kind}`.toLowerCase();
          return byKind && (!q || haystack.includes(q));
        });
      }
    }),
    { name: "threadforge-history-v1", storage: safeStorage }
  )
);
