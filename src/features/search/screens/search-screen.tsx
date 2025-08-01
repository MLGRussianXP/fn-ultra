import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';

import { type BrItem } from '@/api/fortnite/types';
import { Button, FocusAwareStatusBar, Input, Text } from '@/components/ui';
import { CaretDown, Search } from '@/components/ui/icons';
import { translate } from '@/lib/i18n';

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
      <View className="flex-row flex-wrap justify-between px-base">
        {displayedResults.map((item, i) => (
          <BrItemCard key={item.id + i} item={item} />
        ))}
      </View>
      {canViewMore && (
        <Button
          onPress={onViewMore}
          label={translate('search.view_more')}
          className="mb-12 mt-6 self-center bg-[#8b5cf6] px-6 py-3"
          fullWidth={false}
        />
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
    <View className="mb-6 rounded-xl bg-white p-base shadow-sm dark:bg-neutral-800">
      <Text
        variant="fortnite"
        className="mb-3 text-[#8b5cf6] dark:text-[#8b5cf6]"
      >
        {translate('search.primary_filters')}
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
    <View className="mb-6 rounded-xl bg-white p-base shadow-sm dark:bg-neutral-800">
      <Text
        variant="fortnite"
        className="mb-3 text-[#8b5cf6] dark:text-[#8b5cf6]"
      >
        {translate('search.advanced_filters')}
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

// Component for the search name input field
function SearchNameField({
  name,
  setPrimary,
  handleSearch,
}: {
  name: string;
  setPrimary: React.Dispatch<React.SetStateAction<PrimaryState>>;
  handleSearch: () => void;
}) {
  return (
    <View className="mb-6 rounded-xl bg-white p-base shadow-sm dark:bg-neutral-800">
      <Text
        variant="fortnite"
        className="mb-3 text-[#8b5cf6] dark:text-[#8b5cf6]"
      >
        {translate('search.fields.name')}
      </Text>
      <Input
        value={name}
        onChangeText={(text) => setPrimary((prev) => ({ ...prev, name: text }))}
        placeholder={translate('search.name_placeholder')}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
    </View>
  );
}

// Component for the advanced filters toggle
function AdvancedFiltersToggle({
  showAdditional,
  setShowAdditional,
}: {
  showAdditional: boolean;
  setShowAdditional: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Pressable
      onPress={() => setShowAdditional(!showAdditional)}
      className="mb-4 flex-row items-center"
    >
      <View className="mr-2 size-5 items-center justify-center rounded-full bg-[#8b5cf6]">
        <Text className="text-xs font-bold text-white">
          {showAdditional ? '-' : '+'}
        </Text>
      </View>
      <Text variant="fortnite" className="text-[#8b5cf6]">
        {showAdditional
          ? translate('search.hide_advanced')
          : translate('search.show_advanced')}
      </Text>
      <CaretDown className={`ml-2 ${showAdditional ? 'rotate-180' : ''}`} />
    </Pressable>
  );
}

// Component for the search button
function SearchButton({ handleSearch }: { handleSearch: () => void }) {
  return (
    <Button onPress={handleSearch} className="mb-8 self-start bg-[#8b5cf6]">
      <View className="flex-row items-center">
        <Search color="white" />
        <Text className="ml-2 text-white">
          {translate('search.search_button')}
        </Text>
      </View>
    </Button>
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
}: SearchFormProps) {
  return (
    <>
      <View className="mb-6 px-base">
        <Text
          variant="heading"
          className="mb-4 text-neutral-800 dark:text-white"
        >
          {translate('search.title')}
        </Text>

        <SearchNameField
          name={primary.name}
          setPrimary={setPrimary}
          handleSearch={handleSearch}
        />

        <PrimaryFilters
          primary={primary}
          setPrimary={setPrimary}
          handleSearch={handleSearch}
        />

        <AdvancedFiltersToggle
          showAdditional={showAdditional}
          setShowAdditional={setShowAdditional}
        />

        {showAdditional && (
          <AdditionalFilters
            additional={additional}
            setAdditional={setAdditional}
            handleSearch={handleSearch}
          />
        )}

        <SearchButton handleSearch={handleSearch} />
      </View>
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
          <Text className="mt-2 text-neutral-600 dark:text-neutral-400">
            {translate('search.loading')}
          </Text>
        </View>
      )}

      {isError && (
        <View className="mx-base mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <Text className="text-red-600 dark:text-red-400">
            {error instanceof Error ? error.message : String(error)}
          </Text>
        </View>
      )}

      {!isLoading && displayedResults.length === 0 && !isError && (
        <View className="my-8 items-center justify-center">
          <Text
            variant="bodyLarge"
            className="text-neutral-500 dark:text-neutral-400"
          >
            {translate('search.no_results')}
          </Text>
          <Text
            variant="bodySmall"
            className="mt-1 text-neutral-400 dark:text-neutral-500"
          >
            {translate('search.adjust_filters')}
          </Text>
        </View>
      )}

      {displayedResults.length > 0 && (
        <View className="mb-4">
          <View className="mx-base mb-4 flex-row items-center">
            <View className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
            <Text
              variant="fortnite"
              className="mx-sm text-[#8b5cf6] dark:text-[#8b5cf6]"
            >
              {translate('search.results_count', {
                count: displayedResults.length,
              })}
            </Text>
            <View className="h-px flex-1 bg-neutral-300 dark:bg-neutral-700" />
          </View>
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

// Loading state component
function LoadingState() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <Text variant="fortnite" className="text-[#8b5cf6]">
        {translate('search.loading')}
      </Text>
    </View>
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

  if (isLoading && !displayedResults.length) {
    return <LoadingState />;
  }

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <FocusAwareStatusBar />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingVertical: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && !!displayedResults.length}
            onRefresh={handleSearch}
          />
        }
        showsVerticalScrollIndicator={false}
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
