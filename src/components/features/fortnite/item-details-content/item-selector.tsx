import * as React from 'react';
import { FlatList, Pressable } from 'react-native';

import type { FortniteShopItem } from '@/api/fortnite/types';
import { Image, Text, View } from '@/components/ui';

type Props = {
  entry: FortniteShopItem;
  selectedItemId: string;
  onItemSelect: (itemId: string) => void;
};

type ItemData = {
  id: string;
  name: string;
  image: string;
  type: string;
};

function extractItemsFromEntry(entry: FortniteShopItem): ItemData[] {
  const items: ItemData[] = [];

  // Extract BR items
  if (entry.brItems && Array.isArray(entry.brItems)) {
    entry.brItems.forEach((item) => {
      items.push({
        id: item.id,
        name: item.name,
        image: item.images.icon,
        type: 'BR Item',
      });
    });
  }

  // Extract tracks
  if (entry.tracks && Array.isArray(entry.tracks)) {
    entry.tracks.forEach((track) => {
      items.push({
        id: track.id,
        name: track.title,
        image: track.albumArt,
        type: 'Track',
      });
    });
  }

  // Extract instruments
  if (entry.instruments && Array.isArray(entry.instruments)) {
    entry.instruments.forEach((instrument) => {
      items.push({
        id: instrument.id,
        name: instrument.name,
        image: instrument.images.large,
        type: 'Instrument',
      });
    });
  }

  // Extract cars
  if (entry.cars && Array.isArray(entry.cars)) {
    entry.cars.forEach((car) => {
      items.push({
        id: car.id,
        name: car.name,
        image: car.images.large,
        type: 'Car',
      });
    });
  }

  // Extract lego kits
  if (entry.legoKits && Array.isArray(entry.legoKits)) {
    entry.legoKits.forEach((kit) => {
      items.push({
        id: kit.id,
        name: kit.name,
        image: kit.images.large,
        type: 'Lego Kit',
      });
    });
  }

  return items;
}

function ItemSelectorItem({
  item,
  isSelected,
  onPress,
}: {
  item: ItemData;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-3 rounded-lg border-2 p-2 ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'}`}
      testID={`item-selector-${item.id}`}
    >
      <Image
        source={{ uri: item.image }}
        className="mb-2 size-16 rounded"
        contentFit="cover"
      />
      <Text
        className={`text-xs font-medium ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
        numberOfLines={2}
      >
        {item.name}
      </Text>
    </Pressable>
  );
}

export function ItemSelector({ entry, selectedItemId, onItemSelect }: Props) {
  const items = React.useMemo(() => extractItemsFromEntry(entry), [entry]);

  const renderItem = React.useCallback(
    ({ item }: { item: ItemData }) => (
      <ItemSelectorItem
        item={item}
        isSelected={item.id === selectedItemId}
        onPress={() => onItemSelect(item.id)}
      />
    ),
    [selectedItemId, onItemSelect]
  );

  if (items.length <= 1) {
    return null;
  }

  return (
    <View className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <Text className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
        Items in this bundle ({items.length})
      </Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      />
    </View>
  );
}
