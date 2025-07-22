import React from 'react';

import type { ShopItem } from '@/api/fortnite/types';
import { Text, View } from '@/components/ui';
import { useShopItemData } from '@/features/fortnite/hooks/use-shop-item-data';

type Props = {
  item: ShopItem;
};

export function ShopItemContent({ item }: Props) {
  const { mainItem, title } = useShopItemData(item);

  if (!mainItem) {
    return null;
  }

  const hasBundle = item.bundle !== undefined;
  const hasOfferTag = item.offerTag !== undefined;
  const hasSet = 'set' in mainItem && mainItem.set !== undefined;
  const hasType = 'type' in mainItem && mainItem.type !== undefined;
  const hasDescription =
    'description' in mainItem && mainItem.description !== undefined;

  return (
    <View>
      {/* Title */}
      <Text className="mb-2 text-base font-semibold text-white">{title}</Text>

      {/* Type */}
      {hasType && (
        <Text className="mb-1 text-xs text-gray-400">
          {mainItem.type.displayValue}
        </Text>
      )}

      {/* Description */}
      {hasDescription && (
        <Text className="mb-2 text-xs text-gray-300" numberOfLines={2}>
          {mainItem.description}
        </Text>
      )}

      {/* Set Info */}
      {hasSet && mainItem.set && (
        <View className="mb-2 rounded bg-neutral-700 px-2 py-1">
          <Text className="text-xs text-gray-300">{mainItem.set.text}</Text>
        </View>
      )}

      {/* Bundle Info */}
      {hasBundle && item.bundle && (
        <View className="mb-2 rounded bg-blue-900/30 px-2 py-1">
          <Text className="text-xs font-medium text-blue-400">
            {item.bundle.name} - {item.bundle.info}
          </Text>
        </View>
      )}

      {/* Offer Tag */}
      {hasOfferTag && item.offerTag && (
        <View className="rounded bg-yellow-900/30 px-2 py-1">
          <Text className="text-xs text-yellow-300">{item.offerTag.text}</Text>
        </View>
      )}
    </View>
  );
}
