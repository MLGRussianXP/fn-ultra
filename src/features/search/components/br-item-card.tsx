import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { View } from 'react-native';

import { type BrItem } from '@/api/fortnite/types';
import { AnimatedPressable, Text } from '@/components/ui';

// Component for the item card background
function ItemCardBackground({
  seriesImage,
  hasSeriesImage,
  hasColors,
  gradientColors,
}: {
  seriesImage?: string;
  hasSeriesImage: boolean;
  hasColors: boolean;
  gradientColors: string[];
}) {
  return (
    <>
      {/* Series Image Background */}
      {hasSeriesImage && (
        <Image
          source={{ uri: seriesImage }}
          className="absolute inset-0 size-full"
          contentFit="cover"
        />
      )}
      {/* Gradient Background */}
      {hasColors && !hasSeriesImage && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: gradientColors[0],
            opacity: 0.7,
          }}
        />
      )}
    </>
  );
}

// Component for the item card overlay
function ItemCardOverlay({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View className="absolute inset-x-0 bottom-0 z-20 bg-black/60 p-3">
      <Text variant="fortnite" className="text-white" numberOfLines={1}>
        {title}
      </Text>
      <Text variant="bodySmall" className="text-white/80" numberOfLines={1}>
        {subtitle}
      </Text>
    </View>
  );
}

export function BrItemCard({ item }: { item: BrItem }) {
  const image = item.images.icon || item.images.smallIcon;
  const title = item.name;
  const seriesImage = item.series?.image;
  const gradientColors = item.series?.colors
    ?.slice(0, 2)
    .map((c) => `#${c.slice(0, 6)}`) || ['#6366f1', '#8b5cf6'];
  const hasSeriesImage = !!seriesImage;
  const hasColors = !!item.series?.colors;
  const rarityColor = getRarityColor(item.rarity?.value);
  const subtitle = item.rarity?.displayValue || item.type?.displayValue || '';

  const handlePress = useCallback(() => {
    router.push({ pathname: '/item/[id]', params: { id: item.id } });
  }, [item.id]);

  return (
    <AnimatedPressable
      className="mb-4 w-[48%] overflow-hidden rounded-xl shadow-lg"
      onPress={handlePress}
      testID="br-item-card-pressable"
      scaleFactor={0.97}
      useSpring={true}
    >
      <View className="relative h-52 bg-neutral-200 dark:bg-neutral-700">
        <ItemCardBackground
          seriesImage={seriesImage}
          hasSeriesImage={hasSeriesImage}
          hasColors={hasColors}
          gradientColors={gradientColors}
        />

        {/* Rarity Border */}
        <View
          className="absolute inset-0 z-10 rounded-xl border-2"
          style={{ borderColor: rarityColor }}
        />

        {/* Image */}
        {image && (
          <Image
            source={{ uri: image }}
            className="relative z-0 size-full"
            contentFit="cover"
          />
        )}

        <ItemCardOverlay title={title} subtitle={subtitle} />
      </View>
    </AnimatedPressable>
  );
}

// Helper function to get color based on rarity
function getRarityColor(rarity?: string): string {
  switch (rarity?.toLowerCase()) {
    case 'common':
      return '#b1b1b1';
    case 'uncommon':
      return '#1eff00';
    case 'rare':
      return '#0070dd';
    case 'epic':
      return '#a335ee';
    case 'legendary':
      return '#ff8000';
    case 'mythic':
      return '#ff4500';
    case 'marvel':
      return '#ed1d24';
    case 'dc':
      return '#0476f4';
    case 'icon':
      return '#3ccfff';
    case 'frozen':
      return '#99ffff';
    case 'lava':
      return '#ff3c00';
    case 'slurp':
      return '#18e2c8';
    case 'dark':
      return '#e75cff';
    case 'shadow':
      return '#292929';
    default:
      return '#ffffff';
  }
}
