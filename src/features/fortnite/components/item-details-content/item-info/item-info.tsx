import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { DetailedBrItem } from '@/api/fortnite/types';
import { Text } from '@/components/ui';

const styles = StyleSheet.create({
  itemName: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
});

type Props = {
  brItemData: DetailedBrItem;
};

export function ItemInfo({ brItemData }: Props) {
  return (
    <View className="border-t border-neutral-200 bg-white px-4 py-5 dark:border-neutral-800 dark:bg-neutral-900">
      <Text
        className="mb-3 text-3xl text-fortnite-accent"
        style={styles.itemName}
        numberOfLines={2}
      >
        {brItemData.name}
      </Text>

      <View className="mb-4 flex-row flex-wrap">
        {brItemData.rarity && (
          <View className="mb-2 mr-2 rounded-md bg-neutral-200 px-3 py-1 dark:bg-neutral-800">
            <Text className="text-sm font-medium text-fortnite-accent">
              {brItemData.rarity.displayValue}
            </Text>
          </View>
        )}

        {brItemData.type && (
          <View className="mb-2 mr-2 rounded-md bg-neutral-200 px-3 py-1 dark:bg-neutral-800">
            <Text className="text-sm text-neutral-700 dark:text-gray-300">
              {brItemData.type.displayValue}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
