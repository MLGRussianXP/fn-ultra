/**
 * Common API utilities
 * @module api/common/utils
 */

import { getLanguage } from '@/lib/i18n/utils';

export * from './normalize-pages';
export * from './pagination';
export * from './query-key';
export * from './url-parameters';

/**
 * Gets the current language for API requests
 * @returns The current language code
 */
export const getCurrentLanguage = (): string => {
  return getLanguage();
};
