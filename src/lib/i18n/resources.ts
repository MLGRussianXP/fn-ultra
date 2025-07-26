import en from '@/translations/en.json';
import ru from '@/translations/ru.json';

export const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
};

export type Language = keyof typeof resources;
