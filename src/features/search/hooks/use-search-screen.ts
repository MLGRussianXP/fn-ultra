import { useCallback, useEffect, useMemo, useState } from 'react';

import { type BrItem } from '@/api/fortnite/types';
import { type SearchParams, useBrCosmeticsSearch } from '@/api/search';

export function buildSearchParams(
  primary: Record<string, string>,
  additional: Record<string, string>,
  page: number
) {
  const merged: Record<string, any> = { ...primary, ...additional };
  Object.keys(merged).forEach((k) => {
    if (merged[k] === 'true') merged[k] = true;
    if (merged[k] === 'false') merged[k] = false;
  });
  if (page > 1) merged.offset = (page - 1) * 100;
  return merged;
}

function useDisplayedResults({
  hasSearched,
  results,
  setDisplayCount,
  setDisplayedResults,
}: {
  hasSearched: boolean;
  results: BrItem[];
  setDisplayCount: (n: number) => void;
  setDisplayedResults: (r: BrItem[]) => void;
}) {
  useEffect(() => {
    if (!hasSearched) return;
    if (Array.isArray(results) && results.length === 0) return;
    setDisplayCount(20);
    setDisplayedResults(results);
  }, [results, hasSearched, setDisplayCount, setDisplayedResults]);
}

function useSearchScreenState(
  ALL_PARAMS: {
    key: string;
    label: string;
    type: string;
    primary: boolean;
    options?: string[];
  }[]
) {
  const [primary, setPrimary] = useState({
    name: '',
    id: '',
    type: '',
    rarity: '',
    hasVariants: '',
    hasFeaturedImage: '',
  });
  const [additional, setAdditional] = useState(
    Object.fromEntries(
      ALL_PARAMS.filter(
        (p: any) =>
          !p.primary &&
          p.key !== 'name' &&
          p.key !== 'id' &&
          p.key !== 'type' &&
          p.key !== 'rarity' &&
          p.key !== 'hasVariants' &&
          p.key !== 'hasFeaturedImage'
      ).map((p: any) => [p.key, ''])
    )
  );
  const [showAdditional, setShowAdditional] = useState(false);
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [displayedResults, setDisplayedResults] = useState<BrItem[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [displayCount, setDisplayCount] = useState(20);
  return {
    primary,
    setPrimary,
    additional,
    setAdditional,
    showAdditional,
    setShowAdditional,
    page,
    setPage,
    hasSearched,
    setHasSearched,
    displayedResults,
    setDisplayedResults,
    searchParams,
    setSearchParams,
    displayCount,
    setDisplayCount,
  };
}

function useSearchScreenHandlers({
  params,
  setPage,
  setHasSearched,
  setSearchParams,
  setDisplayCount,
  displayCount,
}: {
  params: SearchParams;
  setPage: (n: number) => void;
  setHasSearched: (b: boolean) => void;
  setSearchParams: (p: SearchParams | null) => void;
  setDisplayCount: (n: number) => void;
  displayCount: number;
}) {
  const handleSearch = useCallback(() => {
    setPage(1);
    setHasSearched(true);
    setSearchParams(params);
    setDisplayCount(20);
  }, [params, setPage, setHasSearched, setSearchParams, setDisplayCount]);
  const handleViewMore = useCallback(() => {
    setDisplayCount(displayCount + 20);
  }, [setDisplayCount, displayCount]);
  return { handleSearch, handleViewMore };
}

export function useSearchScreen(
  ALL_PARAMS: {
    key: string;
    label: string;
    type: string;
    primary: boolean;
    options?: string[];
  }[]
) {
  const state = useSearchScreenState(ALL_PARAMS);
  const params: SearchParams = useMemo(
    () => buildSearchParams(state.primary, state.additional, state.page),
    [state.primary, state.additional, state.page]
  );
  const {
    data: results = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useBrCosmeticsSearch(
    state.searchParams || {},
    state.hasSearched && !!state.searchParams
  );
  useDisplayedResults({
    hasSearched: state.hasSearched,
    results,
    setDisplayCount: state.setDisplayCount,
    setDisplayedResults: state.setDisplayedResults,
  });
  const { handleSearch, handleViewMore } = useSearchScreenHandlers({
    params,
    setPage: state.setPage,
    setHasSearched: state.setHasSearched,
    setSearchParams: state.setSearchParams,
    setDisplayCount: state.setDisplayCount,
    displayCount: state.displayCount,
  });
  return {
    ...state,
    params,
    results,
    isLoading,
    isError,
    error,
    isFetching,
    handleSearch,
    handleViewMore,
    ALL_PARAMS,
  };
}
