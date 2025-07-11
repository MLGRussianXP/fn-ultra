import type { FortniteDetailedBrItem } from '@/api/fortnite/types';
import { View } from '@/components/ui';

import { ItemImageCarousel } from './item-image-carousel';

type Props = {
  item: FortniteDetailedBrItem;
};

export function ItemHero({ item }: Props) {
  return (
    <View className="relative aspect-[1.2] w-full overflow-hidden">
      <ItemImageCarousel item={item} />
    </View>
  );
}
