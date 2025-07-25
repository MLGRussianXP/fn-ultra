import { useQuery } from '@tanstack/react-query';

export interface SearchParams {
  [key: string]: string | number | boolean | undefined;
}

export async function fetchBrCosmeticsSearch(params: SearchParams) {
  const query = Object.entries(params)
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
  return useQuery({
    queryKey: ['brCosmeticsSearch', params],
    queryFn: () => fetchBrCosmeticsSearch(params),
    enabled,
    retry: false,
  });
}
