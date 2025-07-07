import { Env } from '@env';
import { useQuery } from '@tanstack/react-query';

import type { FortniteDetailedBrItemResponse } from '@/api/fortnite/types';

const FORTNITE_BR_ITEM_QUERY_KEY = ['fortnite', 'br-item'] as const;

async function fetchFortniteBrItem(
  cosmeticId: string
): Promise<FortniteDetailedBrItemResponse> {
  const response = await fetch(
    `${Env.FORTNITE_API_URL}/v2/cosmetics/br/${cosmeticId}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Fortnite BR item: ${response.status}`);
  }

  return response.json();
}

export function useFortniteBrItem(cosmeticId: string | null) {
  return useQuery({
    queryKey: [...FORTNITE_BR_ITEM_QUERY_KEY, cosmeticId],
    queryFn: () => fetchFortniteBrItem(cosmeticId!),
    enabled: !!cosmeticId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
