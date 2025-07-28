import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, type TextStyle } from 'react-native';

import type { ShopItem } from '@/api/fortnite/types';
import { Image, Text, View } from '@/components/ui';
import { useShopItemData } from '@/features/fortnite/hooks/use-shop-item-data';
import { countItemsInEntry, isSingleItemEntry } from '@/lib/utils';

import { ShopItemPrice } from '../shop-item-price';

// Item title styles
const styles = StyleSheet.create({
  itemTitle: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
});

type Props = {
  entry: ShopItem;
  isWide?: boolean;
};

// Helper function to get series badge style
function getSeriesBadgeStyle(mainItem: any): TextStyle {
  const seriesColors = mainItem?.series?.colors;
  const seriesColor =
    seriesColors && seriesColors.length > 0
      ? `#${seriesColors[0].slice(0, 6)}`
      : null;

  return seriesColor ? { backgroundColor: seriesColor } : {};
}

function ShopItemBackground({
  hasSeriesImage,
  seriesImage,
  gradientColors,
  image,
}: {
  hasSeriesImage: boolean;
  seriesImage?: string;
  gradientColors: string[];
  image?: string;
}) {
  return (
    <>
      {/* Series Image Background - show if available */}
      {hasSeriesImage && (
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

      {/* Image */}
      {image && (
        <Image
          source={{ uri: image }}
          className="z-1 relative size-full"
          contentFit="cover"
        />
      )}
    </>
  );
}

function ShopItemOverlay({
  title,
  isWide,
  item,
  seriesName,
}: {
  title: string;
  isWide: boolean;
  item: ShopItem;
  seriesName?: string;
}) {
  // Get main item for rarity information
  const mainItem =
    item.brItems?.[0] ||
    item.instruments?.[0] ||
    item.cars?.[0] ||
    item.legoKits?.[0];

  // Get rarity information if available
  const hasRarity = mainItem && 'rarity' in mainItem && mainItem.rarity;
  const rarityValue = hasRarity ? mainItem.rarity.displayValue : null;
  const rarityClass = hasRarity ? getRarityColor(mainItem.rarity.value) : '';

  // Get series badge style
  const seriesBadgeStyle = mainItem ? getSeriesBadgeStyle(mainItem) : {};

  return (
    <View className="absolute inset-x-0 bottom-0 z-30 bg-black/60 p-base">
      {/* Series name if available */}
      {seriesName && (
        <View className="mb-xs max-w-full">
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
        <View className="mb-xs max-w-full">
          <Text
            className={`text-xs text-white ${rarityClass} self-start rounded px-1`}
            numberOfLines={1}
          >
            {rarityValue}
          </Text>
        </View>
      )}

      {/* Title - explicitly set FORTNITE BATTLEFEST font */}
      <Text
        className={`mb-sm ${isWide ? 'text-lg' : 'text-sm'} text-fortnite-light`}
        numberOfLines={1}
        style={styles.itemTitle}
      >
        {title}
      </Text>

      {/* Price Section */}
      <ShopItemPrice item={item} />
    </View>
  );
}

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

function useShopItemNavigation(
  entry: ShopItem,
  hasBrItems: boolean,
  brItems: any[]
) {
  return React.useCallback(() => {
    if (hasBrItems) {
      const itemCount = countItemsInEntry(entry);
      const isSingleItem = isSingleItemEntry(entry);

      if (isSingleItem) {
        // Single item - redirect to item details page
        router.push({
          pathname: '/item/[id]',
          params: {
            id: brItems[0].id,
            entry: JSON.stringify(entry),
          },
        });
      } else {
        // Multiple items - redirect to item details page with entry data
        console.log(
          `Shop item "${entry.devName}" contains ${itemCount} items. Is single item: ${isSingleItem}`
        );
        console.log(
          `Redirecting to multi-item details (first item): ${brItems[0].id}`
        );
        router.push({
          pathname: '/item/[id]',
          params: {
            id: brItems[0].id,
            entry: JSON.stringify(entry),
          },
        });
      }
    }
  }, [brItems, hasBrItems, entry]);
}

export function ShopItemCard({ entry, isWide = false }: Props) {
  const {
    image,
    title,
    gradientColors,
    seriesImage,
    hasSeriesImage,
    seriesName,
  } = useShopItemData(entry);
  const { brItems } = entry;

  // Check if item should be displayed as full width
  const isFullScreen =
    entry.tileSize === 'Size_2_x_1' || entry.tileSize === 'double';
  const widthClass = isFullScreen || isWide ? 'w-full' : 'w-[48%]';
  const hasBrItems = brItems && brItems.length > 0;

  const handlePress = useShopItemNavigation(entry, !!hasBrItems, brItems || []);

  return (
    <Pressable
      className={`mb-lg overflow-hidden rounded-xl shadow-lg ${widthClass}`}
      onPress={handlePress}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
      disabled={!hasBrItems}
      testID="shop-item-card-pressable"
    >
      <View className="relative h-52">
        <ShopItemBackground
          hasSeriesImage={hasSeriesImage}
          seriesImage={seriesImage}
          gradientColors={gradientColors}
          image={image}
        />

        <ShopItemOverlay
          title={title}
          isWide={isWide || isFullScreen}
          item={entry}
          seriesName={seriesName}
        />
      </View>
    </Pressable>
  );
}
