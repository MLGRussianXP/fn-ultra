import { translate } from '@/lib/i18n';

/**
 * Search parameters configuration for BR Cosmetics Search
 */

export interface SearchParam {
  key: string;
  label: string;
  type: string;
  primary: boolean;
  options?: string[];
}

export const ALL_SEARCH_PARAMS: SearchParam[] = [
  {
    key: 'type',
    label: translate('search.fields.type'),
    type: 'string',
    primary: true,
  },
  {
    key: 'rarity',
    label: translate('search.fields.rarity'),
    type: 'string',
    primary: true,
  },
  {
    key: 'series',
    label: translate('search.fields.series'),
    type: 'string',
    primary: true,
  },
  {
    key: 'set',
    label: translate('search.fields.set'),
    type: 'string',
    primary: true,
  },
  {
    key: 'hasVariants',
    label: translate('search.fields.hasVariants'),
    type: 'boolean',
    primary: true,
  },
  {
    key: 'matchMethod',
    label: translate('search.fields.matchMethod'),
    type: 'select',
    options: ['full', 'contains', 'starts', 'ends'],
    primary: true,
  },
  {
    key: 'id',
    label: translate('search.fields.id'),
    type: 'string',
    primary: false,
  },
  {
    key: 'language',
    label: translate('search.fields.language'),
    type: 'string',
    primary: false,
  },
  {
    key: 'searchLanguage',
    label: translate('search.fields.searchLanguage'),
    type: 'string',
    primary: false,
  },
  {
    key: 'hasFeaturedImage',
    label: translate('search.fields.hasFeaturedImage'),
    type: 'boolean',
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

export const PRIMARY_SEARCH_PARAMS = ALL_SEARCH_PARAMS.filter(
  (param) => param.primary
);
export const ADDITIONAL_SEARCH_PARAMS = ALL_SEARCH_PARAMS.filter(
  (param) => !param.primary
);
