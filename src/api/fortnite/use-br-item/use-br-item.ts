/**
 * Hook for fetching Fortnite BR item details
 * @module api/fortnite/use-br-item
 */

import { Env } from '@env';
import { useQuery } from '@tanstack/react-query';

import { getQueryKey } from '@/api/common/utils/query-key';

import type { DetailedBrItemResponse } from '../types';

// API URL from environment
const API_URL = Env.FORTNITE_API_URL || 'https://fortnite-api.com';

/**
 * Fetches a specific BR item by ID
 * @param id - The BR item ID
 * @returns The BR item data
 */
async function fetchBrItem(id: string | null | undefined) {
  if (!id) {
    throw new Error('Item ID is required');
  }

  const response = await fetch(`${API_URL}/v2/cosmetics/br/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch item');
  }
  return response.json() as Promise<DetailedBrItemResponse>;
}

/**
 * Hook for fetching a specific BR item by ID
 * @param id - The BR item ID
 * @returns The BR item data and query state
 */
export function useBrItem(id: string | null | undefined) {
  return useQuery({
    queryKey: getQueryKey(`brItem-${id || 'null'}`),
    queryFn: () => fetchBrItem(id),
    enabled: !!id,
  });
}
