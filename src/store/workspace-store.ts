import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Draft = {
  id: string;
  topic: string;
  content: string;
  format: string;
  tone: string;
  createdAt: string;
  pinned: boolean;
};

type SavedHook = {
  id: string;
  text: string;
  source: string;
  createdAt: string;
};

type WorkspaceState = {
  drafts: Draft[];
  savedHooks: SavedHook[];
  saveDraft: (draft: Omit<Draft, "id" | "createdAt" | "pinned">) => void;
  deleteDraft: (id: string) => void;
  pinDraft: (id: string) => void;
  saveHook: (text: string, source: string) => void;
  deleteHook: (id: string) => void;
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      drafts: [],
      savedHooks: [],
      saveDraft: (draft) =>
        set((state) => ({
          drafts: [{ ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString(), pinned: false }, ...state.drafts].slice(0, 50),
        })),
      deleteDraft: (id) => set((state) => ({ drafts: state.drafts.filter((d) => d.id !== id) })),
      pinDraft: (id) => set((state) => ({ drafts: state.drafts.map((d) => (d.id === id ? { ...d, pinned: !d.pinned } : d)) })),
      saveHook: (text, source) =>
        set((state) => ({
          savedHooks: [{ id: crypto.randomUUID(), text, source, createdAt: new Date().toISOString() }, ...state.savedHooks].slice(0, 100),
        })),
      deleteHook: (id) => set((state) => ({ savedHooks: state.savedHooks.filter((h) => h.id !== id) })),
    }),
    { name: "threadforge-workspace-v1", storage: createJSONStorage(() => localStorage) }
  )
);
