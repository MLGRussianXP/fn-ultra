import { FlashList } from '@shopify/flash-list';
import * as React from 'react';
import { Pressable, RefreshControl } from 'react-native';

import { useFortniteShop } from '@/api/fortnite';
import type { FortniteShopItem } from '@/api/fortnite/types';
import { Card } from '@/components/card';
import { EmptyList, FocusAwareStatusBar, Text, View } from '@/components/ui';

// Custom hook for shop state management
function useShopState() {
  const { data, isPending, isError, error, refetch } = useFortniteShop();

  const grouped = React.useMemo(() => {
    const entries = data?.data?.entries || [];

    if (entries.length === 0) {
      return [];
    }

    return groupAndSortEntries(entries);
  }, [data]);

  return {
    data,
    isPending,
    isError,
    error,
    refetch,
    grouped,
  };
}

function ShopError({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <FocusAwareStatusBar />
      <Text className="mb-2 text-center text-lg font-semibold text-gray-900 dark:text-white">
        Error Loading Shop
      </Text>
      <Text className="mb-4 text-center text-sm text-gray-600 dark:text-gray-300">
        {error instanceof Error
          ? error.message
          : 'Failed to load Fortnite shop data'}
      </Text>
      <Text
        onPress={onRetry}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Try Again
      </Text>
    </View>
  );
}

// Group entries by layout index, sort each group by sortPriority, and sort groups by layout index
function groupAndSortEntries(entries: FortniteShopItem[]) {
  const groupsMap = new Map<
    number,
    { layoutName: string; layoutIndex: number; entries: FortniteShopItem[] }
  >();
  for (const entry of entries) {
    const idx = entry.layout.index;
    if (!groupsMap.has(idx)) {
      groupsMap.set(idx, {
        layoutName: entry.layout.name,
        layoutIndex: idx,
        entries: [],
      });
    }
    groupsMap.get(idx)!.entries.push(entry);
  }
  // Sort each group by sortPriority
  const groups = Array.from(groupsMap.values());
  for (const group of groups) {
    group.entries.sort((a, b) => {
      if (a.layoutId > b.layoutId) return -1;
      if (a.layoutId < b.layoutId) return 1;
      return b.sortPriority - a.sortPriority;
    });
  }
  // Sort groups by layout index
  groups.sort((a, b) => a.layoutIndex - b.layoutIndex);
  return groups;
}

// Render grid items for a group
function GridItems({
  entries,
  vbuckIcon,
}: {
  entries: FortniteShopItem[];
  vbuckIcon: string;
}) {
  return (
    <View className="w-full px-4">
      <View className="flex-row flex-wrap justify-center gap-3">
        {entries.map((entry) => (
          <Card
            key={entry.offerId}
            entry={entry}
            isWide={entry.layout.useWidePreview}
            vbuckIcon={vbuckIcon}
          />
        ))}
      </View>
    </View>
  );
}

// Foldable category component with its own state
function CategorySection({
  group,
  vbuckIcon,
}: {
  group: {
    layoutName: string;
    layoutIndex: number;
    entries: FortniteShopItem[];
  };
  vbuckIcon: string;
}) {
  const [isExpanded, setIsExpanded] = React.useState(true); // Start expanded by default

  const toggleExpanded = React.useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <View className="mb-6 w-full">
      {/* Collapsible Header */}
      <Pressable
        className="mx-4 mb-4 flex-row items-center justify-between rounded-lg bg-white p-4 shadow-sm dark:bg-neutral-800"
        onPress={toggleExpanded}
        android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
      >
        <View className="flex-1 flex-row items-center">
          <View className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
          <Text className="mx-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            {group.layoutName} ({group.entries.length} items)
          </Text>
          <View className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
        </View>
        <Text className="ml-2 text-lg text-neutral-500 dark:text-neutral-400">
          {isExpanded ? '−' : '+'}
        </Text>
      </Pressable>

      {/* Content - always render but hide when collapsed */}
      <View
        style={{
          opacity: isExpanded ? 1 : 0,
          maxHeight: isExpanded ? 1000 : 0,
          overflow: 'hidden',
        }}
      >
        <GridItems entries={group.entries} vbuckIcon={vbuckIcon} />
      </View>
    </View>
  );
}

// Loading state component
function LoadingState() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <Text className="text-lg text-gray-900 dark:text-white">
        Loading Fortnite Shop...
      </Text>
    </View>
  );
}

// No data state component
function NoDataState({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <Text className="mb-4 text-center text-lg text-gray-900 dark:text-white">
        No shop data available
      </Text>
      <Text className="mb-4 text-center text-sm text-gray-600 dark:text-gray-300">
        The Fortnite shop might be temporarily unavailable
      </Text>
      <Text
        onPress={onRetry}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Try Again
      </Text>
    </View>
  );
}

export function ShopScreen() {
  const { data, isPending, isError, error, refetch, grouped } = useShopState();

  if (isError) {
    return <ShopError error={error} onRetry={refetch} />;
  }

  if (isPending) {
    return <LoadingState />;
  }

  if (!data?.data?.entries || data.data.entries.length === 0) {
    return <NoDataState onRetry={refetch} />;
  }

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <FlashList
        data={grouped}
        renderItem={({ item: group }) => (
          <CategorySection
            group={group}
            vbuckIcon={data?.data?.vbuckIcon || ''}
          />
        )}
        keyExtractor={(group) => `layout-${group.layoutIndex}`}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
        estimatedItemSize={300}
        refreshControl={
          <RefreshControl refreshing={isPending} onRefresh={refetch} />
        }
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
