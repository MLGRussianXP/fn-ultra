import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';

import { type BrItem } from '@/api/fortnite/types';

export function BrItemCard({ item }: { item: BrItem }) {
  const image = item.images.icon || item.images.smallIcon;
  const title = item.name;
  const seriesImage = item.series?.image;
  const gradientColors = item.series?.colors
    ?.slice(0, 2)
    .map((c) => `#${c.slice(0, 6)}`) || ['#6366f1', '#8b5cf6'];
  const hasSeriesImage = !!seriesImage;
  const hasColors = !!item.series?.colors;

  const handlePress = useCallback(() => {
    router.push({ pathname: '/item/[id]', params: { id: item.id } });
  }, [item.id]);

  return (
    <Pressable
      className="mb-3 w-[48%] overflow-hidden rounded-xl shadow-lg"
      onPress={handlePress}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
      testID="br-item-card-pressable"
    >
      <View className="relative h-52 bg-gray-200 dark:bg-gray-700">
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
        {/* Image */}
        {image && (
          <Image
            source={{ uri: image }}
            className="relative z-10 size-full"
            contentFit="cover"
          />
        )}
        {/* Overlay */}
        <View className="absolute inset-x-0 bottom-0 z-20 bg-black/40 p-3">
          <Text className="mb-1 text-sm font-bold text-white" numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
