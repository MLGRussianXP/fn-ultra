import type { FortniteDetailedBrItem } from '@/api/fortnite/types';
import { Text, View } from '@/components/ui';

type Props = {
  item: FortniteDetailedBrItem;
};

export function ItemInfo({ item }: Props) {
  return (
    <View className="mb-6">
      <View className="mb-3 flex-row items-center">
        <Text className="mr-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Rarity:
        </Text>
        <Text className="text-sm text-neutral-600 dark:text-neutral-400">
          {item.rarity.displayValue}
        </Text>
      </View>

      {item.series && (
        <View className="mb-3 flex-row items-center">
          <Text className="mr-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Series:
          </Text>
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">
            {item.series.value}
          </Text>
        </View>
      )}

      {item.set && (
        <View className="mb-3 flex-row items-center">
          <Text className="mr-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Set:
          </Text>
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">
            {item.set.value}
          </Text>
        </View>
      )}

      {item.introduction && (
        <View className="mb-3 flex-row items-center">
          <Text className="mr-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Introduced:
          </Text>
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">
            {item.introduction.text}
          </Text>
        </View>
      )}
    </View>
  );
}
