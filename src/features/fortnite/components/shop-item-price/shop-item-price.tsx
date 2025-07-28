import * as React from 'react';
import { StyleSheet } from 'react-native';

import { useShop } from '@/api/fortnite';
import type { ShopItem } from '@/api/fortnite/types';
import { Image, Text, View } from '@/components/ui';

// Explicit styles for price elements
const styles = StyleSheet.create({
  priceValue: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
  discountText: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
});

type Props = {
  item: ShopItem;
};

export function ShopItemPrice({ item }: Props) {
  const { data } = useShop();
  const vbuckIcon = data?.data?.vbuckIcon;
  const hasDiscount = item.regularPrice !== item.finalPrice;

  return (
    <View className="flex-row items-center">
      <Text className="text-fortnite-yellow" style={styles.priceValue}>
        {item.finalPrice}
      </Text>

      {vbuckIcon ? (
        <Image
          source={{ uri: vbuckIcon }}
          className="ml-xs size-4"
          contentFit="contain"
        />
      ) : (
        <Text className="ml-xs text-xs text-contrast-high-light">v</Text>
      )}

      {hasDiscount && (
        <Text
          className="ml-sm text-xs text-neutral-300 line-through"
          style={styles.discountText}
        >
          {item.regularPrice}
        </Text>
      )}
    </View>
  );
}
