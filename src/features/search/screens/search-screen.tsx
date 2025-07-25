import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { BrItemCard } from '../components/br-item-card';
import { FieldAdditional, FieldPrimary } from '../components/render-fields';
import { useSearchScreen } from '../hooks/use-search-screen';

const ALL_PARAMS = [
  { key: 'name', label: 'Name', type: 'string', primary: true },
  { key: 'id', label: 'ID', type: 'string', primary: true },
  { key: 'type', label: 'Type', type: 'string', primary: true },
  { key: 'rarity', label: 'Rarity', type: 'string', primary: true },
  { key: 'hasVariants', label: 'Has Variants', type: 'boolean', primary: true },
  {
    key: 'hasFeaturedImage',
    label: 'Has Featured Image',
    type: 'boolean',
    primary: true,
  },
  { key: 'language', label: 'Language', type: 'string', primary: false },
  {
    key: 'searchLanguage',
    label: 'Search Language',
    type: 'string',
    primary: false,
  },
  {
    key: 'matchMethod',
    label: 'Match Method',
    type: 'select',
    options: ['full', 'contains', 'starts', 'ends'],
    primary: false,
  },
  { key: 'description', label: 'Description', type: 'string', primary: false },
  { key: 'displayType', label: 'Display Type', type: 'string', primary: false },
  { key: 'backendType', label: 'Backend Type', type: 'string', primary: false },
  {
    key: 'displayRarity',
    label: 'Display Rarity',
    type: 'string',
    primary: false,
  },
  {
    key: 'backendRarity',
    label: 'Backend Rarity',
    type: 'string',
    primary: false,
  },
  { key: 'hasSeries', label: 'Has Series', type: 'boolean', primary: false },
  { key: 'series', label: 'Series', type: 'string', primary: false },
  {
    key: 'backendSeries',
    label: 'Backend Series',
    type: 'string',
    primary: false,
  },
  { key: 'hasSet', label: 'Has Set', type: 'boolean', primary: false },
  { key: 'set', label: 'Set', type: 'string', primary: false },
  { key: 'setText', label: 'Set Text', type: 'string', primary: false },
  { key: 'backendSet', label: 'Backend Set', type: 'string', primary: false },
  {
    key: 'hasIntroduction',
    label: 'Has Introduction',
    type: 'boolean',
    primary: false,
  },
  {
    key: 'backendIntroduction',
    label: 'Backend Introduction',
    type: 'string',
    primary: false,
  },
  {
    key: 'introductionChapter',
    label: 'Introduction Chapter',
    type: 'string',
    primary: false,
  },
  {
    key: 'introductionSeason',
    label: 'Introduction Season',
    type: 'string',
    primary: false,
  },
  {
    key: 'hasGameplayTags',
    label: 'Has Gameplay Tags',
    type: 'boolean',
    primary: false,
  },
  { key: 'gameplayTag', label: 'Gameplay Tag', type: 'string', primary: false },
  {
    key: 'hasMetaTags',
    label: 'Has Meta Tags',
    type: 'boolean',
    primary: false,
  },
  { key: 'metaTag', label: 'Meta Tag', type: 'string', primary: false },
  {
    key: 'hasDynamicPakId',
    label: 'Has Dynamic Pak Id',
    type: 'boolean',
    primary: false,
  },
  {
    key: 'dynamicPakId',
    label: 'Dynamic Pak Id',
    type: 'string',
    primary: false,
  },
  {
    key: 'added',
    label: 'Added (Unix Timestamp)',
    type: 'string',
    primary: false,
  },
  {
    key: 'addedSince',
    label: 'Added Since (Unix Timestamp)',
    type: 'string',
    primary: false,
  },
  {
    key: 'unseenFor',
    label: 'Unseen For (Seconds)',
    type: 'string',
    primary: false,
  },
  {
    key: 'lastAppearance',
    label: 'Last Appearance',
    type: 'string',
    primary: false,
  },
];

function ResultsGrid({
  displayedResults,
  onViewMore,
  canViewMore,
}: {
  displayedResults: any[];
  onViewMore: () => void;
  canViewMore: boolean;
}) {
  return (
    <>
      <View className="flex-row flex-wrap justify-between">
        {displayedResults.map((item, i) => (
          <BrItemCard key={item.id + i} item={item} />
        ))}
      </View>
      {canViewMore && (
        <Pressable
          onPress={onViewMore}
          className="mb-12 mt-6 self-center rounded bg-gray-700 px-4 py-2"
        >
          <Text className="font-bold text-white">View More</Text>
        </Pressable>
      )}
    </>
  );
}

function SearchForm({
  primary,
  setPrimary,
  additional,
  setAdditional,
  showAdditional,
  setShowAdditional,
  handleSearch,
}: any) {
  return (
    <>
      <Text className="mb-2 text-lg font-bold text-white">
        Search BR Cosmetics
      </Text>
      <View className="mb-4">
        {ALL_PARAMS.filter((p) => p.primary).map((param) => (
          <FieldPrimary
            key={param.key}
            param={param}
            value={primary}
            setValue={setPrimary}
            handleSearch={handleSearch}
          />
        ))}
      </View>
      <Pressable
        onPress={() => setShowAdditional(!showAdditional)}
        className="mb-4"
      >
        <Text className="text-blue-400">
          {showAdditional
            ? 'Hide Additional Filters'
            : 'Show Additional Filters'}
        </Text>
      </Pressable>
      {showAdditional && (
        <View className="mb-4">
          {ALL_PARAMS.filter((p) => !p.primary).map((param) => (
            <FieldAdditional
              key={param.key}
              param={param}
              value={additional}
              setValue={setAdditional}
              handleSearch={handleSearch}
            />
          ))}
        </View>
      )}
      <Pressable
        onPress={handleSearch}
        className="mb-6 self-start rounded bg-blue-600 px-4 py-2"
      >
        <Text className="font-bold text-white">Search</Text>
      </Pressable>
    </>
  );
}

function SearchResults({
  isLoading,
  isError,
  error,
  displayedResults,
  displayCount,
  handleViewMore,
}: any) {
  return (
    <>
      {isLoading && (
        <ActivityIndicator size="large" color="#60a5fa" className="my-8" />
      )}
      {isError && (
        <Text className="mb-4 text-red-400">
          {error instanceof Error ? error.message : String(error)}
        </Text>
      )}
      {!isLoading && displayedResults.length === 0 && !isError && (
        <Text className="text-gray-400">No results found.</Text>
      )}
      <ResultsGrid
        displayedResults={displayedResults.slice(0, displayCount)}
        onViewMore={handleViewMore}
        canViewMore={displayCount < displayedResults.length}
      />
    </>
  );
}

export function SearchScreen() {
  const {
    primary,
    setPrimary,
    additional,
    setAdditional,
    showAdditional,
    setShowAdditional,
    displayedResults,
    displayCount,
    isLoading,
    isError,
    error,
    handleSearch,
    handleViewMore,
  } = useSearchScreen(ALL_PARAMS);

  return (
    <View className="flex-1 bg-neutral-950">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16 }}
      >
        <SearchForm
          primary={primary}
          setPrimary={setPrimary}
          additional={additional}
          setAdditional={setAdditional}
          showAdditional={showAdditional}
          setShowAdditional={setShowAdditional}
          handleSearch={handleSearch}
        />
        <SearchResults
          isLoading={isLoading}
          isError={isError}
          error={error}
          displayedResults={displayedResults}
          displayCount={displayCount}
          handleViewMore={handleViewMore}
        />
      </ScrollView>
    </View>
  );
}
