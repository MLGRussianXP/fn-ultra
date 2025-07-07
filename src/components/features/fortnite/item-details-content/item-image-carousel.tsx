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

function ImageItem({ uri }: { uri: string }) {
  return <Image source={{ uri }} className="size-full" contentFit="contain" />;
}

function CarouselItem({
  item,
  index,
  onPress,
}: {
  item: CarouselItem;
  index: number;
  onPress: (index: number) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(index)}
      className="w-full items-center justify-center"
      style={{ width: screenWidth }}
    >
      {item.isVideo && item.videoId ? (
        <VideoPlayer videoId={item.videoId} />
      ) : (
        <ImageItem uri={item.uri} />
      )}
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
}: {
  images: CarouselItem[];
  onImagePress: (index: number) => void;
  onScroll: any;
  onMomentumScrollEnd: any;
}) {
  const renderItem = React.useCallback(
    ({ item: carouselItem, index }: { item: CarouselItem; index: number }) => (
      <CarouselItem item={carouselItem} index={index} onPress={onImagePress} />
    ),
    [onImagePress]
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
