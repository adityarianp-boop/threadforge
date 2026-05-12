export type HistoryKind = "generator" | "idea" | "atm";

export type HistoryItem = {
  id: string;
  kind: HistoryKind;
  title: string;
  content: string;
  locale: string;
  createdAt: string;
};
