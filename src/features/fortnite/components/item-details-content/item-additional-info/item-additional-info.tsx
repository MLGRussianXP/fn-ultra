import React from 'react';
import { Linking, Pressable, View } from 'react-native';

import type { DetailedBrItem } from '@/api/fortnite/types';
import { Text } from '@/components/ui';
import { translate } from '@/lib/i18n';

// Format date string to be more readable
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Section component for consistent styling
type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const Section = ({ title, children }: SectionProps) => (
  <View className="mb-5">
    <Text className="mb-2 text-xl font-semibold text-fortnite-accent">
      {title}
    </Text>
    {children}
  </View>
);

// Tag list component for reuse
type TagListProps = {
  tags: string[];
  cleanupFn?: (tag: string) => string;
};

const TagList = ({ tags, cleanupFn }: TagListProps) => (
  <View className="flex-row flex-wrap">
    {tags.map((tag) => {
      const displayTag = cleanupFn ? cleanupFn(tag) : tag;
      return (
        <View
          key={tag}
          className="mb-2 mr-2 rounded-full bg-neutral-200 px-3 py-1 dark:bg-neutral-800"
        >
          <Text className="text-sm text-neutral-700 dark:text-gray-300">
            {displayTag}
          </Text>
        </View>
      );
    })}
  </View>
);

// Basic info section
const BasicInfo = ({ brItemData }: { brItemData: DetailedBrItem }) => (
  <>
    {brItemData.description && (
      <Section title={translate('item_details.description')}>
        <Text className="text-base text-neutral-700 dark:text-gray-300">
          {brItemData.description}
        </Text>
      </Section>
    )}

    {brItemData.exclusiveDescription && (
      <Section title={translate('item_details.exclusive_description')}>
        <Text className="text-base text-neutral-700 dark:text-gray-300">
          {brItemData.exclusiveDescription}
        </Text>
      </Section>
    )}

    {brItemData.unlockRequirements && (
      <Section title={translate('item_details.unlock_requirements')}>
        <Text className="text-base text-neutral-700 dark:text-gray-300">
          {brItemData.unlockRequirements}
        </Text>
      </Section>
    )}

    {brItemData.customExclusiveCallout && (
      <Section title={translate('item_details.exclusive_callout')}>
        <Text className="text-base text-neutral-700 dark:text-gray-300">
          {brItemData.customExclusiveCallout}
        </Text>
      </Section>
    )}
  </>
);

// Set and introduction section
const SetAndIntro = ({ brItemData }: { brItemData: DetailedBrItem }) => (
  <>
    {brItemData.set && (
      <Section title={translate('item_details.set')}>
        <Text className="text-base text-neutral-700 dark:text-gray-300">
          {brItemData.set.value}
        </Text>
        {brItemData.set.text && (
          <Text className="mt-1 text-sm text-neutral-600 dark:text-gray-400">
            {brItemData.set.text}
          </Text>
        )}
      </Section>
    )}

    {brItemData.introduction && (
      <Section title={translate('item_details.introduction')}>
        <Text className="text-base text-neutral-700 dark:text-gray-300">
          {brItemData.introduction.text}
        </Text>
        <Text className="mt-1 text-sm text-neutral-600 dark:text-gray-400">
          Chapter {brItemData.introduction.chapter}, Season{' '}
          {brItemData.introduction.season}
        </Text>
      </Section>
    )}
  </>
);

// Media and dates section
const MediaAndDates = ({ brItemData }: { brItemData: DetailedBrItem }) => (
  <>
    {brItemData.showcaseVideo && (
      <Section title={translate('item_details.showcase_video')}>
        <Pressable
          onPress={() =>
            Linking.openURL(
              `https://www.youtube.com/watch?v=${brItemData.showcaseVideo}`
            )
          }
          className="rounded-md bg-fortnite-accent px-4 py-2"
        >
          <Text className="text-center text-white">
            {translate('item_details.watch_video')}
          </Text>
        </Pressable>
      </Section>
    )}

    {brItemData.added && (
      <Section title={translate('item_details.added_to_game')}>
        <Text className="text-base text-neutral-700 dark:text-gray-300">
          {formatDate(brItemData.added)}
        </Text>
      </Section>
    )}

    {brItemData.shopHistory && brItemData.shopHistory.length > 0 && (
      <Section title={translate('item_details.last_seen')}>
        <Text className="text-base text-neutral-700 dark:text-gray-300">
          {formatDate(
            brItemData.shopHistory[brItemData.shopHistory.length - 1]
          )}
        </Text>
        <Text className="mt-1 text-sm text-neutral-600 dark:text-gray-400">
          {translate('item_details.total_appearances', {
            count: brItemData.shopHistory.length,
          })}
        </Text>
      </Section>
    )}
  </>
);

// Tags section
const TagsSection = ({ brItemData }: { brItemData: DetailedBrItem }) => (
  <>
    {brItemData.searchTags && brItemData.searchTags.length > 0 && (
      <Section title={translate('item_details.search_tags')}>
        <TagList tags={brItemData.searchTags} />
      </Section>
    )}

    {brItemData.gameplayTags && brItemData.gameplayTags.length > 0 && (
      <Section title={translate('item_details.tags')}>
        <TagList
          tags={brItemData.gameplayTags}
          cleanupFn={(tag) =>
            tag
              .replace('Cosmetics.', '')
              .replace('Set.', '')
              .replace(/\./g, ' ')
          }
        />
      </Section>
    )}

    {brItemData.metaTags && brItemData.metaTags.length > 0 && (
      <Section title={translate('item_details.meta_tags')}>
        <TagList tags={brItemData.metaTags} />
      </Section>
    )}

    {brItemData.builtInEmoteIds && brItemData.builtInEmoteIds.length > 0 && (
      <Section title={translate('item_details.built_in_emotes')}>
        <TagList tags={brItemData.builtInEmoteIds} />
      </Section>
    )}
  </>
);

type Props = {
  brItemData: DetailedBrItem;
};

export function ItemAdditionalInfo({ brItemData }: Props) {
  return (
    <View className="border-t border-neutral-200 bg-white px-4 py-5 dark:border-neutral-800 dark:bg-neutral-900">
      <BasicInfo brItemData={brItemData} />
      <SetAndIntro brItemData={brItemData} />
      <MediaAndDates brItemData={brItemData} />
      <TagsSection brItemData={brItemData} />
    </View>
  );
}
