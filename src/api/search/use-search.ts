import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { queryClient } from '@/api/common/api-provider';
import { getCurrentLanguage } from '@/api/common/utils';

export interface SearchParams {
  [key: string]: string | number | boolean | undefined;
}

// Create a debounced function to avoid excessive API calls
const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        resolve(func(...args));
      }, waitFor);
    });
  };
};

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

export async function fetchBrCosmeticsSearch(params: SearchParams) {
  // Include the current language in the search parameters
  const searchParams = {
    ...params,
    language: getCurrentLanguage(),
  };

  const query = Object.entries(searchParams)
    .filter(([, v]) => v !== '' && v !== undefined && v !== null)
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`
    )
    .join('&');

  const url = `https://fortnite-api.com/v2/cosmetics/br/search/all?${query}`;

  try {
    const res = await fetchWithTimeout(url);
    const data = await res.json();

    if (!data || !Array.isArray(data.data))
      throw new Error(data.error || 'Invalid response');

    return data.data;
  } catch (error) {
    // Handle network errors more gracefully
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Search request timed out. Please try again.');
      }

      // Check for network connectivity issues
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network.');
      }
    }

    throw error;
  }
}

// Create a debounced version of the search function
const debouncedFetch = debounce(fetchBrCosmeticsSearch, 300);

export function useBrCosmeticsSearch(params: SearchParams, enabled = true) {
  const language = getCurrentLanguage();

  // Determine if this is a simple search that could be cached longer
  const isSimpleSearch = Object.keys(params).length <= 2;

  // Calculate optimal cache times based on search complexity and platform
  const staleTime = isSimpleSearch
    ? Platform.OS === 'web'
      ? 2 * 60 * 1000
      : 5 * 60 * 1000 // Simple searches cache longer
    : Platform.OS === 'web'
      ? 1 * 60 * 1000
      : 3 * 60 * 1000; // Complex searches cache less

  // Set up prefetching for related searches
  useEffect(() => {
    // Only prefetch for category-based searches
    if ((params.rarity || params.type) && Object.keys(params).length <= 2) {
      const relatedParams = { ...params };

      // Schedule prefetch after a delay
      const timeoutId = setTimeout(() => {
        queryClient.prefetchQuery({
          queryKey: ['brCosmeticsSearch', { ...relatedParams, language }],
          queryFn: () => fetchBrCosmeticsSearch(relatedParams),
        });
      }, 1000);

      // Clean up timeout on unmount
      return () => clearTimeout(timeoutId);
    }
  }, [params, language]);

  return useQuery({
    queryKey: ['brCosmeticsSearch', { ...params, language }],
    queryFn: () => {
      // Use debounced fetch for text-based searches to avoid API hammering
      if (params.name || params.description) {
        return debouncedFetch(params);
      }
      return fetchBrCosmeticsSearch(params);
    },
    enabled,
    retry: false,
    staleTime,
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}
