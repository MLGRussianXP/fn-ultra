import { useCallback, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import type { DetailedBrItem } from '@/api/fortnite/types';
import { Text } from '@/components/ui';

type Props = {
  brItemData: DetailedBrItem;
  seriesImage?: string;
  gradientColors?: string[];
  testID?: string;
};

// eslint-disable-next-line max-lines-per-function
export function ItemImageCarousel({
  brItemData,
  seriesImage,
  gradientColors,
  testID,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get('window');

  // Get all available images from the item
  const images = [
    brItemData.images.icon,
    brItemData.images.featured,
    ...(brItemData.images.lego
      ? [brItemData.images.lego.small, brItemData.images.lego.large]
      : []),
  ].filter(Boolean) as string[];

  // Handle scroll event to update active index
  const handleScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const slideIndex = Math.round(
        event.nativeEvent.contentOffset.x / (width - 48)
      );
      setActiveIndex(slideIndex);
    },
    [width]
  );

  // No images available
  if (images.length === 0) {
    return (
      <View
        className="h-80 items-center justify-center bg-neutral-900"
        testID={testID}
      >
        <Text className="text-white">No images available</Text>
      </View>
    );
  }

  return (
    <View className="mb-4" testID={testID}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={width - 48}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 24 }}
        onScroll={handleScroll}
        keyExtractor={(item) => item}
        renderItem={({ item: imageUrl }) => (
          <View
            className="relative mr-4 overflow-hidden rounded-lg"
            style={{ width: width - 48, height: 300 }}
          >
            {/* Series image background with gradient overlay */}
            {seriesImage && (
              <View
                className="absolute size-full opacity-20"
                testID="carousel-series-image-bg"
              >
                <Image
                  source={{ uri: seriesImage }}
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Gradient background */}
            {gradientColors && gradientColors.length > 0 && (
              <View
                className="absolute size-full"
                style={{
                  backgroundColor: gradientColors[0],
                  opacity: 0.3,
                }}
                testID="carousel-gradient-bg"
              />
            )}

            {/* Main image */}
            <Image
              source={{ uri: imageUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>
        )}
      />

      {/* Pagination dots */}
      {images.length > 1 && (
        <View
          className="mt-4 flex-row justify-center"
          testID="pagination-container"
        >
          {images.map((_, index) => (
            <Pressable
              key={index}
              onPress={() => setActiveIndex(index)}
              className={`mx-1 size-2 rounded-full ${
                activeIndex === index ? 'bg-white' : 'bg-gray-600'
              }`}
            />
          ))}
        </View>
      )}

      {/* Series info */}
      {brItemData.series && (
        <View className="mt-4 items-center">
          <Text className="text-center text-sm text-gray-400">
            {brItemData.series.value}
          </Text>
          {brItemData.series.colors && (
            <View className="mt-2 flex-row">
              {brItemData.series.colors
                .map((color: string) => `#${color.slice(0, 6)}`)
                .map((color, index) => (
                  <View
                    key={index}
                    className="mx-1 size-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
