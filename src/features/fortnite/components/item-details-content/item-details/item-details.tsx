import React from 'react';
import { View } from 'react-native';

import type { DetailedBrItem, ShopItem } from '@/api/fortnite/types';
import { Text } from '@/components/ui';

import { ItemAdditionalInfo } from '../item-additional-info';
import { ItemInfo } from '../item-info';
import { ItemSelector } from '../item-selector';
import { ItemVariants } from '../item-variants';

type Props = {
  entry: ShopItem | null;
  brItemData: DetailedBrItem;
  selectedItemId: string | undefined;
  onSelectItem: (id: string) => void;
};

export function ItemDetails({
  entry,
  brItemData,
  selectedItemId,
  onSelectItem,
}: Props) {
  return (
    <View className="mt-6 px-4 pb-12">
      <Text className="mb-4 text-lg font-semibold text-white">Debug Info</Text>

      {/* Basic item info */}
      <View className="mb-4 rounded-lg bg-gray-800 p-4">
        <Text className="mb-2 text-base font-medium text-white">
          Item Details
        </Text>
        <ItemInfo brItemData={brItemData} />
      </View>

      {/* Additional info */}
      <View className="mb-4 rounded-lg bg-gray-800 p-4">
        <Text className="mb-2 text-base font-medium text-white">
          Additional Info
        </Text>
        <ItemAdditionalInfo brItemData={brItemData} />
      </View>

      {/* Variants if available */}
      {brItemData.variants && brItemData.variants.length > 0 && (
        <View className="mb-4 rounded-lg bg-gray-800 p-4">
          <Text className="mb-2 text-base font-medium text-white">
            Variants
          </Text>
          <ItemVariants variants={brItemData.variants} />
        </View>
      )}

      {/* Bundle selector if available */}
      {entry && (
        <View className="mb-4 rounded-lg bg-gray-800 p-4">
          <Text className="mb-2 text-base font-medium text-white">
            Bundle Contents
          </Text>
          <ItemSelector
            entry={entry}
            selectedItemId={selectedItemId}
            onSelectItem={onSelectItem}
          />
        </View>
      )}
    </View>
  );
}
