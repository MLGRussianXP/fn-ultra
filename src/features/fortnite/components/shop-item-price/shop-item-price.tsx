import * as React from 'react';

import type { ShopItem } from '@/api/fortnite/types';
import { Text } from '@/components/ui';

type Props = {
  item: ShopItem;
};

export function ShopItemPrice({ item }: Props) {
  const formatPrice = (price: number) => {
    return `${price} V-Bucks`;
  };

  return (
    <Text className="text-sm font-semibold text-white">
      {formatPrice(item.finalPrice)}
    </Text>
  );
}
