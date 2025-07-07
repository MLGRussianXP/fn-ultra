import * as React from 'react';
import { Pressable } from 'react-native';

import type { FortniteShopItem } from '@/api/fortnite/types';
import { Image, Text, View } from '@/components/ui';

import { ShopItemContent } from '../shop-item-content';

type Props = {
  item: FortniteShopItem;
  onPress?: () => void;
};

export function ShopItem({ item, onPress }: Props) {
  const mainItem = item.brItems?.[0] || item.tracks?.[0];
  const imageUrl =
    item.newDisplayAsset?.renderImages?.[0]?.image ||
    (mainItem && 'images' in mainItem ? mainItem.images?.icon : undefined) ||
    (mainItem && 'albumArt' in mainItem ? mainItem.albumArt : undefined);

  const formatPrice = (price: number) => {
    return `${price} V-Bucks`;
  };

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

  return (
    <Pressable onPress={onPress} className="mb-4" testID="shop-item-pressable">
      <View className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
        {/* Image */}
        <View className="relative">
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              className="h-48 w-full"
              contentFit="cover"
            />
          )}

          {/* Price Badge */}
          <View className="absolute right-2 top-2 rounded-full bg-black/70 px-3 py-1">
            <Text className="text-sm font-semibold text-white">
              {formatPrice(item.finalPrice)}
            </Text>
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
        </View>

        {/* Content */}
        <ShopItemContent item={item} mainItem={mainItem} />
      </View>
    </Pressable>
  );
}
