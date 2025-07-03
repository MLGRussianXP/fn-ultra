import { Env } from '@env';
import { useQuery } from '@tanstack/react-query';

import type { FortniteShopResponse } from './types';

const FORTNITE_SHOP_QUERY_KEY = ['fortnite', 'shop'] as const;

async function fetchFortniteShop(): Promise<FortniteShopResponse> {
  const response = await fetch(`${Env.FORTNITE_API_URL}/v2/shop`);

  if (!response.ok) {
    throw new Error(`Failed to fetch Fortnite shop: ${response.status}`);
  }

  return response.json();
}

export function useFortniteShop() {
  return useQuery({
    queryKey: FORTNITE_SHOP_QUERY_KEY,
    queryFn: fetchFortniteShop,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
