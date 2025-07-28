import { useQuery } from '@tanstack/react-query';

import { getCurrentLanguage } from '@/api/common/utils';

export interface SearchParams {
  [key: string]: string | number | boolean | undefined;
}

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
  const res = await fetch(url);
  const data = await res.json();
  if (!data || !Array.isArray(data.data))
    throw new Error(data.error || 'Invalid response');
  return data.data;
}

export function useBrCosmeticsSearch(params: SearchParams, enabled = true) {
  const language = getCurrentLanguage();

  return useQuery({
    queryKey: ['brCosmeticsSearch', { ...params, language }],
    queryFn: () => fetchBrCosmeticsSearch(params),
    enabled,
    retry: false,
  });
}
