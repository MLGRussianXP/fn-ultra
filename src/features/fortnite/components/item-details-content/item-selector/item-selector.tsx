import React, { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';

import type { ShopItem } from '@/api/fortnite/types';
import { Text } from '@/components/ui';
import { translate } from '@/lib/i18n';

const styles = StyleSheet.create({
  itemName: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
});

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
    <View className="border-b border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <Text
        className="mb-3 text-xl text-fortnite-accent dark:text-fortnite-accent"
        style={styles.sectionTitle}
      >
        {translate('item_details.bundle_contents')}
      </Text>
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 4 }}
        renderItem={({ item }) => {
          const isSelected = selectedItemId === item.id;
          const bgClass = isSelected
            ? 'bg-fortnite-accent'
            : 'bg-neutral-200 dark:bg-neutral-800';

          return (
            <Pressable
              onPress={() => onSelectItem(item.id)}
              className={`mr-3 rounded-lg p-2 ${bgClass}`}
              accessibilityLabel={`Select ${item.name}`}
              accessibilityRole="button"
            >
              <View className="items-center">
                <View className="size-16 items-center justify-center overflow-hidden rounded-md bg-neutral-100 p-1 dark:bg-neutral-900">
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 56, height: 56 }}
                    resizeMode="contain"
                  />
                </View>
                <Text
                  className={`mt-2 max-w-[80px] text-center text-xs ${isSelected ? 'text-white' : 'text-neutral-800 dark:text-white'}`}
                  style={styles.itemName}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
