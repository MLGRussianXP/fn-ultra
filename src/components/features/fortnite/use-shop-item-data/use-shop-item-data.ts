import type { FortniteShopItem } from '@/api/fortnite/types';

export function useShopItemData(entry: FortniteShopItem) {
  const image = getImage(entry);
  const title = getTitle(entry);
  const gradientColors = getGradientColors(entry);
  const hasColors = !!entry.colors;

  return {
    image,
    title,
    gradientColors,
    hasColors,
  };
}

function getMainItem(entry: FortniteShopItem) {
  return (
    entry.brItems?.[0] ||
    entry.instruments?.[0] ||
    entry.cars?.[0] ||
    entry.tracks?.[0] ||
    entry.legoKits?.[0] ||
    null
  );
}

function getImage(entry: FortniteShopItem) {
  // Check bundle image first
  if (entry.bundle && entry.bundle.image) return entry.bundle.image;

  // Check newDisplayAsset renderImages (primary source for shop items)
  if (entry.newDisplayAsset?.renderImages?.[0]?.image) {
    return entry.newDisplayAsset.renderImages[0].image;
  }

  // Fallback to main item images
  const mainItem = getMainItem(entry);
  if (mainItem && 'images' in mainItem && mainItem.images) {
    if ('icon' in mainItem.images && mainItem.images.icon)
      return mainItem.images.icon;
    if ('smallIcon' in mainItem.images && mainItem.images.smallIcon)
      return mainItem.images.smallIcon;
    if ('large' in mainItem.images && mainItem.images.large)
      return mainItem.images.large;
    if ('small' in mainItem.images && mainItem.images.small)
      return mainItem.images.small;
    if ('wide' in mainItem.images && mainItem.images.wide)
      return mainItem.images.wide;
  }
  if (mainItem && 'albumArt' in mainItem && mainItem.albumArt)
    return mainItem.albumArt;
  return undefined;
}

function getTitle(entry: FortniteShopItem) {
  if (entry.bundle && entry.bundle.name) return entry.bundle.name;
  const mainItem = getMainItem(entry);
  if (mainItem && 'name' in mainItem && mainItem.name) return mainItem.name;
  if (mainItem && 'title' in mainItem && mainItem.title) return mainItem.title;
  return 'Unknown';
}

function getGradientColors(entry: FortniteShopItem) {
  if (!entry.colors) {
    return ['#6366f1', '#8b5cf6'] as const; // Default purple gradient
  }

  const { color1, color2, color3 } = entry.colors;

  // Convert 8-digit hex to 6-digit hex (remove alpha channel)
  const convertColor = (color: string) => {
    if (!color) return null;
    // Remove alpha channel (last 2 digits) and add # prefix
    return `#${color.slice(0, 6)}`;
  };

  const colors = [convertColor(color1)];

  // Add color2 if present
  if (color2) colors.push(convertColor(color2));

  // Add color3 if present
  if (color3) colors.push(convertColor(color3));

  const filteredColors = colors.filter(Boolean);

  // Ensure we have at least 2 colors for the gradient
  if (filteredColors.length < 2) {
    return ['#6366f1', '#8b5cf6'] as const;
  }

  return filteredColors as [string, string, ...string[]];
}
