import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'pt'],
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    react: {
      useSuspense: true,
    },
    backend: {
      loadPath: '/life-in-weeks/locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['querystring', 'navigator', 'localStorage'],
      caches: ['localStorage'],
      lookupQuerystring: 'l',
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
