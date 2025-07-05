import { useLocalSearchParams, useNavigation } from 'expo-router';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { useFortniteBrItem } from '@/api/fortnite';
import { ItemDetailsContent } from '@/components/features/fortnite/item-details-content';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { data, isPending, isError, error } = useFortniteBrItem(id);

  // Set header title dynamically
  React.useLayoutEffect(() => {
    if (data?.data?.name) {
      navigation.setOptions({
        title: data.data.name,
      });
    } else {
      navigation.setOptions({
        title: 'Item Details',
      });
    }
  }, [data?.data?.name, navigation]);

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <FocusAwareStatusBar />
        <Text className="text-lg text-gray-900 dark:text-white">
          Loading item details...
        </Text>
      </View>
    );
  }

  if (isError || !data?.data) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <FocusAwareStatusBar />
        <Text className="mb-2 text-center text-lg font-semibold text-gray-900 dark:text-white">
          Error Loading Item
        </Text>
        <Text className="mb-4 text-center text-sm text-gray-600 dark:text-gray-300">
          {error instanceof Error
            ? error.message
            : 'Failed to load item details'}
        </Text>
      </View>
    );
  }

  const item = data.data;

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <ItemDetailsContent item={item} />
      </ScrollView>
    </View>
  );
}
