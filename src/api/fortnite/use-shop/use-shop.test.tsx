import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-native';
import { getLocales } from 'expo-localization';
import * as React from 'react';

import { LOCAL } from '@/lib/i18n/utils';
import { storage } from '@/lib/storage';

import { useShop } from './use-shop';

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

// Mock the useQuery function to expose the queryKey
jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: jest.fn(({ queryKey }) => ({
      queryKey,
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: { data: {} },
    })),
  };
});

describe('useShop', () => {
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

  it('includes the system language in query key when no language is set', () => {
    const { result } = renderHook(() => useShop(), { wrapper });
    const queryResult = result.current as any; // Type assertion to avoid TypeScript errors

    // Check that the query key includes the system language parameter
    expect(queryResult.queryKey).toEqual([
      'fortnite',
      'shop',
      { language: 'fr' },
    ]);
  });

  it('includes the selected language in query key', () => {
    // Set the language to Russian
    storage.set(LOCAL, 'ru');

    const { result } = renderHook(() => useShop(), { wrapper });
    const queryResult = result.current as any; // Type assertion to avoid TypeScript errors

    // Check that the query key includes the language parameter
    expect(queryResult.queryKey).toEqual([
      'fortnite',
      'shop',
      { language: 'ru' },
    ]);
  });

  it('falls back to English if system language is not supported', () => {
    // Set an unsupported system language
    (getLocales as jest.Mock).mockReturnValue([
      { languageCode: 'xyz', regionCode: 'XY' },
    ]);

    const { result } = renderHook(() => useShop(), { wrapper });
    const queryResult = result.current as any; // Type assertion to avoid TypeScript errors

    // Check that the query key includes English as fallback
    expect(queryResult.queryKey).toEqual([
      'fortnite',
      'shop',
      { language: 'en' },
    ]);
  });
});
