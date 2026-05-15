import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SettingsState = {
  persona: string;
  niche: string;
  defaultTone: string;
  defaultFormat: string;
  setPersona: (v: string) => void;
  setNiche: (v: string) => void;
  setDefaultTone: (v: string) => void;
  setDefaultFormat: (v: string) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      persona: "",
      niche: "",
      defaultTone: "casual",
      defaultFormat: "insight",
      setPersona: (v) => set({ persona: v }),
      setNiche: (v) => set({ niche: v }),
      setDefaultTone: (v) => set({ defaultTone: v }),
      setDefaultFormat: (v) => set({ defaultFormat: v }),
    }),
    { name: "threadforge-settings-v1", storage: createJSONStorage(() => localStorage) }
  )
);
