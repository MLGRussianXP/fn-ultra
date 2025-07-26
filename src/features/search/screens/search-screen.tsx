import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { type BrItem } from '@/api/fortnite/types';

import { BrItemCard } from '../components/br-item-card';
import { FieldAdditional, FieldPrimary } from '../components/render-fields';
import { type PrimaryState, useSearchScreen } from '../hooks/use-search-screen';
import { ALL_SEARCH_PARAMS } from '../utils/search-params';

interface ResultsGridProps {
  displayedResults: BrItem[];
  onViewMore: () => void;
  canViewMore: boolean;
}

function ResultsGrid({
  displayedResults,
  onViewMore,
  canViewMore,
}: ResultsGridProps) {
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
          className="mb-12 mt-6 self-center rounded-full bg-blue-500 px-6 py-3 shadow-sm"
        >
          <Text className="font-medium text-white">View More</Text>
        </Pressable>
      )}
    </>
  );
}

interface PrimaryFiltersProps {
  primary: PrimaryState;
  setPrimary: React.Dispatch<React.SetStateAction<PrimaryState>>;
  handleSearch: () => void;
}

function PrimaryFilters({
  primary,
  setPrimary,
  handleSearch,
}: PrimaryFiltersProps) {
  return (
    <View className="mb-6 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <Text className="mb-3 text-base font-medium text-gray-700 dark:text-gray-300">
        Primary Filters
      </Text>
      <View>
        {ALL_SEARCH_PARAMS.filter((p) => p.primary).map((param) => (
          <FieldPrimary
            key={param.key}
            param={param}
            value={primary}
            setValue={setPrimary}
            handleSearch={handleSearch}
          />
        ))}
      </View>
    </View>
  );
}

interface AdditionalFiltersProps {
  additional: Record<string, string>;
  setAdditional: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleSearch: () => void;
}

function AdditionalFilters({
  additional,
  setAdditional,
  handleSearch,
}: AdditionalFiltersProps) {
  return (
    <View className="mb-6 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <Text className="mb-3 text-base font-medium text-gray-700 dark:text-gray-300">
        Additional Filters
      </Text>
      <View>
        {ALL_SEARCH_PARAMS.filter((p) => !p.primary).map((param) => (
          <FieldAdditional
            key={param.key}
            param={param}
            value={additional}
            setValue={setAdditional}
            handleSearch={handleSearch}
          />
        ))}
      </View>
    </View>
  );
}

interface SearchFormProps {
  primary: PrimaryState;
  setPrimary: React.Dispatch<React.SetStateAction<PrimaryState>>;
  additional: Record<string, string>;
  setAdditional: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  showAdditional: boolean;
  setShowAdditional: React.Dispatch<React.SetStateAction<boolean>>;
  handleSearch: () => void;
}

function SearchForm({
  primary,
  setPrimary,
  additional,
  setAdditional,
  showAdditional,
  setShowAdditional,
  handleSearch,
}: SearchFormProps) {
  return (
    <>
      <Text className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
        Search BR Cosmetics
      </Text>

      <PrimaryFilters
        primary={primary}
        setPrimary={setPrimary}
        handleSearch={handleSearch}
      />

      <Pressable
        onPress={() => setShowAdditional(!showAdditional)}
        className="mb-4 flex-row items-center"
      >
        <View className="mr-2 size-5 items-center justify-center rounded-full bg-blue-500">
          <Text className="text-xs font-bold text-white">
            {showAdditional ? '-' : '+'}
          </Text>
        </View>
        <Text className="text-blue-500">
          {showAdditional
            ? 'Hide Additional Filters'
            : 'Show Additional Filters'}
        </Text>
      </Pressable>

      {showAdditional && (
        <AdditionalFilters
          additional={additional}
          setAdditional={setAdditional}
          handleSearch={handleSearch}
        />
      )}

      <Pressable
        onPress={handleSearch}
        className="mb-8 self-start rounded-full bg-blue-600 px-6 py-3 shadow-sm"
      >
        <Text className="font-medium text-white">Search</Text>
      </Pressable>
    </>
  );
}

interface SearchResultsProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | unknown;
  displayedResults: BrItem[];
  displayCount: number;
  handleViewMore: () => void;
}

function SearchResults({
  isLoading,
  isError,
  error,
  displayedResults,
  displayCount,
  handleViewMore,
}: SearchResultsProps) {
  return (
    <>
      {isLoading && (
        <View className="my-8 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-2 text-gray-600 dark:text-gray-400">
            Loading results...
          </Text>
        </View>
      )}

      {isError && (
        <View className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <Text className="text-red-600 dark:text-red-400">
            {error instanceof Error ? error.message : String(error)}
          </Text>
        </View>
      )}

      {!isLoading && displayedResults.length === 0 && !isError && (
        <View className="my-8 items-center justify-center">
          <Text className="text-gray-500 dark:text-gray-400">
            No results found.
          </Text>
          <Text className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Try adjusting your search filters.
          </Text>
        </View>
      )}

      {displayedResults.length > 0 && (
        <View className="mb-4">
          <Text className="mb-4 text-base font-medium text-gray-700 dark:text-gray-300">
            Search Results ({displayedResults.length})
          </Text>
          <ResultsGrid
            displayedResults={displayedResults.slice(0, displayCount)}
            onViewMore={handleViewMore}
            canViewMore={displayCount < displayedResults.length}
          />
        </View>
      )}
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
  } = useSearchScreen(ALL_SEARCH_PARAMS);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
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
