import React, { useState } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';

import type { ShopItem } from '@/api/fortnite/types';
import { Text } from '@/components/ui';

type Props = {
  entry: ShopItem;
  selectedItemId: string | undefined;
  onSelectItem: (id: string) => void;
};

type SelectorItem = {
  id: string;
  name: string;
  image: string;
  type: string;
};

// eslint-disable-next-line max-lines-per-function
export function ItemSelector({ entry, selectedItemId, onSelectItem }: Props) {
  const [items] = useState<SelectorItem[]>(() => {
    const selectorItems: SelectorItem[] = [];

    // Add BR items
    if (entry.brItems && entry.brItems.length > 0) {
      entry.brItems.forEach((item) => {
        selectorItems.push({
          id: item.id,
          name: item.name,
          image: item.images.smallIcon || item.images.icon,
          type: 'Cosmetic',
        });
      });
    }

    // Add tracks
    if (entry.tracks && entry.tracks.length > 0) {
      entry.tracks.forEach((track) => {
        selectorItems.push({
          id: track.id,
          name: track.title,
          image: track.albumArt,
          type: 'Track',
        });
      });
    }

    // Add instruments
    if (entry.instruments && entry.instruments.length > 0) {
      entry.instruments.forEach((instrument) => {
        selectorItems.push({
          id: instrument.id,
          name: instrument.name,
          image: instrument.images.small,
          type: 'Instrument',
        });
      });
    }

    // Add cars
    if (entry.cars && entry.cars.length > 0) {
      entry.cars.forEach((car) => {
        selectorItems.push({
          id: car.id,
          name: car.name,
          image: car.images.small,
          type: 'Vehicle',
        });
      });
    }

    // Add LEGO kits
    if (entry.legoKits && entry.legoKits.length > 0) {
      entry.legoKits.forEach((kit) => {
        selectorItems.push({
          id: kit.id,
          name: kit.name,
          image: kit.images.small,
          type: 'LEGO Kit',
        });
      });
    }

    return selectorItems;
  });

  // Only show selector if there are multiple items
  if (items.length <= 1) {
    return null;
  }

  return (
    <View className="mb-4 px-4">
      <Text className="mb-2 text-lg font-semibold text-white">
        Bundle Contents
      </Text>
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onSelectItem(item.id)}
            className={`mr-3 rounded-lg p-2 ${
              selectedItemId === item.id ? 'bg-indigo-600' : 'bg-gray-800'
            }`}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: 60, height: 60 }}
              resizeMode="contain"
            />
            <Text
              className="mt-1 max-w-[80px] text-center text-xs text-white"
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
