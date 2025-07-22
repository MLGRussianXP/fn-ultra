import { router } from 'expo-router';
import React from 'react';
import { FlatList, RefreshControl } from 'react-native';

import { useShop } from '@/api/fortnite';
import type { ShopItem } from '@/api/fortnite/types';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';

import { ShopItem as ShopItemComponent } from '../shop-item';

/**
 * Loading state component
 */
function LoadingView() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-950">
      <FocusAwareStatusBar />
      <Text className="text-lg text-white">Loading shop...</Text>
    </View>
  );
}

/**
 * Error state component
 */
function ErrorView({
  error,
  refetch,
}: {
  error: unknown;
  refetch: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-950">
      <FocusAwareStatusBar />
      <Text className="mb-2 text-center text-lg font-semibold text-white">
        Error Loading Shop
      </Text>
      <Text className="mb-4 text-center text-sm text-gray-300">
        {error instanceof Error ? error.message : 'Failed to load shop data'}
      </Text>
      <Text
        className="text-blue-400 underline"
        onPress={() => refetch()}
        testID="refresh-button"
      >
        Tap to retry
      </Text>
    </View>
  );
}

/**
 * Empty state component
 */
function EmptyView() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-950">
      <FocusAwareStatusBar />
      <Text className="text-lg text-white">No items in shop</Text>
    </View>
  );
}

export function ShopScreen() {
  const { data, isPending, isError, error, refetch } = useShop();

  if (isPending) {
    return <LoadingView />;
  }

  if (isError) {
    return <ErrorView error={error} refetch={refetch} />;
  }

  if (!data?.data?.entries?.length) {
    return <EmptyView />;
  }

  const groupedEntries = groupAndSortEntries(data.data.entries);

  return (
    <View className="flex-1 bg-neutral-950">
      <FocusAwareStatusBar />
      <FlatList<GroupedEntry>
        data={groupedEntries}
        keyExtractor={(item) => String(item.layoutName)}
        renderItem={({ item }) => (
          <ShopSection
            title={item.layoutName}
            entries={item.entries}
            onItemPress={(entry) => {
              router.push({
                pathname: '/item/[id]',
                params: {
                  id: entry.brItems?.[0]?.id || 'unknown',
                  entry: JSON.stringify(entry),
                },
              });
            }}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isPending}
            onRefresh={refetch}
            tintColor="white"
          />
        }
      />
    </View>
  );
}

// Define the type for grouped entries
type GroupedEntry = {
  layoutName: string;
  layoutIndex: number;
  entries: ShopItem[];
};

/**
 * Groups shop entries by layout name and sorts them by layout index
 */
function groupAndSortEntries(entries: ShopItem[]): GroupedEntry[] {
  const groupedEntries = entries.reduce((acc: GroupedEntry[], entry) => {
    const layoutName = entry.layout?.name || 'Unknown';
    const layoutIndex = entry.layout?.index || 999;

    const existingGroup = acc.find((group) => group.layoutName === layoutName);

    if (existingGroup) {
      existingGroup.entries.push(entry);
    } else {
      acc.push({
        layoutName,
        layoutIndex,
        entries: [entry],
      });
    }

    return acc;
  }, []);

  // Sort by layout index
  return groupedEntries.sort((a, b) => a.layoutIndex - b.layoutIndex);
}

/**
 * A section of shop items with a title
 */
function ShopSection({
  title,
  entries,
  onItemPress,
}: {
  title: string;
  entries: ShopItem[];
  onItemPress: (entry: ShopItem) => void;
}) {
  return (
    <View className="px-4 pb-6 pt-4">
      <Text className="mb-4 text-xl font-bold text-white">{title}</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.offerId}
        renderItem={({ item }) => (
          <ShopItemComponent item={item} onPress={() => onItemPress(item)} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="w-4" />}
      />
    </View>
  );
}
