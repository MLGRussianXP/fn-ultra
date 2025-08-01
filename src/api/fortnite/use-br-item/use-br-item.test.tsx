import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { getLocales } from 'expo-localization';
import * as React from 'react';

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

// Mock storage
jest.mock('@/lib/storage', () => ({
  storage: {
    getString: jest.fn(),
    setString: jest.fn(),
    clearAll: jest.fn(),
    set: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

// Helper function to setup mocks
const setupMocks = () => {
  jest.clearAllMocks();
  (storage as any).clearAll();
  (getLocales as jest.Mock).mockReturnValue([
    { languageCode: 'fr', regionCode: 'FR' },
  ]);
};

// Helper function to create query client
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  });
};

// Helper function to setup wrapper
const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

// Helper function to setup test environment
const setupTestEnvironment = () => {
  setupMocks();
  const queryClient = createQueryClient();
  const wrapper = createWrapper(queryClient);
  return { queryClient, wrapper };
};

// Helper function to test system language parameter
const testSystemLanguageParameter = async (wrapper: any) => {
  const itemId = 'test-item-id';

  renderHook(() => useBrItem(itemId), { wrapper });

  // Wait for the query to execute
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalled();
  });

  await waitFor(() => {
    const callArgs = (global.fetch as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toContain('language=fr');
  });
};

// Helper function to test selected language
const testSelectedLanguage = async (wrapper: any) => {
  // Set the language to Russian before rendering the hook
  (storage as any).getString.mockReturnValue('ru');

  const itemId = 'test-item-id';

  renderHook(() => useBrItem(itemId), { wrapper });

  // Wait for the query to execute
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalled();
  });

  await waitFor(() => {
    const callArgs = (global.fetch as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toContain('language=ru');
  });
};

// Helper function to test fallback language
const testFallbackLanguage = async (wrapper: any) => {
  // Reset storage mock to return null (no stored language)
  (storage as any).getString.mockReturnValue(null);

  // Set an unsupported system language
  (getLocales as jest.Mock).mockReturnValue([
    { languageCode: 'xyz', regionCode: 'XY' },
  ]);

  const itemId = 'test-item-id';

  renderHook(() => useBrItem(itemId), { wrapper });

  // Wait for the query to execute
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalled();
  });

  await waitFor(() => {
    const callArgs = (global.fetch as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toContain('language=en');
  });
};

describe('useBrItem', () => {
  let queryClient: QueryClient;
  let wrapper: ({
    children,
  }: {
    children: React.ReactNode;
  }) => React.ReactElement;

  beforeEach(() => {
    const testEnv = setupTestEnvironment();
    queryClient = testEnv.queryClient;
    wrapper = testEnv.wrapper;
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('includes system language parameter in the API call when no language is set', async () => {
    await testSystemLanguageParameter(wrapper);
  });

  it('uses the selected language in the API call', async () => {
    await testSelectedLanguage(wrapper);
  });

  it('falls back to English if system language is not supported', async () => {
    await testFallbackLanguage(wrapper);
  });
});
