type KeyParams = {
  [key: string]: any;
};

/**
 * Creates a query key array for React Query
 * @param key The base key string
 * @param params Optional parameters to include in the key
 * @returns An array suitable for use as a React Query key
 */
export function getQueryKey<T extends KeyParams>(key: string, params?: T) {
  return [key, ...(params ? [params] : [])];
}
