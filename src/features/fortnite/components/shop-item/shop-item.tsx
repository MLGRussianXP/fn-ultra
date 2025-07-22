import * as React from 'react';
import { Pressable } from 'react-native';

import type { ShopItem as ShopItemType } from '@/api/fortnite/types';
import { Image, Text, View } from '@/components/ui';

import { ShopItemPrice } from '../shop-item-price';

type Props = {
  item: ShopItemType;
  onPress?: () => void;
};

// Helper function to get rarity color class
const getRarityColor = (rarity?: string) => {
  switch (rarity?.toLowerCase()) {
    case 'common':
      return 'bg-gray-400';
    case 'uncommon':
      return 'bg-green-400';
    case 'rare':
      return 'bg-blue-400';
    case 'epic':
      return 'bg-purple-400';
    case 'legendary':
      return 'bg-orange-400';
    case 'marvel':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};

export function ShopItem({ item, onPress }: Props) {
  const mainItem = item.brItems?.[0] || item.tracks?.[0];
  const imageUrl =
    item.newDisplayAsset?.renderImages?.[0]?.image ||
    (mainItem && 'images' in mainItem ? mainItem.images?.icon : undefined) ||
    (mainItem && 'albumArt' in mainItem ? mainItem.albumArt : undefined);

  return (
    <Pressable
      onPress={onPress}
      className="overflow-hidden rounded-xl shadow-lg"
      testID="shop-item-pressable"
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
      role="button"
      accessibilityRole="button"
    >
      <View className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
        {/* Image */}
        <View className="relative h-48">
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              className="size-full"
              contentFit="cover"
            />
          )}

          {/* Price Badge */}
          <View className="absolute right-2 top-2 rounded-full bg-black/70 px-3 py-1">
            <ShopItemPrice item={item} />
          </View>

          {/* Rarity Badge */}
          {mainItem && 'rarity' in mainItem && mainItem.rarity && (
            <View
              className={`absolute left-2 top-2 ${getRarityColor(mainItem.rarity.value)} rounded-full px-2 py-1`}
            >
              <Text className="text-xs font-medium text-white">
                {mainItem.rarity.displayValue}
              </Text>
            </View>
          )}

          {/* Title Overlay */}
          <View className="absolute inset-x-0 bottom-0 bg-black/40 p-2">
            <Text
              className="text-sm font-bold text-white"
              numberOfLines={1}
              testID="item-title"
            >
              {mainItem && 'name' in mainItem
                ? mainItem.name
                : mainItem && 'title' in mainItem
                  ? mainItem.title
                  : item.devName}
            </Text>

            {/* Item Type - Added for test compatibility */}
            {mainItem && 'type' in mainItem && mainItem.type && (
              <Text className="text-xs text-gray-300">
                {mainItem.type.displayValue}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
