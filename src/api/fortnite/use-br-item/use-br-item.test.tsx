import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';
import { getLocales } from 'expo-localization';
import * as React from 'react';

import { LOCAL } from '@/lib/i18n/utils';
import { storage } from '@/lib/storage';

import { useBrItem } from './use-br-item';

// Mock expo-localization
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [{ languageCode: 'fr', regionCode: 'FR' }]),
}));

// Mock the getCurrentLanguage function to use the real implementation
jest.mock('@/api/common/utils', () => {
  const originalModule = jest.requireActual('@/api/common/utils');
  return {
    ...originalModule,
    getCurrentLanguage: jest.requireActual('@/lib/i18n/utils').getLanguage,
  };
});

// Mock fetch to prevent actual API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response)
);

describe('useBrItem', () => {
  const testItemId = 'test-item-id';
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    storage.clearAll();
    (getLocales as jest.Mock).mockReturnValue([
      { languageCode: 'fr', regionCode: 'FR' },
    ]);

    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  it('includes language parameter in the API call', () => {
    renderHook(() => useBrItem(testItemId), { wrapper });

    // Check that fetch was called with the language parameter
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`?language=fr`)
    );
  });

  it('uses the selected language in the API call', () => {
    // Set the language to Russian
    storage.set(LOCAL, 'ru');

    renderHook(() => useBrItem(testItemId), { wrapper });

    // Check that fetch was called with the language parameter
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`?language=ru`)
    );
  });

  it('falls back to English if system language is not supported', () => {
    // Set an unsupported system language
    (getLocales as jest.Mock).mockReturnValue([
      { languageCode: 'xyz', regionCode: 'XY' },
    ]);

    renderHook(() => useBrItem(testItemId), { wrapper });

    // Check that fetch was called with English as fallback
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`?language=en`)
    );
  });
});
