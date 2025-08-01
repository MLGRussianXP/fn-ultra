import en from '@/translations/en.json';
import ru from '@/translations/ru.json';

export const resources = {
  ar: {
    translation: en, // Fallback to English
  },
  de: {
    translation: en, // Fallback to English
  },
  en: {
    translation: en,
  },
  es: {
    translation: en, // Fallback to English
  },
  'es-419': {
    translation: en, // Fallback to English
  },
  fr: {
    translation: en, // Fallback to English
  },
  id: {
    translation: en, // Fallback to English
  },
  it: {
    translation: en, // Fallback to English
  },
  ja: {
    translation: en, // Fallback to English
  },
  ko: {
    translation: en, // Fallback to English
  },
  pl: {
    translation: en, // Fallback to English
  },
  'pt-BR': {
    translation: en, // Fallback to English
  },
  ru: {
    translation: ru,
  },
  th: {
    translation: en, // Fallback to English
  },
  tr: {
    translation: en, // Fallback to English
  },
  vi: {
    translation: en, // Fallback to English
  },
  'zh-Hans': {
    translation: en, // Fallback to English
  },
  'zh-Hant': {
    translation: en, // Fallback to English
  },
};

export type Language = keyof typeof resources;
