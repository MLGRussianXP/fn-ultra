import { getLocales } from 'expo-localization';

import { storage } from '@/lib/storage';

import { getLanguage, LOCAL } from './utils';

// Mock expo-localization
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(),
}));

describe('i18n utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.clearAll();
    (getLocales as jest.Mock).mockReset();
  });

  describe('getLanguage', () => {
    it('should return the stored language if available', () => {
      storage.set(LOCAL, 'ru');
      expect(getLanguage()).toBe('ru');
    });

    it('should use system language if no stored language and system language is supported', () => {
      (getLocales as jest.Mock).mockReturnValue([
        { languageCode: 'ru', regionCode: 'RU' },
      ]);
      expect(getLanguage()).toBe('ru');
    });

    it('should fall back to English if system language is not supported', () => {
      (getLocales as jest.Mock).mockReturnValue([
        { languageCode: 'xyz', regionCode: 'XY' },
      ]);
      expect(getLanguage()).toBe('en');
    });

    it('should handle pt-BR special case', () => {
      (getLocales as jest.Mock).mockReturnValue([
        { languageCode: 'pt', regionCode: 'BR' },
      ]);
      expect(getLanguage()).toBe('pt-BR');
    });

    it('should handle es-419 special case for Latin American countries', () => {
      (getLocales as jest.Mock).mockReturnValue([
        { languageCode: 'es', regionCode: 'MX' },
      ]);
      expect(getLanguage()).toBe('es-419');
    });

    it('should handle zh-Hans special case for Simplified Chinese regions', () => {
      (getLocales as jest.Mock).mockReturnValue([
        { languageCode: 'zh', regionCode: 'CN' },
      ]);
      expect(getLanguage()).toBe('zh-Hans');
    });

    it('should handle zh-Hant special case for Traditional Chinese regions', () => {
      (getLocales as jest.Mock).mockReturnValue([
        { languageCode: 'zh', regionCode: 'TW' },
      ]);
      expect(getLanguage()).toBe('zh-Hant');
    });

    it('should default to zh-Hans for other Chinese regions', () => {
      (getLocales as jest.Mock).mockReturnValue([
        { languageCode: 'zh', regionCode: 'OTHER' },
      ]);
      expect(getLanguage()).toBe('zh-Hans');
    });

    it('should fall back to English if no locale information is available', () => {
      (getLocales as jest.Mock).mockReturnValue([]);
      expect(getLanguage()).toBe('en');
    });
  });
});
