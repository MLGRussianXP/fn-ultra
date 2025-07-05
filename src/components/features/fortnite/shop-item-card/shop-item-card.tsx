import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

import type { FortniteShopItem } from '@/api/fortnite/types';
import { ShopItemPrice } from '@/components/features/fortnite/shop-item-price';
import { useShopItemData } from '@/components/features/fortnite/use-shop-item-data';
import { Image, Text, View } from '@/components/ui';

type Props = {
  entry: FortniteShopItem;
  isWide?: boolean;
  vbuckIcon?: string;
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
  gradientColors: readonly [string, string, ...string[]];
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
          colors={gradientColors}
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
  regularPrice,
  finalPrice,
  vbuckIcon,
  priceClass,
}: {
  title: string;
  titleClass: string;
  regularPrice: number;
  finalPrice: number;
  vbuckIcon?: string;
  priceClass: string;
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
      <ShopItemPrice
        regularPrice={regularPrice}
        finalPrice={finalPrice}
        vbuckIcon={vbuckIcon}
        priceClass={priceClass}
      />
    </View>
  );
}

export function ShopItemCard({ entry, isWide = false, vbuckIcon }: Props) {
  const {
    image,
    title,
    gradientColors,
    hasColors,
    seriesImage,
    hasSeriesImage,
  } = useShopItemData(entry);
  const { regularPrice, finalPrice, brItems } = entry;

  const widthClass = isWide ? 'w-full' : 'w-[48%]';
  const titleClass = isWide ? 'text-lg' : 'text-sm';
  const priceClass = isWide ? 'text-base' : 'text-sm';
  const hasBrItems = brItems && brItems.length > 0;

  const handlePress = React.useCallback(() => {
    if (hasBrItems) {
      router.push(`/item/${brItems[0].id}`);
    }
  }, [brItems, hasBrItems]);

  return (
    <Pressable
      className={`mb-3 overflow-hidden rounded-xl shadow-lg ${widthClass}`}
      onPress={handlePress}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
      disabled={!hasBrItems}
      testID="shop-item-card-pressable"
    >
      <View className="relative h-52 bg-gray-200 dark:bg-gray-700">
        <ShopItemBackground
          hasSeriesImage={hasSeriesImage}
          seriesImage={seriesImage}
          hasColors={hasColors}
          gradientColors={gradientColors}
          image={image}
        />

        <ShopItemOverlay
          title={title}
          titleClass={titleClass}
          regularPrice={regularPrice}
          finalPrice={finalPrice}
          vbuckIcon={vbuckIcon}
          priceClass={priceClass}
        />
      </View>
    </Pressable>
  );
}
