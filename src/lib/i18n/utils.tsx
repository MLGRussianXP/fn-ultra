import { getLocales } from 'expo-localization';
import type TranslateOptions from 'i18next';
import { changeLanguage as i18nextChangeLanguage, t } from 'i18next';
import memoize from 'lodash.memoize';
import { useCallback } from 'react';
import { I18nManager, NativeModules, Platform } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';
import RNRestart from 'react-native-restart';

import { storage } from '@/lib/storage';

import type { Language } from './resources';
import { resources } from './resources';
import type { RecursiveKeyOf } from './types';

type DefaultLocale = typeof resources.en.translation;
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>;

export const LOCAL = 'local';

/**
 * Gets the current language from storage or system locale
 * @returns The language code to use
 */
export const getLanguage = (): Language => {
  // First check if user has explicitly set a language
  const storedLanguage = storage.getString(LOCAL);
  if (storedLanguage) return storedLanguage as Language;

  // If no stored language, try to use system language
  const deviceLanguage = getLocales()[0]?.languageCode;
  const deviceRegion = getLocales()[0]?.regionCode;

  // Check for special cases like pt-BR, es-419, zh-Hans, zh-Hant
  if (deviceLanguage === 'pt' && deviceRegion === 'BR') {
    return 'pt-BR';
  }

  if (
    deviceLanguage === 'es' &&
    [
      'MX',
      'AR',
      'CO',
      'CL',
      'PE',
      'VE',
      'EC',
      'GT',
      'CU',
      'BO',
      'DO',
      'HN',
      'PY',
      'SV',
      'NI',
      'CR',
      'PA',
      'UY',
    ].includes(deviceRegion || '')
  ) {
    return 'es-419';
  }

  if (deviceLanguage === 'zh') {
    // Simplified Chinese is used in mainland China, Singapore, and Malaysia
    if (['CN', 'SG', 'MY'].includes(deviceRegion || '')) {
      return 'zh-Hans';
    }
    // Traditional Chinese is used in Taiwan, Hong Kong, and Macau
    if (['TW', 'HK', 'MO'].includes(deviceRegion || '')) {
      return 'zh-Hant';
    }
    // Default to simplified if region is unknown
    return 'zh-Hans';
  }

  // For other languages, check if they're supported
  if (deviceLanguage && Object.keys(resources).includes(deviceLanguage)) {
    return deviceLanguage as Language;
  }

  // Default to English if system language is not supported
  return 'en';
};

export const translate = memoize(
  (key: TxKeyPath, options = undefined) => t(key, options) as unknown as string,
  (key: TxKeyPath, options: typeof TranslateOptions) =>
    options ? key + JSON.stringify(options) : key
);

export const changeLanguage = (lang: Language) => {
  i18nextChangeLanguage(lang);
  I18nManager.forceRTL(false);
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    if (__DEV__) NativeModules.DevSettings.reload();
    else RNRestart.restart();
  } else if (Platform.OS === 'web') {
    window.location.reload();
  }
};

export const useSelectedLanguage = () => {
  const [language, setLang] = useMMKVString(LOCAL);
  const currentLanguage = language || getLanguage();

  const setLanguage = useCallback(
    (lang: Language) => {
      setLang(lang);
      if (lang !== undefined) changeLanguage(lang as Language);
    },
    [setLang]
  );

  return { language: currentLanguage as Language, setLanguage };
};
