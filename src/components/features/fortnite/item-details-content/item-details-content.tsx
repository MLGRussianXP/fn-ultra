import * as React from 'react';

import type { FortniteDetailedBrItem } from '@/api/fortnite/types';
import { Text, View } from '@/components/ui';

import { ItemAdditionalInfo } from './item-additional-info';
import { ItemHero } from './item-hero';
import { ItemInfo } from './item-info';
import { ItemVariants } from './item-variants';

type Props = {
  item: FortniteDetailedBrItem;
};

export function ItemDetailsContent({ item }: Props) {
  return (
    <View className="flex-1">
      <ItemHero item={item} />

      <View className="px-4 pb-2 pt-4">
        <Text className="mb-1 text-2xl font-bold text-neutral-900 dark:text-white">
          {item.name}
        </Text>
        <Text className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
          {item.type.displayValue}
        </Text>
        <Text className="text-base text-neutral-800 dark:text-neutral-200">
          {item.description}
        </Text>
      </View>

      <View className="p-4 pt-0">
        <ItemInfo item={item} />
        <ItemVariants variants={item.variants} />

        <ItemAdditionalInfo item={item} />
      </View>
    </View>
  );
}
