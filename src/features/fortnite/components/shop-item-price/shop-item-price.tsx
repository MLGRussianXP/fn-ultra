import * as React from 'react';

import type { ShopItem } from '@/api/fortnite/types';
import { Text, View } from '@/components/ui';

type Props = {
  item: ShopItem;
};

export function ShopItemPrice({ item }: Props) {
  const hasDiscount = item.regularPrice !== item.finalPrice;

  return (
    <View className="flex-row items-center">
      <Text className="text-sm font-semibold text-white">
        {item.finalPrice}
      </Text>
      <Text className="ml-1 text-xs text-white">V-Bucks</Text>

      {hasDiscount && (
        <Text className="ml-2 text-xs text-gray-300 line-through">
          {item.regularPrice}
        </Text>
      )}
    </View>
  );
}
