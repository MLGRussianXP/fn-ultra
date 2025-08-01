import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo, useState } from 'react';
import type { ColorValue } from 'react-native';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import type { DetailedBrItem } from '@/api/fortnite/types';
import { Text } from '@/components/ui';

import { FullscreenImageViewer } from './fullscreen-image-viewer/index';

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
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const { width } = Dimensions.get('window');
  const imageHeight = 360;

  // Get all available images from the item and filter out duplicates
  const images = useMemo(() => {
    const allImages = [
      brItemData.images.featured,
      brItemData.images.icon,
      ...(brItemData.images.lego
        ? [brItemData.images.lego.large, brItemData.images.lego.small]
        : []),
    ].filter(Boolean) as string[];

    // Remove duplicates
    return [...new Set(allImages)];
  }, [brItemData.images]);

  // Handle scroll event to update active index
  const handleScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
      setActiveIndex(slideIndex);
    },
    [width]
  );

  // Handle direct pagination tap
  const handlePaginationTap = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Handle image tap to open fullscreen viewer
  const handleImageTap = useCallback((index: number) => {
    setFullscreenIndex(index);
    setFullscreenVisible(true);
  }, []);

  // Handle closing fullscreen viewer
  const handleCloseFullscreen = useCallback(() => {
    setFullscreenVisible(false);
  }, []);

  // No images available
  if (images.length === 0) {
    return (
      <View
        className="h-80 items-center justify-center bg-fortnite-accent/10 dark:bg-fortnite-accent/20"
        testID={testID}
      >
        <Text className="text-neutral-800 dark:text-white">
          No images available
        </Text>
      </View>
    );
  }

  // Use the series color if available, otherwise use the default accent color
  const colorOne = (
    gradientColors && gradientColors.length > 0 ? gradientColors[0] : '#9D4EDD'
  ) as ColorValue; // First gradient color

  const colorTwo = (
    gradientColors && gradientColors.length > 1 ? gradientColors[1] : '#7E22CE'
  ) as ColorValue; // Second gradient color

  return (
    <View className="mb-2" testID={testID}>
      <View className="overflow-hidden">
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={width}
          decelerationRate="fast"
          onScroll={handleScroll}
          keyExtractor={(item) => item}
          renderItem={({ item: imageUrl, index }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleImageTap(index)}
              className="relative"
              style={{ width, height: imageHeight }}
              testID={`${testID}-image-${index}`}
            >
              {/* Gradient background - contained within the image box */}
              <View className="absolute size-full overflow-hidden rounded-lg">
                <LinearGradient
                  colors={[colorOne, colorTwo]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="absolute size-full"
                  testID="carousel-gradient-bg"
                />
              </View>

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

              {/* Main image */}
              <Image
                source={{ uri: imageUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Pagination dots */}
      {images.length > 1 && (
        <View
          className="mt-4 flex-row justify-center"
          testID="pagination-container"
        >
          {images.map((_, index) => (
            <Pressable
              key={index}
              onPress={() => handlePaginationTap(index)}
              className={`mx-1 h-2 w-8 rounded-full ${
                activeIndex === index
                  ? 'bg-fortnite-accent'
                  : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
              accessibilityLabel={`Image ${index + 1} of ${images.length}`}
              accessibilityRole="button"
            />
          ))}
        </View>
      )}

      {/* Series info */}
      {brItemData.series && (
        <View className="mt-4 items-center pb-2">
          <Text className="text-center text-sm font-medium text-fortnite-accent">
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

      {/* Fullscreen Image Viewer */}
      <FullscreenImageViewer
        images={images}
        initialIndex={fullscreenIndex}
        visible={fullscreenVisible}
        onClose={handleCloseFullscreen}
      />
    </View>
  );
}
