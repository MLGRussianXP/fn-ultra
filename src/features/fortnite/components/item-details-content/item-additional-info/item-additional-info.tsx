import React from 'react';
import { View } from 'react-native';

import type { DetailedBrItem } from '@/api/fortnite/types';
import { Text } from '@/components/ui';

type Props = {
  brItemData: DetailedBrItem;
};

export function ItemAdditionalInfo({ brItemData }: Props) {
  return (
    <View className="mt-6 px-4">
      <Text className="mb-2 text-lg font-semibold text-white">Description</Text>
      <Text className="mb-4 text-gray-300">{brItemData.description}</Text>

      {brItemData.set && (
        <View className="mb-4">
          <Text className="mb-2 text-lg font-semibold text-white">Set</Text>
          <Text className="text-gray-300">{brItemData.set.value}</Text>
        </View>
      )}

      {brItemData.introduction && (
        <View className="mb-4">
          <Text className="mb-2 text-lg font-semibold text-white">
            Introduction
          </Text>
          <Text className="text-gray-300">{brItemData.introduction.text}</Text>
        </View>
      )}

      {brItemData.gameplayTags && brItemData.gameplayTags.length > 0 && (
        <View className="mb-4">
          <Text className="mb-2 text-lg font-semibold text-white">Tags</Text>
          <View className="flex-row flex-wrap">
            {brItemData.gameplayTags.map((tag) => (
              <View
                key={tag}
                className="mb-2 mr-2 rounded-full bg-gray-800 px-3 py-1"
              >
                <Text className="text-sm text-gray-300">
                  {tag.replace('Cosmetics.', '').replace('Set.', '')}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
