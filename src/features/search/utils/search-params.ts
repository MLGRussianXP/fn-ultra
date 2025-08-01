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
  {
    key: 'description',
    label: translate('search.fields.description'),
    type: 'string',
    primary: false,
  },
  {
    key: 'displayType',
    label: translate('search.fields.displayType'),
    type: 'string',
    primary: false,
  },
  {
    key: 'backendType',
    label: translate('search.fields.backendType'),
    type: 'string',
    primary: false,
  },
  {
    key: 'displayRarity',
    label: translate('search.fields.displayRarity'),
    type: 'string',
    primary: false,
  },
  {
    key: 'backendRarity',
    label: translate('search.fields.backendRarity'),
    type: 'string',
    primary: false,
  },
  {
    key: 'hasSeries',
    label: translate('search.fields.hasSeries'),
    type: 'boolean',
    primary: false,
  },
  {
    key: 'series',
    label: translate('search.fields.series'),
    type: 'string',
    primary: false,
  },
  {
    key: 'backendSeries',
    label: translate('search.fields.backendSeries'),
    type: 'string',
    primary: false,
  },
  {
    key: 'hasSet',
    label: translate('search.fields.hasSet'),
    type: 'boolean',
    primary: false,
  },
  {
    key: 'set',
    label: translate('search.fields.set'),
    type: 'string',
    primary: false,
  },
  {
    key: 'setText',
    label: translate('search.fields.setText'),
    type: 'string',
    primary: false,
  },
  {
    key: 'backendSet',
    label: translate('search.fields.backendSet'),
    type: 'string',
    primary: false,
  },
  {
    key: 'hasIntroduction',
    label: translate('search.fields.hasIntroduction'),
    type: 'boolean',
    primary: false,
  },
  {
    key: 'backendIntroduction',
    label: translate('search.fields.backendIntroduction'),
    type: 'string',
    primary: false,
  },
  {
    key: 'introductionChapter',
    label: translate('search.fields.introductionChapter'),
    type: 'string',
    primary: false,
  },
  {
    key: 'introductionSeason',
    label: translate('search.fields.introductionSeason'),
    type: 'string',
    primary: false,
  },
  {
    key: 'hasGameplayTags',
    label: translate('search.fields.hasGameplayTags'),
    type: 'boolean',
    primary: false,
  },
  {
    key: 'gameplayTag',
    label: translate('search.fields.gameplayTag'),
    type: 'string',
    primary: false,
  },
  {
    key: 'hasMetaTags',
    label: translate('search.fields.hasMetaTags'),
    type: 'boolean',
    primary: false,
  },
  {
    key: 'metaTag',
    label: translate('search.fields.metaTag'),
    type: 'string',
    primary: false,
  },
  {
    key: 'hasDynamicPakId',
    label: translate('search.fields.hasDynamicPakId'),
    type: 'boolean',
    primary: false,
  },
  {
    key: 'dynamicPakId',
    label: translate('search.fields.dynamicPakId'),
    type: 'string',
    primary: false,
  },
  {
    key: 'added',
    label: translate('search.fields.added'),
    type: 'string',
    primary: false,
  },
  {
    key: 'addedSince',
    label: translate('search.fields.addedSince'),
    type: 'string',
    primary: false,
  },
  {
    key: 'unseenFor',
    label: translate('search.fields.unseenFor'),
    type: 'string',
    primary: false,
  },
  {
    key: 'lastAppearance',
    label: translate('search.fields.lastAppearance'),
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
