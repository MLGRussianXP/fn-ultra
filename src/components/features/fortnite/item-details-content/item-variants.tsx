import type { FortniteVariant } from '@/api/fortnite/types';
import { Image, Text, View } from '@/components/ui';

type Props = {
  variants?: FortniteVariant[];
};

export function ItemVariants({ variants }: Props) {
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-semibold text-neutral-900 dark:text-white">
        Variants
      </Text>
      {variants.map((variant, index) => (
        <View key={index} className="mb-4">
          <Text className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {variant.type}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {variant.options.map((option, optionIndex) => (
              <View
                key={optionIndex}
                className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700"
              >
                <Image
                  source={{ uri: option.image }}
                  className="size-16"
                  contentFit="cover"
                />
                <View className="p-2">
                  <Text className="text-xs text-neutral-600 dark:text-neutral-400">
                    {option.name}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
