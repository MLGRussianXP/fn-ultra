import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

import type { FortniteShopItem } from '@/api/fortnite/types';
import { ShopItemPrice } from '@/components/features/fortnite/shop-item-price';
import { useShopItemData } from '@/components/features/fortnite/use-shop-item-data';
import { Image, Text, View } from '@/components/ui';

type Props = {
  entry: FortniteShopItem;
  isWide?: boolean;
  vbuckIcon?: string;
};

export function ShopItemCard({ entry, isWide = false, vbuckIcon }: Props) {
  const { image, title, gradientColors, hasColors } = useShopItemData(entry);
  const { regularPrice, finalPrice } = entry;

  const widthClass = isWide ? 'w-full' : 'w-[48%]';
  const titleClass = isWide ? 'text-lg' : 'text-sm';
  const priceClass = isWide ? 'text-base' : 'text-sm';

  return (
    <View className={`mb-3 overflow-hidden rounded-xl shadow-lg ${widthClass}`}>
      <View className="relative h-52">
        {/* Gradient Background - only show if colors are present */}
        {hasColors && (
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
            className="size-full"
            contentFit="cover"
          />
        )}

        {/* Bottom overlay with title and price */}
        <View className="absolute inset-x-0 bottom-0 bg-black/40 p-3">
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
      </View>
    </View>
  );
}
