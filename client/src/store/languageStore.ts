import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type Language = 'en' | 'fr';

type State = {
  language: Language;
};

type Action = {
  setLanguage: (language: Language) => void;
};

type LanguageStore = State & Action;

export const useLanguageStore = create<LanguageStore>()(
  devtools(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    { name: 'LanguageStore' }
  )
);
