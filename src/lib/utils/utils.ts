import { Linking } from 'react-native';
import type { StoreApi, UseBoundStore } from 'zustand';

export function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

/**
 * Counts all items in a FortniteShopItem entry
 * @param entry - The shop item entry to count items from
 * @returns The total number of items in the entry
 */
export function countItemsInEntry(entry: any): number {
  let count = 0;

  if (entry.brItems && Array.isArray(entry.brItems)) {
    count += entry.brItems.length;
  }

  if (entry.tracks && Array.isArray(entry.tracks)) {
    count += entry.tracks.length;
  }

  if (entry.instruments && Array.isArray(entry.instruments)) {
    count += entry.instruments.length;
  }

  if (entry.cars && Array.isArray(entry.cars)) {
    count += entry.cars.length;
  }

  if (entry.legoKits && Array.isArray(entry.legoKits)) {
    count += entry.legoKits.length;
  }

  return count;
}

/**
 * Checks if a FortniteShopItem entry contains only a single item
 * @param entry - The shop item entry to check
 * @returns True if the entry contains exactly one item, false otherwise
 */
export function isSingleItemEntry(entry: any): boolean {
  return countItemsInEntry(entry) === 1;
}
