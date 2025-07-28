import { useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { useBrItem } from '@/api/fortnite';
import type { ShopItem } from '@/api/fortnite/types';
import { FocusAwareStatusBar, Text } from '@/components/ui';
import { getShopItemData } from '@/features/fortnite/utils/shop-item-data';
import { ItemWatchButton } from '@/features/notifications/components';
import { translate } from '@/lib/i18n';

import {
  ItemAdditionalInfo,
  ItemHero,
  ItemInfo,
  ItemSelector,
  ItemVariants,
} from '../components/item-details-content';

// eslint-disable-next-line max-lines-per-function
export function ItemDetailsScreen() {
  const { colorScheme } = useColorScheme();
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

  // Background color based on theme
  const bgColor = colorScheme === 'dark' ? 'bg-neutral-950' : 'bg-neutral-50';

  // Loading state
  if (isLoading) {
    return (
      <View className={`flex-1 items-center justify-center ${bgColor}`}>
        <FocusAwareStatusBar />
        <Text className="text-lg text-neutral-800 dark:text-white">
          {translate('item_details.loading')}
        </Text>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View className={`flex-1 items-center justify-center ${bgColor}`}>
        <FocusAwareStatusBar />
        <Text className="mb-2 text-center text-lg font-semibold text-neutral-800 dark:text-white">
          {translate('item_details.error_title')}
        </Text>
        <Text className="text-center text-sm text-neutral-600 dark:text-gray-300">
          {error instanceof Error
            ? error.message
            : translate('item_details.error_message')}
        </Text>
      </View>
    );
  }

  // No data state
  if (!brItemData?.data) {
    return (
      <View className={`flex-1 items-center justify-center ${bgColor}`}>
        <FocusAwareStatusBar />
        <Text className="text-lg text-neutral-800 dark:text-white">
          {translate('item_details.item_not_found')}
        </Text>
      </View>
    );
  }

  // Get item data for UI
  const { seriesImage, gradientColors } = entry
    ? getShopItemData(entry)
    : { seriesImage: undefined, gradientColors: undefined };

  return (
    <View className={`flex-1 ${bgColor}`}>
      <FocusAwareStatusBar />

      {/* Floating notification button */}
      <ItemWatchButton brItemData={brItemData.data} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero section with image */}
        <ItemHero
          brItemData={brItemData.data}
          seriesImage={seriesImage}
          gradientColors={gradientColors}
        />

        {/* Item selector (if bundle) */}
        {entry && (
          <ItemSelector
            entry={entry}
            selectedItemId={selectedItemId}
            onSelectItem={handleSelectItem}
          />
        )}

        {/* Item info */}
        <ItemInfo brItemData={brItemData.data} />

        {/* Variants (if any) */}
        {brItemData.data.variants && brItemData.data.variants.length > 0 && (
          <ItemVariants variants={brItemData.data.variants} />
        )}

        {/* Additional info */}
        <ItemAdditionalInfo brItemData={brItemData.data} />

        {/* Bottom padding */}
        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
