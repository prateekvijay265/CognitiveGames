import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import as_ from '../locales/as.json';
import mni from '../locales/mni.json';
import kha from '../locales/kha.json';
import lus from '../locales/lus.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      as: { translation: as_ },
      mni: { translation: mni },
      kha: { translation: kha },
      lus: { translation: lus },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'smriti_language',
    },
  });

export default i18n;

export const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', nativeName: 'English', region: 'All regions' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'All regions' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'Assam' },
  { code: 'mni', name: 'Meitei', nativeName: 'মৈতৈলোন্', region: 'Manipur' },
  { code: 'kha', name: 'Khasi', nativeName: 'Ka Ktien Khasi', region: 'Meghalaya' },
  { code: 'lus', name: 'Mizo', nativeName: 'Mizo ṭawng', region: 'Mizoram' },
] as const;
