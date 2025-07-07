import { useLocalSearchParams, useNavigation } from 'expo-router';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { useFortniteBrItem } from '@/api/fortnite';
import type { FortniteShopItem } from '@/api/fortnite/types';
import {
  ItemDetailsContent,
  ItemSelector,
} from '@/components/features/fortnite/item-details-content';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';

function useEntryData(entryData?: string): FortniteShopItem | null {
  return React.useMemo(() => {
    if (entryData) {
      try {
        return JSON.parse(entryData) as FortniteShopItem;
      } catch (error) {
        console.error('Failed to parse entry data:', error);
        return null;
      }
    }
    return null;
  }, [entryData]);
}

function useInitialItemId(entry: FortniteShopItem | null): string | undefined {
  return React.useMemo(() => {
    if (!entry) return undefined;
    if (entry.brItems && entry.brItems.length > 0) return entry.brItems[0].id;
    if (entry.tracks && entry.tracks.length > 0) return entry.tracks[0].id;
    if (entry.instruments && entry.instruments.length > 0)
      return entry.instruments[0].id;
    if (entry.cars && entry.cars.length > 0) return entry.cars[0].id;
    if (entry.legoKits && entry.legoKits.length > 0)
      return entry.legoKits[0].id;
    return undefined;
  }, [entry]);
}

function useSelectedItemState(
  initialId: string | undefined,
  firstItemId: string | undefined
) {
  const [selectedItemId, setSelectedItemId] = React.useState<
    string | undefined
  >(initialId || firstItemId);

  React.useEffect(() => {
    setSelectedItemId(initialId || firstItemId);
  }, [initialId, firstItemId]);

  return { selectedItemId, setSelectedItemId };
}

function LoadingState() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <Text className="text-lg text-gray-900 dark:text-white">
        Loading item details...
      </Text>
    </View>
  );
}

function ErrorState({ error }: { error: unknown }) {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <Text className="mb-2 text-center text-lg font-semibold text-gray-900 dark:text-white">
        Error Loading Item
      </Text>
      <Text className="mb-4 text-center text-sm text-gray-600 dark:text-gray-300">
        {error instanceof Error ? error.message : 'Failed to load item details'}
      </Text>
    </View>
  );
}

function ItemDetailsScreenContent({
  item,
  isMultiItemMode,
  entry,
  selectedItemId,
  setSelectedItemId,
}: {
  item: any;
  isMultiItemMode: boolean;
  entry: FortniteShopItem | null;
  selectedItemId: string;
  setSelectedItemId: (id: string) => void;
}) {
  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: isMultiItemMode ? 0 : 20 }}
        showsVerticalScrollIndicator={false}
      >
        <ItemDetailsContent item={item} />
      </ScrollView>

      {isMultiItemMode && entry && (
        <ItemSelector
          entry={entry}
          selectedItemId={selectedItemId}
          onItemSelect={setSelectedItemId}
        />
      )}
    </View>
  );
}

export default function ItemDetailsScreen() {
  const {
    entryData,
    isMultiItem,
    id: initialId,
  } = useLocalSearchParams<{
    id?: string;
    entryData?: string;
    isMultiItem?: string;
  }>();
  const navigation = useNavigation();
  const entry = useEntryData(entryData);
  const isMultiItemMode = isMultiItem === 'true' && !!entry;
  const firstItemId = useInitialItemId(entry);
  const { selectedItemId, setSelectedItemId } = useSelectedItemState(
    initialId,
    firstItemId
  );

  const { data, isPending, isError, error } = useFortniteBrItem(
    selectedItemId!
  );

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

  if (!selectedItemId) {
    return <ErrorState error={new Error('No item id found in entry.')} />;
  }

  if (isPending) {
    return <LoadingState />;
  }

  if (isError || !data?.data) {
    return <ErrorState error={error} />;
  }

  return (
    <ItemDetailsScreenContent
      item={data.data}
      isMultiItemMode={isMultiItemMode}
      entry={entry}
      selectedItemId={selectedItemId!}
      setSelectedItemId={setSelectedItemId}
    />
  );
}
