import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { Dimensions, Pressable } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { WebView } from 'react-native-webview';

import type { FortniteDetailedBrItem } from '@/api/fortnite/types';
import { Image, Text, View } from '@/components/ui';

const { width: screenWidth } = Dimensions.get('window');

type Props = {
  item: FortniteDetailedBrItem;
};

type CarouselItem = {
  uri: string;
  type: string;
  isVideo?: boolean;
  videoId?: string;
};

function useCarouselImages(item: FortniteDetailedBrItem) {
  return React.useMemo(() => {
    const imageList: CarouselItem[] = [];

    // 1. Featured image (highest priority)
    if (item.images.featured) {
      imageList.push({
        uri: item.images.featured,
        type: 'Featured',
      });
    }

    // 2. Icon as fallback (second priority)
    if (
      item.images.icon &&
      !imageList.some((img) => img.uri === item.images.icon)
    ) {
      imageList.push({
        uri: item.images.icon,
        type: 'Icon',
      });
    }

    // 3. Showcase video (third priority)
    if (item.showcaseVideo) {
      imageList.push({
        uri: '',
        type: 'Showcase Video',
        isVideo: true,
        videoId: item.showcaseVideo,
      });
    }

    // Variant images removed from carousel

    return imageList;
  }, [item]);
}

function VideoPlayer({ videoId }: { videoId: string }) {
  const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0`;

  return (
    <View className="size-full bg-black">
      <WebView
        source={{ uri: videoUrl }}
        style={{ flex: 1 }}
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

function ImageItem({ uri, testID }: { uri: string; testID?: string }) {
  return (
    <Image
      source={{ uri }}
      className="size-full"
      contentFit="contain"
      testID={testID}
    />
  );
}

function CarouselItemComponent({
  item,
  index,
  onPress,
  parentItem,
}: {
  item: CarouselItem;
  index: number;
  onPress: (index: number) => void;
  parentItem: FortniteDetailedBrItem;
}) {
  // Background logic (series image or gradient)
  const hasSeriesImage = !!parentItem.series?.image;
  const gradientColors = React.useMemo(() => {
    if (parentItem.series?.colors && parentItem.series.colors.length >= 2) {
      const colors = parentItem.series.colors
        .slice(0, 2)
        .map((color) => `#${color.slice(0, 6)}`);
      return colors as [string, string];
    }
    return ['#6366f1', '#8b5cf6'] as const;
  }, [parentItem]);

  return (
    <Pressable
      onPress={() => onPress(index)}
      className="w-full items-center justify-center"
      style={{ width: screenWidth }}
    >
      {/* Background: series image or gradient */}
      <View className="absolute inset-0 size-full">
        {hasSeriesImage && parentItem.series?.image ? (
          <Image
            source={{ uri: parentItem.series.image }}
            className="absolute inset-0 size-full"
            contentFit="cover"
            testID="carousel-series-image-bg"
          />
        ) : (
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
            testID="carousel-gradient-bg"
          />
        )}
      </View>
      {/* Foreground: image or video */}
      <View className="relative z-10 size-full">
        {item.isVideo && item.videoId ? (
          <VideoPlayer videoId={item.videoId} />
        ) : (
          <ImageItem uri={item.uri} testID={`carousel-image-${index}`} />
        )}
      </View>
    </Pressable>
  );
}

function DotIndicator({
  index,
  activeIndex,
}: {
  index: number;
  activeIndex: number;
}) {
  return (
    <View
      className={`mx-1 size-2 rounded-full ${
        index === activeIndex ? 'bg-white' : 'bg-white/50'
      }`}
    />
  );
}

function CarouselContent({
  images,
  onImagePress,
  onScroll,
  onMomentumScrollEnd,
  parentItem,
}: {
  images: CarouselItem[];
  onImagePress: (index: number) => void;
  onScroll: any;
  onMomentumScrollEnd: any;
  parentItem: FortniteDetailedBrItem;
}) {
  const renderItem = React.useCallback(
    ({ item: carouselItem, index }: { item: CarouselItem; index: number }) => (
      <CarouselItemComponent
        item={carouselItem}
        index={index}
        onPress={onImagePress}
        parentItem={parentItem}
      />
    ),
    [onImagePress, parentItem]
  );

  return (
    <Animated.FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.type}-${index}`}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      onMomentumScrollEnd={onMomentumScrollEnd}
      scrollEventThrottle={16}
      testID="image-carousel"
    />
  );
}

export function ItemImageCarousel({ item }: Props) {
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const images = useCarouselImages(item);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleImagePress = React.useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleMomentumScrollEnd = React.useCallback((event: any) => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / screenWidth
    );
    setActiveIndex(newIndex);
  }, []);

  if (images.length === 0) {
    return (
      <View className="aspect-[1.2] w-full items-center justify-center bg-neutral-200 dark:bg-neutral-800">
        <Text className="text-neutral-500 dark:text-neutral-400">
          No images available
        </Text>
      </View>
    );
  }

  return (
    <View className="relative aspect-[1.2] w-full overflow-hidden">
      <CarouselContent
        images={images}
        onImagePress={handleImagePress}
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        parentItem={item}
      />

      {/* Image counter */}
      {images.length > 1 && (
        <View className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-1">
          <Text className="text-xs text-white">
            {activeIndex + 1} / {images.length}
          </Text>
        </View>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <View className="absolute inset-x-0 bottom-4 flex-row items-center justify-center">
          {images.map((_, index) => (
            <DotIndicator key={index} index={index} activeIndex={activeIndex} />
          ))}
        </View>
      )}
    </View>
  );
}
