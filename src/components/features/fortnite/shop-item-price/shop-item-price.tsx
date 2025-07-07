import React from 'react';

import { Image, Text, View } from '@/components/ui';

type Props = {
  regularPrice: number;
  finalPrice: number;
  vbuckIcon?: string;
  priceClass: string;
};

export function ShopItemPrice({
  regularPrice,
  finalPrice,
  vbuckIcon,
  priceClass,
}: Props) {
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
