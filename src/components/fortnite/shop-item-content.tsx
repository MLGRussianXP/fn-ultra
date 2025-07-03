import * as React from 'react';

import type { FortniteShopItem } from '@/api/fortnite/types';
import { Text, View } from '@/components/ui';

type Props = {
  item: FortniteShopItem;
  mainItem: any;
};

export function ShopItemContent({ item, mainItem }: Props) {
  return (
    <View className="p-4">
      {/* Title */}
      <Text className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
        {mainItem && 'name' in mainItem
          ? mainItem.name
          : mainItem && 'title' in mainItem
            ? mainItem.title
            : item.devName}
      </Text>

      {/* Description */}
      {mainItem && 'description' in mainItem && mainItem.description && (
        <Text className="mb-2 text-sm text-gray-600 dark:text-gray-300">
          {mainItem.description}
        </Text>
      )}

      {/* Type */}
      {mainItem && 'type' in mainItem && mainItem.type && (
        <Text className="mb-2 text-xs text-gray-500 dark:text-gray-400">
          {mainItem.type.displayValue}
        </Text>
      )}

      {/* Set Info */}
      {mainItem && 'set' in mainItem && mainItem.set && (
        <View className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">
          <Text className="text-xs text-gray-600 dark:text-gray-300">
            {mainItem.set.text}
          </Text>
        </View>
      )}

      {/* Bundle Info */}
      {item.bundle && (
        <View className="mt-2 rounded bg-blue-50 px-2 py-1 dark:bg-blue-900/20">
          <Text className="text-xs font-medium text-blue-600 dark:text-blue-400">
            {item.bundle.name} - {item.bundle.info}
          </Text>
        </View>
      )}

      {/* Offer Tag */}
      {item.offerTag && (
        <View className="mt-2 rounded bg-yellow-50 px-2 py-1 dark:bg-yellow-900/20">
          <Text className="text-xs text-yellow-700 dark:text-yellow-300">
            {item.offerTag.text}
          </Text>
        </View>
      )}
    </View>
  );
}
