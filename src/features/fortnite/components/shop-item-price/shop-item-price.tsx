import * as React from 'react';
import { StyleSheet } from 'react-native';

import type { ShopItem } from '@/api/fortnite/types';
import { Text, View } from '@/components/ui';

// Explicit styles for price elements
const styles = StyleSheet.create({
  priceValue: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
  vbucksText: {
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
  const hasDiscount = item.regularPrice !== item.finalPrice;

  return (
    <View className="flex-row items-center">
      <Text className="text-fortnite-yellow" style={styles.priceValue}>
        {item.finalPrice}
      </Text>
      <Text
        className="ml-xs text-xs text-contrast-high-light"
        style={styles.vbucksText}
      >
        V-Bucks
      </Text>

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
