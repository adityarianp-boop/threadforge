import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SettingsState = {
  persona: string;
  niche: string;
  defaultTone: string;
  defaultFormat: string;
  recentTopics: string[];
  recentFormats: string[];
  setPersona: (v: string) => void;
  setNiche: (v: string) => void;
  setDefaultTone: (v: string) => void;
  setDefaultFormat: (v: string) => void;
  addRecentTopic: (topic: string) => void;
  addRecentFormat: (format: string) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      persona: "",
      niche: "",
      defaultTone: "casual",
      defaultFormat: "insight",
      recentTopics: [],
      recentFormats: [],
      setPersona: (v) => set({ persona: v }),
      setNiche: (v) => set({ niche: v }),
      setDefaultTone: (v) => set({ defaultTone: v }),
      setDefaultFormat: (v) => set({ defaultFormat: v }),
      addRecentTopic: (topic) =>
        set((state) => ({
          recentTopics: [topic, ...state.recentTopics.filter((t) => t !== topic)].slice(0, 10),
        })),
      addRecentFormat: (format) =>
        set((state) => ({
          recentFormats: [format, ...state.recentFormats.filter((f) => f !== format)].slice(0, 5),
        })),
    }),
    { name: "threadforge-settings-v1", storage: createJSONStorage(() => localStorage) }
  )
);
