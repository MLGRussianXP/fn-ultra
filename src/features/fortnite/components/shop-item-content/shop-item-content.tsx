import * as React from 'react';

import type { ShopItem } from '@/api/fortnite/types';
import { fontStyles, Text, View } from '@/components/ui';

type Props = {
  item: ShopItem;
};

// Extracted components to reduce main component size
function ItemTitle({ title }: { title: string }) {
  return (
    <Text
      className="mb-1 text-lg text-gray-900 dark:text-white"
      style={fontStyles.bold}
    >
      {title}
    </Text>
  );
}

function ItemDescription({ description }: { description: string }) {
  return (
    <Text
      className="mb-2 text-sm text-gray-600 dark:text-gray-300"
      style={fontStyles.default}
    >
      {description}
    </Text>
  );
}

function ItemType({ type }: { type: string }) {
  return (
    <Text
      className="mb-2 text-xs text-gray-500 dark:text-gray-400"
      style={fontStyles.default}
    >
      {type}
    </Text>
  );
}

export function ShopItemContent({ item }: Props) {
  const mainItem = item.brItems?.[0] || item.tracks?.[0];
  const title =
    mainItem && 'name' in mainItem
      ? mainItem.name
      : mainItem && 'title' in mainItem
        ? mainItem.title
        : item.devName;

  return (
    <View className="p-4">
      {/* Title */}
      <ItemTitle title={title} />

      {/* Description */}
      {mainItem && 'description' in mainItem && mainItem.description && (
        <ItemDescription description={mainItem.description} />
      )}

      {/* Type */}
      {mainItem && 'type' in mainItem && mainItem.type && (
        <ItemType type={mainItem.type.displayValue} />
      )}

      {/* Set Info */}
      {mainItem && 'set' in mainItem && mainItem.set && (
        <View className="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700">
          <Text
            className="text-xs text-gray-600 dark:text-gray-300"
            style={fontStyles.default}
          >
            {mainItem.set.text}
          </Text>
        </View>
      )}

      {/* Bundle Info */}
      {item.bundle && (
        <View className="mt-2 rounded bg-blue-50 px-2 py-1 dark:bg-blue-900/20">
          <Text
            className="text-xs text-blue-600 dark:text-blue-400"
            style={fontStyles.bold}
          >
            {item.bundle.name} - {item.bundle.info}
          </Text>
        </View>
      )}

      {/* Offer Tag */}
      {item.offerTag && (
        <View className="mt-2 rounded bg-yellow-50 px-2 py-1 dark:bg-yellow-900/20">
          <Text
            className="text-xs text-yellow-700 dark:text-yellow-300"
            style={fontStyles.bold}
          >
            {item.offerTag.text}
          </Text>
        </View>
      )}
    </View>
  );
}
