import React from 'react';
import { View } from 'react-native';

import type { DetailedBrItem } from '@/api/fortnite/types';

import { ItemImageCarousel } from '../item-image-carousel';

type Props = {
  brItemData: DetailedBrItem;
  seriesImage?: string;
  gradientColors?: string[];
};

export function ItemHero({ brItemData, seriesImage, gradientColors }: Props) {
  return (
    <View
      className="relative aspect-[1.2] w-full overflow-hidden"
      testID="item-hero"
    >
      <ItemImageCarousel
        brItemData={brItemData}
        seriesImage={seriesImage}
        gradientColors={gradientColors}
        testID="item-image-carousel"
      />
    </View>
  );
}
