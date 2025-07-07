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
  isAccessible: boolean;
};

function extractItemsFromEntry(entry: FortniteShopItem): ItemData[] {
  const items: ItemData[] = [];

  // Extract BR items - these are accessible via API
  if (entry.brItems && Array.isArray(entry.brItems)) {
    entry.brItems.forEach((item) => {
      items.push({
        id: item.id,
        name: item.name,
        image: item.images.icon,
        type: 'BR Item',
        isAccessible: true,
      });
    });
  }

  // Extract tracks - these are NOT accessible via API
  if (entry.tracks && Array.isArray(entry.tracks)) {
    entry.tracks.forEach((track) => {
      items.push({
        id: track.id,
        name: track.title,
        image: track.albumArt,
        type: 'Track',
        isAccessible: false,
      });
    });
  }

  // Extract instruments - these are NOT accessible via API
  if (entry.instruments && Array.isArray(entry.instruments)) {
    entry.instruments.forEach((instrument) => {
      items.push({
        id: instrument.id,
        name: instrument.name,
        image: instrument.images.large,
        type: 'Instrument',
        isAccessible: false,
      });
    });
  }

  // Extract cars - these are NOT accessible via API
  if (entry.cars && Array.isArray(entry.cars)) {
    entry.cars.forEach((car) => {
      items.push({
        id: car.id,
        name: car.name,
        image: car.images.large,
        type: 'Car',
        isAccessible: false,
      });
    });
  }

  // Extract lego kits - these are NOT accessible via API
  if (entry.legoKits && Array.isArray(entry.legoKits)) {
    entry.legoKits.forEach((kit) => {
      items.push({
        id: kit.id,
        name: kit.name,
        image: kit.images.large,
        type: 'Lego Kit',
        isAccessible: false,
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
  const isDisabled = !item.isAccessible;

  const getContainerStyles = () => {
    if (isDisabled) {
      return 'mr-3 rounded-lg border-2 p-2 border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800 opacity-50';
    }

    if (isSelected) {
      return 'mr-3 rounded-lg border-2 p-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }

    return 'mr-3 rounded-lg border-2 p-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800';
  };

  const getTextStyles = () => {
    if (isDisabled) {
      return 'text-xs font-medium text-gray-500 dark:text-gray-500';
    }

    if (isSelected) {
      return 'text-xs font-medium text-blue-600 dark:text-blue-400';
    }

    return 'text-xs font-medium text-gray-700 dark:text-gray-300';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={getContainerStyles()}
      testID={`item-selector-${item.id}`}
    >
      <Image
        source={{ uri: item.image }}
        className="mb-2 size-16 rounded"
        contentFit="cover"
        style={isDisabled ? { opacity: 0.5 } : undefined}
      />
      <Text className={getTextStyles()} numberOfLines={2}>
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
        onPress={() => item.isAccessible && onItemSelect(item.id)}
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
