import type { FortniteDetailedBrItem } from '@/api/fortnite/types';
import { Text, View } from '@/components/ui';

type Props = {
  item: FortniteDetailedBrItem;
};

export function ItemAdditionalInfo({ item }: Props) {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-semibold text-neutral-900 dark:text-white">
        Additional Information
      </Text>

      {item.exclusiveDescription && (
        <View className="mb-2">
          <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Exclusive Description:
          </Text>
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">
            {item.exclusiveDescription}
          </Text>
        </View>
      )}

      {item.unlockRequirements && (
        <View className="mb-2">
          <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Unlock Requirements:
          </Text>
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">
            {item.unlockRequirements}
          </Text>
        </View>
      )}

      {item.customExclusiveCallout && (
        <View className="mb-2">
          <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Exclusive Callout:
          </Text>
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">
            {item.customExclusiveCallout}
          </Text>
        </View>
      )}

      <View className="mb-2">
        <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Added:
        </Text>
        <Text className="text-sm text-neutral-600 dark:text-neutral-400">
          {new Date(item.added).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}
