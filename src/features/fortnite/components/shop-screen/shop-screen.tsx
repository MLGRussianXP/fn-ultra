import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import * as React from 'react';
import { Pressable, RefreshControl } from 'react-native';

import { useShop } from '@/api/fortnite';
import type { ShopItem } from '@/api/fortnite/types';
import { EmptyList, FocusAwareStatusBar, Text, View } from '@/components/ui';

import { ShopItem as ShopItemComponent } from '../shop-item';

// Custom hook for shop state management
function useShopState() {
  const { data, isPending, isError, error, refetch } = useShop();

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
    <View className="flex-1 items-center justify-center p-base">
      <FocusAwareStatusBar />
      <Text variant="heading" className="mb-sm text-center">
        Error Loading Shop
      </Text>
      <Text
        variant="bodySmall"
        className="mb-md text-center text-neutral-600 dark:text-neutral-300"
      >
        {error instanceof Error
          ? error.message
          : 'Failed to load Fortnite shop data'}
      </Text>
      <Pressable
        className="rounded bg-primary-600 px-md py-sm"
        onPress={onRetry}
      >
        <Text variant="fortnite" className="text-white">
          Try Again
        </Text>
      </Pressable>
    </View>
  );
}

// Group entries by layout index, sort each group by sortPriority, and sort groups by layout index
function groupAndSortEntries(entries: ShopItem[]) {
  const groupsMap = new Map<
    number,
    { layoutName: string; layoutIndex: number; entries: ShopItem[] }
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
  onItemPress,
}: {
  entries: ShopItem[];
  onItemPress: (entry: ShopItem) => void;
}) {
  return (
    <View className="w-full px-base">
      <View className="flex-row flex-wrap gap-sm">
        {entries.map((entry) => {
          const isFullScreen =
            entry.tileSize === 'Size_2_x_1' || entry.tileSize === 'double';
          const hasBrItems = entry.brItems && entry.brItems.length > 0;

          return (
            <View
              key={entry.offerId}
              className={`mb-md grow ${isFullScreen ? 'w-full' : 'w-[48%]'}`}
            >
              <ShopItemComponent
                item={entry}
                onPress={hasBrItems ? () => onItemPress(entry) : undefined}
                disabled={!hasBrItems}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

// Foldable category component with its own state
function CategorySection({
  group,
  onItemPress,
}: {
  group: {
    layoutName: string;
    layoutIndex: number;
    entries: ShopItem[];
  };
  onItemPress: (entry: ShopItem) => void;
}) {
  const [isExpanded, setIsExpanded] = React.useState(true); // Start expanded by default

  const toggleExpanded = React.useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <View className="mb-xl w-full">
      {/* Collapsible Header */}
      <Pressable
        className="mx-base mb-md flex-row items-center justify-between rounded-lg bg-white p-base shadow-sm dark:bg-neutral-800"
        onPress={toggleExpanded}
        android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
      >
        <View className="flex-1 flex-row items-center">
          <View className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
          <Text
            variant="fortnite"
            className="mx-sm text-fortnite-blue dark:text-fortnite-blue"
          >
            {group.layoutName} ({group.entries.length})
          </Text>
          <View className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
        </View>
        <Text className="ml-sm text-lg text-neutral-500 dark:text-neutral-400">
          {isExpanded ? '−' : '+'}
        </Text>
      </Pressable>

      {/* Content - always render but hide when collapsed */}
      <View
        style={{
          opacity: isExpanded ? 1 : 0,
          maxHeight: isExpanded ? undefined : 0,
          overflow: isExpanded ? 'visible' : 'hidden',
        }}
      >
        <GridItems entries={group.entries} onItemPress={onItemPress} />
      </View>
    </View>
  );
}

// Loading state component
function LoadingState() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <Text variant="fortnite" className="text-fortnite-orange">
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
      <Text variant="heading" className="mb-md text-center">
        No shop data available
      </Text>
      <Text
        variant="bodySmall"
        className="mb-md text-center text-neutral-600 dark:text-neutral-300"
      >
        The Fortnite shop might be temporarily unavailable
      </Text>
      <Pressable
        className="rounded bg-primary-600 px-md py-sm"
        onPress={onRetry}
      >
        <Text variant="fortnite" className="text-white">
          Try Again
        </Text>
      </Pressable>
    </View>
  );
}

export function ShopScreen() {
  const { data, isPending, isError, error, refetch, grouped } = useShopState();

  const handleItemPress = React.useCallback((entry: ShopItem) => {
    // Only navigate if the entry has BR items
    if (entry.brItems && entry.brItems.length > 0) {
      router.push({
        pathname: '/item/[id]',
        params: {
          id: entry.brItems[0].id,
          entry: JSON.stringify(entry),
        },
      });
    }
  }, []);

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
          <CategorySection group={group} onItemPress={handleItemPress} />
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
