import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

import type { ShopItem } from '@/api/fortnite/types';
import { Image, Text, View } from '@/components/ui';
import { useShopItemData } from '@/features/fortnite/hooks/use-shop-item-data';
import { countItemsInEntry, isSingleItemEntry } from '@/lib/utils';

import { ShopItemPrice } from '../shop-item-price';

type Props = {
  entry: ShopItem;
  isWide?: boolean;
};

function ShopItemBackground({
  hasSeriesImage,
  seriesImage,
  hasColors,
  gradientColors,
  image,
}: {
  hasSeriesImage: boolean;
  seriesImage?: string;
  hasColors: boolean;
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

      {/* Gradient Background - only show if colors are present and no series image */}
      {hasColors && !hasSeriesImage && (
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
          className="relative z-10 size-full"
          contentFit="cover"
        />
      )}
    </>
  );
}

function ShopItemOverlay({
  title,
  titleClass,
  item,
}: {
  title: string;
  titleClass: string;
  item: ShopItem;
}) {
  return (
    <View className="absolute inset-x-0 bottom-0 z-20 bg-black/40 p-3">
      {/* Title */}
      <Text
        className={`mb-1 font-bold text-white ${titleClass}`}
        numberOfLines={1}
      >
        {title}
      </Text>

      {/* Price Section */}
      <ShopItemPrice item={item} />
    </View>
  );
}

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
        router.push(`/item/${brItems[0].id}` as any);
      } else {
        // Multiple items - log and redirect to item details page with entry data
        console.log(
          `Shop item "${entry.devName}" contains ${itemCount} items. Is single item: ${isSingleItem}`
        );
        console.log(
          `Redirecting to multi-item details (first item): ${brItems[0].id}`
        );
        router.push({
          pathname: `/item/${brItems[0].id}` as any,
          params: {
            entryData: JSON.stringify(entry),
            isMultiItem: 'true',
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
    hasColors,
    seriesImage,
    hasSeriesImage,
  } = useShopItemData(entry);
  const { brItems } = entry;

  const widthClass = isWide ? 'w-full' : 'w-[48%]';
  const titleClass = isWide ? 'text-lg' : 'text-sm';
  const hasBrItems = brItems && brItems.length > 0;

  const handlePress = useShopItemNavigation(entry, !!hasBrItems, brItems || []);

  return (
    <Pressable
      className={`mb-3 overflow-hidden rounded-xl shadow-lg ${widthClass}`}
      onPress={handlePress}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
      disabled={!hasBrItems}
      testID="shop-item-card-pressable"
      role="button"
      accessibilityRole="button"
    >
      <View className="relative h-52 bg-gray-200 dark:bg-gray-700">
        <ShopItemBackground
          hasSeriesImage={hasSeriesImage}
          seriesImage={seriesImage}
          hasColors={hasColors}
          gradientColors={gradientColors}
          image={image}
        />

        <ShopItemOverlay title={title} titleClass={titleClass} item={entry} />
      </View>
    </Pressable>
  );
}
