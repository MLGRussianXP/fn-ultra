import { Env } from '@env';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { queryClient } from '@/api/common/api-provider';
import { getCurrentLanguage } from '@/api/common/utils';
import type { ShopResponse } from '@/api/fortnite/types';

const SHOP_QUERY_KEY = ['fortnite', 'shop'] as const;

// AbortController for cancellable requests
const createFetchWithTimeout = (timeoutMs = 10000) => {
  return async (url: string): Promise<Response> => {
    const controller = new AbortController();
    const { signal } = controller;

    // Set timeout to abort request if it takes too long
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };
};

const fetchWithTimeout = createFetchWithTimeout();

async function fetchShop(): Promise<ShopResponse> {
  const language = getCurrentLanguage();

  try {
    const response = await fetchWithTimeout(
      `${Env.FORTNITE_API_URL}/v2/shop?language=${language}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Fortnite shop: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network errors more gracefully
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }

      // Check for network connectivity issues
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network.');
      }
    }

    throw error;
  }
}

/**
 * Hook to fetch the current Fortnite shop data
 * @returns Query result with the shop data
 */
export function useShop() {
  const language = getCurrentLanguage();

  // Calculate optimal stale time based on platform
  const staleTime =
    Platform.OS === 'web'
      ? 2 * 60 * 1000 // 2 minutes for web
      : 5 * 60 * 1000; // 5 minutes for mobile

  const query = useQuery({
    queryKey: [...SHOP_QUERY_KEY, { language }],
    queryFn: fetchShop,
    staleTime,
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Handle success in a useEffect instead of onSuccess callback
  useEffect(() => {
    if (query.isSuccess) {
      const timeoutId = setTimeout(() => {
        queryClient.prefetchQuery({
          queryKey: [...SHOP_QUERY_KEY, { language }],
          queryFn: fetchShop,
        });
      }, staleTime);

      // Clean up timeout on unmount
      return () => clearTimeout(timeoutId);
    }
  }, [query.isSuccess, language, staleTime]);

  return query;
}
