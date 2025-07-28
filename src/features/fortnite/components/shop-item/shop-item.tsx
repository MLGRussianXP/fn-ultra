import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { Pressable, StyleSheet, type TextStyle } from 'react-native';

import type { ShopItem as ShopItemType } from '@/api/fortnite/types';
import { Image, Text, View } from '@/components/ui';
import { getGradientColors } from '@/features/fortnite/utils/shop-item-data';

import { ShopItemPrice } from '../shop-item-price';

const styles = StyleSheet.create({
  itemTitle: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
});

type Props = {
  item: ShopItemType;
  onPress?: () => void;
  disabled?: boolean;
};

// Helper function to get rarity color class
const getRarityColor = (rarity?: string) => {
  switch (rarity?.toLowerCase()) {
    case 'common':
      return 'bg-gray-400';
    case 'uncommon':
      return 'bg-green-400';
    case 'rare':
      return 'bg-blue-400';
    case 'epic':
      return 'bg-purple-400';
    case 'legendary':
      return 'bg-orange-400';
    case 'marvel':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};

// Helper function to get display name
function getDisplayName(mainItem: any, itemName: string): string {
  return mainItem && 'name' in mainItem
    ? mainItem.name
    : mainItem && 'title' in mainItem
      ? mainItem.title
      : itemName;
}

// Helper function to get series badge style
function getSeriesBadgeStyle(mainItem: any): TextStyle {
  const seriesColors = mainItem?.series?.colors;
  const seriesColor =
    seriesColors && seriesColors.length > 0
      ? `#${seriesColors[0].slice(0, 6)}`
      : null;

  return seriesColor ? { backgroundColor: seriesColor } : {};
}

// Extracted component for item title overlay
function ItemTitleOverlay({
  mainItem,
  itemName,
  seriesName,
}: {
  mainItem: any;
  itemName: string;
  seriesName?: string;
}) {
  const displayName = getDisplayName(mainItem, itemName);

  // Get rarity information if available
  const hasRarity = mainItem && 'rarity' in mainItem && mainItem.rarity;
  const rarityValue = hasRarity ? mainItem.rarity.displayValue : null;
  const rarityClass = hasRarity ? getRarityColor(mainItem.rarity.value) : '';

  // Get series badge style
  const seriesBadgeStyle = getSeriesBadgeStyle(mainItem);

  return (
    <View className="absolute inset-x-0 bottom-0 z-30 bg-black/40 p-2">
      {/* Series name if available */}
      {seriesName && (
        <View className="mb-1 max-w-full">
          <Text
            className="self-start rounded px-1 text-xs text-white"
            style={seriesBadgeStyle}
            numberOfLines={1}
          >
            {seriesName}
          </Text>
        </View>
      )}

      {/* Rarity badge if available and no series */}
      {hasRarity && !seriesName && (
        <View className="mb-1 max-w-full">
          <Text
            className={`text-xs text-white ${rarityClass} self-start rounded px-1`}
            numberOfLines={1}
          >
            {rarityValue}
          </Text>
        </View>
      )}

      <Text
        className="text-sm text-white"
        style={styles.itemTitle}
        numberOfLines={1}
        testID="item-title"
      >
        {displayName}
      </Text>

      {/* Item Type - Added for test compatibility */}
      {mainItem && 'type' in mainItem && mainItem.type && (
        <Text className="text-xs text-gray-300">
          {mainItem.type.displayValue}
        </Text>
      )}
    </View>
  );
}

// Extracted component for item background
function ItemBackground({
  seriesImage,
  hasSeriesImage,
  gradientColors,
  imageUrl,
}: {
  seriesImage?: string;
  hasSeriesImage: boolean;
  gradientColors: string[];
  imageUrl?: string;
}) {
  return (
    <>
      {/* Series Image Background - show if available */}
      {hasSeriesImage && seriesImage && (
        <Image
          source={{ uri: seriesImage }}
          className="absolute inset-0 size-full"
          contentFit="cover"
        />
      )}

      {/* Gradient Background - always show if no series image */}
      {!hasSeriesImage && (
        <LinearGradient
          colors={gradientColors as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}

      {/* Item Image */}
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          className="z-1 relative size-full"
          contentFit="cover"
        />
      )}
    </>
  );
}

// Helper function to get the image URL safely
function getImageUrl(item: ShopItemType, mainItem: any): string | undefined {
  if (item.newDisplayAsset?.renderImages?.[0]?.image) {
    return item.newDisplayAsset.renderImages[0].image;
  }

  if (mainItem) {
    if ('images' in mainItem && mainItem.images) {
      if ('icon' in mainItem.images) return mainItem.images.icon as string;
      if ('smallIcon' in mainItem.images)
        return mainItem.images.smallIcon as string;
      if ('small' in mainItem.images) return mainItem.images.small as string;
    }

    if ('albumArt' in mainItem) return mainItem.albumArt as string;
  }

  return undefined;
}

// Extracted component for badges
function ItemBadges({ item }: { item: ShopItemType }) {
  return (
    <>
      {/* Price Badge */}
      <View className="absolute right-2 top-2 z-20 rounded-full bg-black/70 px-3 py-1">
        <ShopItemPrice item={item} />
      </View>
    </>
  );
}

export function ShopItem({ item, onPress, disabled = false }: Props) {
  const mainItem =
    item.brItems?.[0] ||
    item.tracks?.[0] ||
    item.instruments?.[0] ||
    item.cars?.[0] ||
    item.legoKits?.[0];

  // Safe access to series properties
  const seriesName =
    mainItem && 'series' in mainItem ? mainItem.series?.value : undefined;
  const seriesImage =
    mainItem && 'series' in mainItem ? mainItem.series?.image : undefined;
  const hasSeriesImage = !!seriesImage;
  const gradientColors = getGradientColors(item);
  const imageUrl = getImageUrl(item, mainItem);

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-xl shadow-lg"
      testID="shop-item-pressable"
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
      role="button"
      accessibilityRole="button"
      disabled={disabled}
    >
      <View className="overflow-hidden rounded-lg shadow-sm">
        <View className="relative h-48">
          <ItemBackground
            seriesImage={seriesImage}
            hasSeriesImage={hasSeriesImage}
            gradientColors={gradientColors}
            imageUrl={imageUrl}
          />

          <ItemBadges item={item} />

          <ItemTitleOverlay
            mainItem={mainItem}
            itemName={item.devName}
            seriesName={seriesName}
          />
        </View>
      </View>
    </Pressable>
  );
}
