import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { useBrItem } from '@/api/fortnite';
import type { ShopItem } from '@/api/fortnite/types';
import { FocusAwareStatusBar, Text } from '@/components/ui';
import { getShopItemData } from '@/features/fortnite/utils/shop-item-data';
import { ItemWatchToggle } from '@/features/notifications/components/item-watch-toggle/item-watch-toggle';

import {
  ItemAdditionalInfo,
  ItemHero,
  ItemInfo,
  ItemSelector,
  ItemVariants,
} from '../components/item-details-content';

// eslint-disable-next-line max-lines-per-function
export function ItemDetailsScreen() {
  const params = useLocalSearchParams<{ id: string; entry: string }>();
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(
    params.id
  );
  const [entry, setEntry] = useState<ShopItem | null>(null);

  // Parse entry from params
  useEffect(() => {
    if (params.entry) {
      try {
        const parsedEntry = JSON.parse(params.entry);
        setEntry(parsedEntry);
      } catch (error) {
        console.error('Failed to parse entry:', error);
      }
    }
  }, [params.entry]);

  // Fetch BR item data
  const {
    data: brItemData,
    isLoading,
    isError,
    error,
  } = useBrItem(selectedItemId);

  // Handle item selection
  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-950">
        <FocusAwareStatusBar />
        <Text className="text-lg text-white">Loading item details...</Text>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-950">
        <FocusAwareStatusBar />
        <Text className="mb-2 text-center text-lg font-semibold text-white">
          Error Loading Item
        </Text>
        <Text className="text-center text-sm text-gray-300">
          {error instanceof Error ? error.message : 'Failed to load item data'}
        </Text>
      </View>
    );
  }

  // No data state
  if (!brItemData?.data) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-950">
        <FocusAwareStatusBar />
        <Text className="text-lg text-white">Item not found</Text>
      </View>
    );
  }

  // Get item data for UI
  const { seriesImage, gradientColors } = entry
    ? getShopItemData(entry)
    : { seriesImage: undefined, gradientColors: undefined };

  return (
    <View className="flex-1 bg-neutral-950">
      <FocusAwareStatusBar />
      <ScrollView>
        {/* Item selector (if bundle) */}
        {entry && (
          <ItemSelector
            entry={entry}
            selectedItemId={selectedItemId}
            onSelectItem={handleSelectItem}
          />
        )}

        {/* Hero section with image */}
        <ItemHero
          brItemData={brItemData.data}
          seriesImage={seriesImage}
          gradientColors={gradientColors}
        />

        {/* Item info */}
        <ItemInfo brItemData={brItemData.data} />

        {/* Watch toggle */}
        <ItemWatchToggle brItemData={brItemData.data} />

        {/* Variants (if any) */}
        {brItemData.data.variants && brItemData.data.variants.length > 0 && (
          <ItemVariants variants={brItemData.data.variants} />
        )}

        {/* Additional info */}
        <ItemAdditionalInfo brItemData={brItemData.data} />
      </ScrollView>
    </View>
  );
}
