import { Env } from '@env';
import { useQuery } from '@tanstack/react-query';

import { getCurrentLanguage } from '@/api/common/utils';
import type { ShopResponse } from '@/api/fortnite/types';

const SHOP_QUERY_KEY = ['fortnite', 'shop'] as const;

async function fetchShop(): Promise<ShopResponse> {
  const language = getCurrentLanguage();
  const response = await fetch(
    `${Env.FORTNITE_API_URL}/v2/shop?language=${language}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Fortnite shop: ${response.status}`);
  }

  return response.json();
}

/**
 * Hook to fetch the current Fortnite shop data
 * @returns Query result with the shop data
 */
export function useShop() {
  const language = getCurrentLanguage();

  return useQuery({
    queryKey: [...SHOP_QUERY_KEY, { language }],
    queryFn: fetchShop,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
