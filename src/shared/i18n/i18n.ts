import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';

const fallbackLanguage = 'en';

void i18n.use(initReactI18next).init({
  resources,
  fallbackLng: fallbackLanguage,
  interpolation: {
    escapeValue: false,
  },
  defaultNS: 'translation',
});

export { i18n };
