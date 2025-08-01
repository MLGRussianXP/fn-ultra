/**
 * Fortnite API types
 * @module api/fortnite/types
 */

// Shop API Types
// Based on actual API response from https://fortnite-api.com/v2/shop

export type Rarity = {
  value: string;
  displayValue: string;
  backendValue: string;
};

export type Type = {
  value: string;
  displayValue: string;
  backendValue: string;
};

export type Series = {
  value: string;
  image?: string;
  colors: string[];
  backendValue: string;
};

export type Set = {
  value: string;
  text: string;
  backendValue: string;
};

export type Introduction = {
  chapter: string;
  season: string;
  text: string;
  backendValue: number;
};

export type Images = {
  smallIcon: string;
  icon: string;
  featured?: string;
  lego?: {
    small: string;
    large: string;
    wide: string;
  };
  bean?: {
    small: string;
    large: string;
  };
  Other?: Record<string, string>;
};

export type VariantOption = {
  tag: string;
  name: string;
  unlockRequirements: string;
  image: string;
};

export type Variant = {
  channel: string;
  type: string;
  options: VariantOption[];
};

export type BrItem = {
  id: string;
  name: string;
  description: string;
  exclusiveDescription?: string;
  unlockRequirements?: string;
  customExclusiveCallout?: string;
  type: Type;
  rarity: Rarity;
  series?: Series;
  set?: Set;
  introduction?: Introduction;
  images: Images;
  variants?: Variant[];
  builtInEmoteIds?: string[];
  searchTags?: string[];
  gameplayTags?: string[];
  metaTags?: string[];
  showcaseVideo?: string;
  dynamicPakId?: string;
  itemPreviewHeroPath?: string;
  displayAssetPath?: string;
  definitionPath?: string;
  path?: string;
  added: string;
  shopHistory?: string[];
};

export type TrackDifficulty = {
  vocals: number;
  guitar: number;
  bass: number;
  plasticBass: number;
  drums: number;
  plasticDrums: number;
};

export type Track = {
  id: string;
  devName: string;
  title: string;
  artist: string;
  album?: string;
  releaseYear: number;
  bpm: number;
  duration: number;
  difficulty: TrackDifficulty;
  gameplayTags?: string[];
  genres?: string[];
  albumArt: string;
  added: string;
  shopHistory?: string[];
};

export type Instrument = {
  id: string;
  name: string;
  description: string;
  type: Type;
  rarity: Rarity;
  images: {
    small: string;
    large: string;
  };
  series?: Series;
  gameplayTags?: string[];
  path?: string;
  showcaseVideo?: string;
  added: string;
  shopHistory?: string[];
};

export type Car = {
  id: string;
  vehicleId: string;
  name: string;
  description: string;
  type: Type;
  rarity: Rarity;
  images: {
    small: string;
    large: string;
  };
  series?: Series;
  gameplayTags?: string[];
  path?: string;
  showcaseVideo?: string;
  added: string;
  shopHistory?: string[];
};

export type LegoKit = {
  id: string;
  name: string;
  type: Type;
  series?: Series;
  gameplayTags?: string[];
  images: {
    small: string;
    large: string;
    wide: string;
  };
  path?: string;
  added: string;
  shopHistory?: string[];
};

export type Banner = {
  value: string;
  intensity: string;
  backendValue: string;
};

export type RenderImage = {
  productTag: string;
  fileName: string;
  image: string;
};

export type MaterialInstance = {
  id: string;
  primaryMode: string;
  productTag: string;
  Images: Record<string, string>;
  Colors: Record<string, string>;
  Scalings: Record<string, number>;
  Flags: Record<string, boolean>;
};

export type DisplayAsset = {
  id: string;
  cosmeticId?: string;
  materialInstances: MaterialInstance[];
  renderImages: RenderImage[];
};

export type Colors = {
  color1: string;
  color2: string;
  color3: string;
  textBackgroundColor: string;
};

export type TextureMetadata = {
  key: string;
  value: string;
};

export type StringMetadata = {
  key: string;
  value: string;
};

export type TextMetadata = {
  key: string;
  value: string;
};

export type Layout = {
  id: string;
  name: string;
  category?: string;
  index: number;
  rank: number;
  showIneligibleOffers: string;
  background?: string;
  useWidePreview: boolean;
  displayType: string;
  textureMetadata?: TextureMetadata[];
  stringMetadata?: StringMetadata[];
  textMetadata?: TextMetadata[];
};

export type Bundle = {
  name: string;
  info: string;
  image: string;
};

export type OfferTag = {
  id: string;
  text: string;
};

export type ShopItem = {
  // Basic item information
  regularPrice: number;
  finalPrice: number;
  devName: string;
  offerId: string;
  inDate: string;
  outDate: string;

  // Special properties
  bundle?: Bundle;
  banner?: Banner;
  offerTag?: OfferTag;

  // Item properties
  giftable: boolean;
  refundable: boolean;
  sortPriority: number;
  layoutId: string;
  layout: Layout;

  // Visual properties
  colors?: Colors;
  tileBackgroundMaterial?: string;
  tileSize: string;
  displayAssetPath: string;
  newDisplayAssetPath: string;
  newDisplayAsset: DisplayAsset;

  // Item content arrays
  brItems?: BrItem[];
  tracks?: Track[];
  instruments?: Instrument[];
  cars?: Car[];
  legoKits?: LegoKit[];
};

export type ShopData = {
  hash: string;
  date: string;
  vbuckIcon: string;
  entries: ShopItem[];
};

export type ShopResponse = {
  status: number;
  data: ShopData;
};

// Additional utility types for filtering and searching
export type ShopFilter = {
  rarity?: string;
  type?: string;
  series?: string;
  set?: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  isGiftable?: boolean;
  isRefundable?: boolean;
  hasBundle?: boolean;
  hasBanner?: boolean;
  hasOfferTag?: boolean;
};

export type ShopSort = {
  field: 'price' | 'name' | 'date' | 'rarity' | 'sortPriority';
  direction: 'asc' | 'desc';
};

// Error response types
export type ApiError = {
  status: number;
  error: string;
  message?: string;
};

// API request types
export type ShopRequest = {
  language?: string;
  includeRefundable?: boolean;
  includeGiftable?: boolean;
  includeExpired?: boolean;
};

// Detailed BR Item Types for individual item endpoint
export type DetailedBrItem = {
  id: string;
  name: string;
  description: string;
  exclusiveDescription?: string;
  unlockRequirements?: string;
  customExclusiveCallout?: string;
  type: Type;
  rarity: Rarity;
  series?: Series;
  set?: Set;
  introduction?: Introduction;
  images: Images;
  variants?: Variant[];
  builtInEmoteIds?: string[];
  searchTags?: string[];
  gameplayTags?: string[];
  metaTags?: string[];
  showcaseVideo?: string;
  dynamicPakId?: string;
  itemPreviewHeroPath?: string;
  displayAssetPath?: string;
  definitionPath?: string;
  path?: string;
  added: string;
  shopHistory?: string[];
};

export type DetailedBrItemResponse = {
  status: number;
  data: DetailedBrItem;
};
