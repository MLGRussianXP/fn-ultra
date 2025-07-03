// Fortnite Shop API Types
// Based on actual API response from https://fortnite-api.com/v2/shop

export type FortniteRarity = {
  value: string;
  displayValue: string;
  backendValue: string;
};

export type FortniteType = {
  value: string;
  displayValue: string;
  backendValue: string;
};

export type FortniteSeries = {
  value: string;
  image?: string;
  colors: string[];
  backendValue: string;
};

export type FortniteSet = {
  value: string;
  text: string;
  backendValue: string;
};

export type FortniteIntroduction = {
  chapter: string;
  season: string;
  text: string;
  backendValue: number;
};

export type FortniteImages = {
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

export type FortniteVariantOption = {
  tag: string;
  name: string;
  unlockRequirements: string;
  image: string;
};

export type FortniteVariant = {
  channel: string;
  type: string;
  options: FortniteVariantOption[];
};

export type FortniteBrItem = {
  id: string;
  name: string;
  description: string;
  exclusiveDescription?: string;
  unlockRequirements?: string;
  customExclusiveCallout?: string;
  type: FortniteType;
  rarity: FortniteRarity;
  series?: FortniteSeries;
  set?: FortniteSet;
  introduction?: FortniteIntroduction;
  images: FortniteImages;
  variants?: FortniteVariant[];
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

export type FortniteTrackDifficulty = {
  vocals: number;
  guitar: number;
  bass: number;
  plasticBass: number;
  drums: number;
  plasticDrums: number;
};

export type FortniteTrack = {
  id: string;
  devName: string;
  title: string;
  artist: string;
  album?: string;
  releaseYear: number;
  bpm: number;
  duration: number;
  difficulty: FortniteTrackDifficulty;
  gameplayTags?: string[];
  genres?: string[];
  albumArt: string;
  added: string;
  shopHistory?: string[];
};

export type FortniteInstrument = {
  id: string;
  name: string;
  description: string;
  type: FortniteType;
  rarity: FortniteRarity;
  images: {
    small: string;
    large: string;
  };
  series?: FortniteSeries;
  gameplayTags?: string[];
  path?: string;
  showcaseVideo?: string;
  added: string;
  shopHistory?: string[];
};

export type FortniteCar = {
  id: string;
  vehicleId: string;
  name: string;
  description: string;
  type: FortniteType;
  rarity: FortniteRarity;
  images: {
    small: string;
    large: string;
  };
  series?: FortniteSeries;
  gameplayTags?: string[];
  path?: string;
  showcaseVideo?: string;
  added: string;
  shopHistory?: string[];
};

export type FortniteLegoKit = {
  id: string;
  name: string;
  type: FortniteType;
  series?: FortniteSeries;
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

export type FortniteBanner = {
  value: string;
  intensity: string;
  backendValue: string;
};

export type FortniteRenderImage = {
  productTag: string;
  fileName: string;
  image: string;
};

export type FortniteMaterialInstance = {
  id: string;
  primaryMode: string;
  productTag: string;
  Images: Record<string, string>;
  Colors: Record<string, string>;
  Scalings: Record<string, number>;
  Flags: Record<string, boolean>;
};

export type FortniteDisplayAsset = {
  id: string;
  cosmeticId?: string;
  materialInstances: FortniteMaterialInstance[];
  renderImages: FortniteRenderImage[];
};

export type FortniteColors = {
  color1: string;
  color2: string;
  color3: string;
  textBackgroundColor: string;
};

export type FortniteTextureMetadata = {
  key: string;
  value: string;
};

export type FortniteStringMetadata = {
  key: string;
  value: string;
};

export type FortniteTextMetadata = {
  key: string;
  value: string;
};

export type FortniteLayout = {
  id: string;
  name: string;
  category?: string;
  index: number;
  rank: number;
  showIneligibleOffers: string;
  background?: string;
  useWidePreview: boolean;
  displayType: string;
  textureMetadata?: FortniteTextureMetadata[];
  stringMetadata?: FortniteStringMetadata[];
  textMetadata?: FortniteTextMetadata[];
};

export type FortniteBundle = {
  name: string;
  info: string;
  image: string;
};

export type FortniteOfferTag = {
  id: string;
  text: string;
};

export type FortniteShopItem = {
  // Basic item information
  regularPrice: number;
  finalPrice: number;
  devName: string;
  offerId: string;
  inDate: string;
  outDate: string;

  // Special properties
  bundle?: FortniteBundle;
  banner?: FortniteBanner;
  offerTag?: FortniteOfferTag;

  // Item properties
  giftable: boolean;
  refundable: boolean;
  sortPriority: number;
  layoutId: string;
  layout: FortniteLayout;

  // Visual properties
  colors?: FortniteColors;
  tileBackgroundMaterial?: string;
  tileSize: string;
  displayAssetPath: string;
  newDisplayAssetPath: string;
  newDisplayAsset: FortniteDisplayAsset;

  // Item content arrays
  brItems?: FortniteBrItem[];
  tracks?: FortniteTrack[];
  instruments?: FortniteInstrument[];
  cars?: FortniteCar[];
  legoKits?: FortniteLegoKit[];
};

export type FortniteShopData = {
  hash: string;
  date: string;
  vbuckIcon: string;
  entries: FortniteShopItem[];
};

export type FortniteShopResponse = {
  status: number;
  data: FortniteShopData;
};

// Additional utility types for filtering and searching
export type FortniteShopFilter = {
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

export type FortniteShopSort = {
  field: 'price' | 'name' | 'date' | 'rarity' | 'sortPriority';
  direction: 'asc' | 'desc';
};

// Error response types
export type FortniteApiError = {
  status: number;
  error: string;
  message?: string;
};

// API request types
export type FortniteShopRequest = {
  language?: string;
  includeRefundable?: boolean;
  includeGiftable?: boolean;
  includeExpired?: boolean;
};
