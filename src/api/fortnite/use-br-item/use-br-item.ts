/**
 * Hook for fetching Fortnite BR item details
 * @module api/fortnite/use-br-item
 */

import { Env } from '@env';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { queryClient } from '@/api/common/api-provider';
import { getCurrentLanguage } from '@/api/common/utils';
import { getQueryKey } from '@/api/common/utils/query-key';

import type { DetailedBrItemResponse } from '../types';

// API URL from environment
const API_URL = Env.FORTNITE_API_URL || 'https://fortnite-api.com';

// AbortController for cancellable requests
const createFetchWithTimeout = (timeoutMs = 8000) => {
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

/**
 * Fetches a specific BR item by ID
 * @param id - The BR item ID
 * @returns The BR item data
 */
async function fetchBrItem(id: string | null | undefined) {
  if (!id) {
    throw new Error('Item ID is required');
  }

  const language = getCurrentLanguage();

  try {
    const response = await fetchWithTimeout(
      `${API_URL}/v2/cosmetics/br/${id}?language=${language}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch item');
    }

    return response.json() as Promise<DetailedBrItemResponse>;
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
 * Hook for fetching a specific BR item by ID
 * @param id - The BR item ID
 * @returns The BR item data and query state
 */
export function useBrItem(id: string | null | undefined) {
  const language = getCurrentLanguage();

  // Calculate optimal cache times based on platform
  const staleTime =
    Platform.OS === 'web'
      ? 3 * 60 * 1000 // 3 minutes for web
      : 10 * 60 * 1000; // 10 minutes for mobile (items change less frequently)

  const gcTime = 30 * 60 * 1000; // 30 minutes

  const query = useQuery({
    queryKey: getQueryKey(`brItem-${id || 'null'}`, { language }),
    queryFn: () => fetchBrItem(id),
    enabled: !!id,
    staleTime,
    gcTime,
  });

  // Handle success in a useEffect instead of onSuccess callback
  useEffect(() => {
    if (query.data && id) {
      // If this item is part of a set, ensure it stays fresh in the cache
      if (query.data.data?.set?.value) {
        queryClient.setQueryData(
          getQueryKey(`brItem-${id}`, { language }),
          query.data
        );
      }
    }
  }, [query.data, id, language]);

  return query;
}
