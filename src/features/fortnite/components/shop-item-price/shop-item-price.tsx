import React from 'react';

import type { ShopItem } from '@/api/fortnite/types';
import { Text, View } from '@/components/ui';

type Props = {
  item: ShopItem;
};

export function ShopItemPrice({ item }: Props) {
  const hasDiscount = item.regularPrice !== item.finalPrice;

  return (
    <View className="mt-2 flex-row items-center">
      <Text className="text-lg font-bold text-white">{item.finalPrice}</Text>
      <Text className="ml-1 text-xs text-gray-400">V-Bucks</Text>

      {hasDiscount && (
        <Text className="ml-2 text-sm text-gray-400 line-through">
          {item.regularPrice}
        </Text>
      )}
    </View>
  );
}
