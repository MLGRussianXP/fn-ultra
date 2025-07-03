import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

import type { FortniteShopItem } from '@/api/fortnite/types';
import { Image, Text, View } from '@/components/ui';

type Props = {
  entry: FortniteShopItem;
  isWide?: boolean;
  vbuckIcon?: string;
};

function getMainItem(entry: FortniteShopItem) {
  return (
    entry.brItems?.[0] ||
    entry.instruments?.[0] ||
    entry.cars?.[0] ||
    entry.tracks?.[0] ||
    entry.legoKits?.[0] ||
    null
  );
}

function getImage(entry: FortniteShopItem) {
  if (entry.bundle && entry.bundle.image) return entry.bundle.image;
  const mainItem = getMainItem(entry);
  if (mainItem && 'images' in mainItem && mainItem.images) {
    if ('icon' in mainItem.images && mainItem.images.icon)
      return mainItem.images.icon;
    if ('smallIcon' in mainItem.images && mainItem.images.smallIcon)
      return mainItem.images.smallIcon;
    if ('large' in mainItem.images && mainItem.images.large)
      return mainItem.images.large;
    if ('small' in mainItem.images && mainItem.images.small)
      return mainItem.images.small;
    if ('wide' in mainItem.images && mainItem.images.wide)
      return mainItem.images.wide;
  }
  if (mainItem && 'albumArt' in mainItem && mainItem.albumArt)
    return mainItem.albumArt;
  return undefined;
}

function getTitle(entry: FortniteShopItem) {
  if (entry.bundle && entry.bundle.name) return entry.bundle.name;
  const mainItem = getMainItem(entry);
  if (mainItem && 'name' in mainItem && mainItem.name) return mainItem.name;
  if (mainItem && 'title' in mainItem && mainItem.title) return mainItem.title;
  return 'Unknown';
}

function getGradientColors(entry: FortniteShopItem) {
  if (!entry.colors) {
    console.log('No colors for:', entry.devName);
    return ['#6366f1', '#8b5cf6'] as const; // Default purple gradient
  }

  const { color1, color2, color3 } = entry.colors;
  console.log('Raw colors for', entry.devName, ':', { color1, color2, color3 });

  // Convert 8-digit hex to 6-digit hex (remove alpha channel)
  const convertColor = (color: string) => {
    if (!color) return null;
    // Remove alpha channel (last 2 digits) and add # prefix
    return `#${color.slice(0, 6)}`;
  };

  const colors = [convertColor(color1)];

  // Add color2 if present
  if (color2) colors.push(convertColor(color2));

  // Add color3 if present
  if (color3) colors.push(convertColor(color3));

  const filteredColors = colors.filter(Boolean);
  console.log('Converted colors for', entry.devName, ':', filteredColors);

  // Ensure we have at least 2 colors for the gradient
  if (filteredColors.length < 2) {
    console.log('Not enough colors, using default for:', entry.devName);
    return ['#6366f1', '#8b5cf6'] as const;
  }

  console.log('Final gradient colors for', entry.devName, ':', filteredColors);
  return filteredColors as [string, string, ...string[]];
}

function PriceSection({
  regularPrice,
  finalPrice,
  vbuckIcon,
  priceClass,
}: {
  regularPrice: number;
  finalPrice: number;
  vbuckIcon?: string;
  priceClass: string;
}) {
  const hasDiscount = regularPrice !== finalPrice;

  return (
    <View className="flex-row items-center">
      {vbuckIcon && (
        <Image
          source={{ uri: vbuckIcon }}
          className="mr-2 size-4"
          contentFit="contain"
        />
      )}

      <View className="flex-row items-center">
        {hasDiscount && (
          <Text className="mr-2 text-sm text-gray-300 line-through">
            {regularPrice}
          </Text>
        )}
        <Text className={`font-semibold text-white ${priceClass}`}>
          {finalPrice}
        </Text>
      </View>
    </View>
  );
}

export const Card = ({ entry, isWide = false, vbuckIcon }: Props) => {
  const image = getImage(entry);
  const title = getTitle(entry);
  const { regularPrice, finalPrice } = entry;
  const gradientColors = getGradientColors(entry);
  const hasColors = !!entry.colors;

  const widthClass = isWide ? 'w-full' : 'w-[48%]';
  const titleClass = isWide ? 'text-lg' : 'text-sm';
  const priceClass = isWide ? 'text-base' : 'text-sm';

  console.log('Card render for', entry.devName, ':', {
    hasColors,
    gradientColors,
    image: !!image,
  });

  return (
    <View className={`mb-3 overflow-hidden rounded-xl shadow-lg ${widthClass}`}>
      {/* Main content container */}
      <View className="relative h-52">
        {/* Gradient Background - only show if colors are present */}
        {hasColors && (
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
          />
        )}

        {/* Image */}
        {image && (
          <Image
            source={{ uri: image }}
            className="size-full"
            contentFit="cover"
          />
        )}

        {/* Bottom overlay with title and price */}
        <View className="absolute inset-x-0 bottom-0 bg-black/40 p-3">
          {/* Title */}
          <Text
            className={`mb-1 font-bold text-white ${titleClass}`}
            numberOfLines={1}
          >
            {title}
          </Text>

          {/* Price Section */}
          <PriceSection
            regularPrice={regularPrice}
            finalPrice={finalPrice}
            vbuckIcon={vbuckIcon}
            priceClass={priceClass}
          />
        </View>
      </View>
    </View>
  );
};
