import enTranslation from "./locales/en.json";
import itTranslation from "./locales/it.json";

export const resources = {
  en: {
    translation: enTranslation,
  },
  it: {
    translation: itTranslation,
  },
} as const;

export type AppLocale = keyof typeof resources;
