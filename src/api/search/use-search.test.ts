import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import * as React from 'react';

import { storage } from '@/lib/storage';

import { useBrCosmeticsSearch } from './use-search';

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

// Mock storage
jest.mock('@/lib/storage', () => ({
  storage: {
    getString: jest.fn(),
    setString: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
const mockGetString = storage.getString as jest.MockedFunction<
  typeof storage.getString
>;

// Helper function to create query client
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
};

// Helper function to render hook with provider
const renderHookWithProvider = (hook: () => any) => {
  const queryClient = createQueryClient();
  return renderHook(hook, {
    wrapper: ({ children }: { children: React.ReactNode }) => {
      return React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );
    },
  });
};

// Helper function to setup default mocks
const setupDefaultMocks = () => {
  mockGetString.mockReturnValue('fr');
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ data: [] }),
  } as Response);
};

describe('useBrCosmeticsSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDefaultMocks();
  });

  it('should fetch cosmetics with correct URL and parameters', async () => {
    const { result } = renderHookWithProvider(() =>
      useBrCosmeticsSearch({ query: 'test', rarity: 'rare' })
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          '/cosmetics/br/search/all?query=test&rarity=rare&language=fr'
        ),
        expect.any(Object)
      );
    });
  });

  it('should handle empty search parameters', async () => {
    const { result } = renderHookWithProvider(() => useBrCosmeticsSearch({}));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/cosmetics/br/search/all?language=fr'),
        expect.any(Object)
      );
    });
  });

  it('should handle multiple search parameters', async () => {
    const { result } = renderHookWithProvider(() =>
      useBrCosmeticsSearch({
        query: 'outfit',
        rarity: 'legendary',
        type: 'outfit',
        series: 'marvel',
      })
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          '/cosmetics/br/search/all?query=outfit&rarity=legendary&type=outfit&series=marvel&language=fr'
        ),
        expect.any(Object)
      );
    });
  });
});
