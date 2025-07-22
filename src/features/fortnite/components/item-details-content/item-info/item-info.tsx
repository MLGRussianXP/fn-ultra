import React from 'react';
import { View } from 'react-native';

import type { DetailedBrItem } from '@/api/fortnite/types';
import { Text } from '@/components/ui';

type Props = {
  brItemData: DetailedBrItem;
};

export function ItemInfo({ brItemData }: Props) {
  return (
    <View className="px-4 pt-4">
      <Text className="mb-2 text-3xl font-bold text-white">
        {brItemData.name}
      </Text>

      <View className="mb-4 flex-row flex-wrap">
        <View className="mb-2 mr-2 rounded-md bg-gray-800 px-3 py-1">
          <Text className="text-sm text-gray-300">
            {brItemData.rarity.displayValue}
          </Text>
        </View>

        <View className="mb-2 mr-2 rounded-md bg-gray-800 px-3 py-1">
          <Text className="text-sm text-gray-300">
            {brItemData.type.displayValue}
          </Text>
        </View>
      </View>
    </View>
  );
}
