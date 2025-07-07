import { LinearGradient } from 'expo-linear-gradient';

import type { FortniteDetailedBrItem } from '@/api/fortnite/types';
import { View } from '@/components/ui';

import { ItemImageCarousel } from './item-image-carousel';

type Props = {
  item: FortniteDetailedBrItem;
};

export function ItemHero({ item }: Props) {
  // Use the same gradient logic as shop cards
  const getGradientColors = () => {
    // For detailed items, we don't have the colors property like shop items
    // So we'll use series colors or fallback to default
    if (item.series?.colors && item.series.colors.length >= 2) {
      const colors = item.series.colors
        .slice(0, 2)
        .map((color) => `#${color.slice(0, 6)}`);
      return colors as [string, string];
    }
    return ['#6366f1', '#8b5cf6'] as const; // Default purple gradient
  };

  const gradientColors = getGradientColors();
  const hasSeriesImage = !!item.series?.image;

  return (
    <View className="relative aspect-[1.2] w-full overflow-hidden">
      {/* Series Image Background - show if available */}
      {hasSeriesImage && (
        <View
          className="absolute inset-0 size-full"
          testID="item-hero-series-image"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            }}
          />
        </View>
      )}

      {/* Background gradient - only show if no series image */}
      {!hasSeriesImage && (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          testID="item-hero-gradient"
        />
      )}

      {/* Image Carousel */}
      <View className="relative z-10 size-full">
        <ItemImageCarousel item={item} />
      </View>
    </View>
  );
}
