import { LinearGradient } from 'expo-linear-gradient';

import type { FortniteDetailedBrItem } from '@/api/fortnite/types';
import { Image, View } from '@/components/ui';

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
        <Image
          source={{ uri: item.series!.image }}
          className="absolute inset-0 size-full"
          contentFit="cover"
          testID="item-hero-series-image"
        />
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

      {/* Image */}
      {item.images.featured && (
        <Image
          source={{ uri: item.images.featured }}
          className="relative z-10 size-full"
          contentFit="contain"
        />
      )}
    </View>
  );
}
