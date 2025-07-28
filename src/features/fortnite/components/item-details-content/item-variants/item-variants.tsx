import React from 'react';
import { Image, ScrollView, View } from 'react-native';

import type { Variant } from '@/api/fortnite/types';
import { Text } from '@/components/ui';
import { translate } from '@/lib/i18n';

type Props = {
  variants: Variant[];
};

export function ItemVariants({ variants }: Props) {
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <View className="border-t border-neutral-200 bg-white px-4 py-5 dark:border-neutral-800 dark:bg-neutral-900">
      <Text className="mb-4 text-xl font-semibold text-fortnite-accent">
        {translate('item_details.variants')}
      </Text>

      {variants.map((variant, variantIndex) => (
        <View key={variantIndex} className="mb-6">
          <Text className="mb-3 text-base font-medium text-fortnite-accent">
            {variant.channel}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {variant.options.map((option, optionIndex) => (
              <View key={optionIndex} className="mr-4">
                <View className="size-20 overflow-hidden rounded-lg border border-neutral-300 dark:border-neutral-700">
                  <Image
                    source={{ uri: option.image }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>
                <Text
                  className="mt-1 text-center text-xs text-neutral-700 dark:text-gray-300"
                  numberOfLines={1}
                >
                  {option.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}
