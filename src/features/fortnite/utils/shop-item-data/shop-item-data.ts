/**
 * Utility functions for extracting and formatting shop item data
 * @module features/fortnite/utils/shop-item-data
 */

import type { BrItem, ShopItem } from '@/api/fortnite/types';

/**
 * Get the main item from a shop entry
 * @param entry The shop entry
 * @returns The main item or null if none found
 */
export function getMainItem(entry: ShopItem) {
  if (entry.brItems && entry.brItems.length > 0) {
    return entry.brItems[0];
  }

  if (entry.instruments && entry.instruments.length > 0) {
    return entry.instruments[0];
  }

  return null;
}

/**
 * Get the series image from a shop entry
 * @param entry The shop entry
 * @returns The series image URL or undefined
 */
export function getSeriesImage(entry: ShopItem) {
  const mainItem = getMainItem(entry);
  return mainItem?.series?.image;
}

/**
 * Get gradient colors from a shop entry
 * @param entry The shop entry
 * @returns An array of gradient colors
 */
export function getGradientColors(entry: ShopItem): string[] {
  // If the entry has colors, use them
  if (entry.colors) {
    return [
      `#${entry.colors.color1.slice(0, 6)}`,
      `#${entry.colors.color2.slice(0, 6)}`,
    ];
  }

  // If the main item has series colors, use them
  const mainItem = getMainItem(entry);
  if (mainItem?.series?.colors && mainItem.series.colors.length >= 2) {
    return mainItem.series.colors
      .slice(0, 2)
      .map((color) => `#${color.slice(0, 6)}`);
  }

  // Default gradient colors
  return ['#6366f1', '#8b5cf6'];
}

/**
 * Get image from the main item
 * @param mainItem The main item from a shop entry
 * @returns The image URL or undefined
 */
function getItemImage(mainItem: BrItem | any | null): string | undefined {
  if (!mainItem) return undefined;

  // For BR items
  if ('images' in mainItem) {
    if (mainItem.images.icon) return mainItem.images.icon;
    if (mainItem.images.smallIcon) return mainItem.images.smallIcon;
    if (mainItem.images.small) return mainItem.images.small;
    if (mainItem.images.large) return mainItem.images.large;
  }

  // For tracks
  if ('albumArt' in mainItem) {
    return mainItem.albumArt;
  }

  return undefined;
}

/**
 * Get all data needed for a shop item UI
 * @param entry The shop entry
 * @returns The processed data for UI
 */
export function getShopItemData(entry: ShopItem) {
  const mainItem = getMainItem(entry);
  const title = mainItem?.name || entry.devName;
  const image = getItemImage(mainItem);
  const seriesImage = getSeriesImage(entry);
  const gradientColors = getGradientColors(entry);

  return {
    title,
    mainItem,
    image,
    gradientColors,
    hasColors: !!entry.colors,
    seriesImage,
    hasSeriesImage: !!seriesImage,
  };
}
