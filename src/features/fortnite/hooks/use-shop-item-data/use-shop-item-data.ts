/**
 * Hook for getting shop item data
 * @module features/fortnite/hooks/use-shop-item-data
 */

import type { ShopItem } from '@/api/fortnite/types';
import { getShopItemData } from '@/features/fortnite/utils/shop-item-data';

/**
 * Hook for getting shop item data
 * @param entry - The shop item entry
 * @returns Formatted shop item data
 */
export function useShopItemData(entry: ShopItem) {
  return getShopItemData(entry);
}
