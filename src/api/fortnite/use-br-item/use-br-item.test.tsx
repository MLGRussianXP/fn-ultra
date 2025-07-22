import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import { useBrItem } from './use-br-item';

// Mock the fetch function
global.fetch = jest.fn();

// Mock the environment variables
jest.mock('@env', () => ({
  Env: {
    FORTNITE_API_URL: 'https://test-api.com',
  },
}));

const mockBrItemResponse = {
  status: 200,
  data: {
    id: 'test-item',
    name: 'Test Item',
    description: 'A test item',
    type: {
      value: 'outfit',
      displayValue: 'Outfit',
      backendValue: 'AthenaCharacter',
    },
    rarity: {
      value: 'epic',
      displayValue: 'Epic',
      backendValue: 'EFortRarity::Epic',
    },
    images: {
      smallIcon: 'https://test-api.com/images/small.png',
      icon: 'https://test-api.com/images/icon.png',
    },
    added: '2023-01-01T00:00:00Z',
  },
};

describe('useBrItem', () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    jest.clearAllMocks();
  });

  it('should fetch BR item data successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockBrItemResponse,
    });

    const { result } = renderHook(() => useBrItem('test-item'), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://test-api.com/v2/cosmetics/br/test-item'
    );
    expect(result.current.data).toEqual(mockBrItemResponse);
  });

  it('should not fetch when cosmeticId is null', async () => {
    const { result } = renderHook(() => useBrItem(null), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetched).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should handle fetch error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useBrItem('invalid-item'), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://test-api.com/v2/cosmetics/br/invalid-item'
    );
    expect(result.current.error).toBeDefined();
  });
});
