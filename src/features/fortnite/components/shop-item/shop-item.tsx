import React from 'react';
import { Pressable } from 'react-native';

import type { ShopItem as ShopItemType } from '@/api/fortnite/types';
import { Image, Text, View } from '@/components/ui';
import { useShopItemData } from '@/features/fortnite/hooks/use-shop-item-data';

import { ShopItemContent } from '../shop-item-content';
import { ShopItemPrice } from '../shop-item-price';

type Props = {
  item: ShopItemType;
  onPress?: () => void;
};

export function ShopItem({ item, onPress }: Props) {
  const { image, title, gradientColors, seriesImage } = useShopItemData(item);

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-lg bg-neutral-800"
      style={{ width: 200, height: 280 }}
      role="button"
      accessibilityRole="button"
    >
      <View className="relative h-[180px] w-full">
        {/* Background gradient or series image */}
        {seriesImage ? (
          <Image
            source={{ uri: seriesImage }}
            className="absolute size-full"
            contentFit="cover"
            testID="item-series-image"
          />
        ) : (
          <View
            className="absolute size-full"
            style={{
              backgroundColor: gradientColors[0],
              borderBottomWidth: 2,
              borderBottomColor: gradientColors[1],
            }}
            testID="item-gradient-bg"
          />
        )}

        {/* Item image */}
        <Image
          source={{ uri: image }}
          className="size-full"
          contentFit="contain"
          testID="item-image"
        />
      </View>

      <View className="p-3">
        <Text
          className="mb-2 text-lg font-semibold text-white"
          numberOfLines={1}
          testID="item-title"
        >
          {title}
        </Text>

        <ShopItemContent item={item} />
        <ShopItemPrice item={item} />
      </View>
    </Pressable>
  );
}
