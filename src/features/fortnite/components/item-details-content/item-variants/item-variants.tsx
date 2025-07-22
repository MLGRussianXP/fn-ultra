import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

import type { Variant } from '@/api/fortnite/types';
import { Text } from '@/components/ui';

type Props = {
  variants: Variant[];
};

export function ItemVariants({ variants }: Props) {
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <View className="mt-6 px-4">
      <Text className="mb-4 text-lg font-semibold text-white">Variants</Text>

      {variants.map((variant, variantIndex) => (
        <View key={variantIndex} className="mb-6">
          <Text className="mb-2 text-base font-medium text-white">
            {variant.channel}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {variant.options.map((option, optionIndex) => (
              <Pressable key={optionIndex} className="mr-3">
                <View className="size-16 overflow-hidden rounded-lg">
                  <Image
                    source={{ uri: option.image }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>
                <Text className="mt-1 text-center text-xs text-gray-300">
                  {option.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}
