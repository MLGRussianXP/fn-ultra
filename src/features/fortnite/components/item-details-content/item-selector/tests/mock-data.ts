import type { ShopItem } from '@/api/fortnite/types';

// BR Items
export const mockBrItem1 = {
  id: 'test-br-item-1',
  name: 'Test BR Item 1',
  description: 'Test description 1',
  type: {
    value: 'outfit',
    displayValue: 'Outfit',
    backendValue: 'AthenaCharacter',
  },
  rarity: {
    value: 'common',
    displayValue: 'Common',
    backendValue: 'EFortRarity::Common',
  },
  images: { smallIcon: 'test1.png', icon: 'test1.png' },
  added: '2025-01-01',
};

export const mockBrItem2 = {
  id: 'test-br-item-2',
  name: 'Test BR Item 2',
  description: 'Test description 2',
  type: {
    value: 'backpack',
    displayValue: 'Back Bling',
    backendValue: 'AthenaBackpack',
  },
  rarity: {
    value: 'rare',
    displayValue: 'Rare',
    backendValue: 'EFortRarity::Rare',
  },
  images: { smallIcon: 'test2.png', icon: 'test2.png' },
  added: '2025-01-01',
};

// Track
export const mockTrack = {
  id: 'test-track-1',
  devName: 'Test Track',
  title: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  releaseYear: 2024,
  bpm: 120,
  duration: 180,
  difficulty: {
    vocals: 1,
    guitar: 2,
    bass: 1,
    plasticBass: 1,
    drums: 2,
    plasticDrums: 1,
  },
  albumArt: 'track1.png',
  added: '2025-01-01',
};

// Instrument
export const mockInstrument = {
  id: 'test-instrument-1',
  name: 'Test Instrument',
  description: 'Test instrument description',
  type: {
    value: 'instrument',
    displayValue: 'Instrument',
    backendValue: 'FestivalInstrument',
  },
  rarity: {
    value: 'common',
    displayValue: 'Common',
    backendValue: 'EFortRarity::Common',
  },
  images: { small: 'instrument1-small.png', large: 'instrument1.png' },
  added: '2025-01-01',
};

// Car
export const mockCar = {
  id: 'test-car-1',
  vehicleId: 'vehicle-1',
  name: 'Test Car',
  description: 'Test car description',
  type: {
    value: 'car',
    displayValue: 'Vehicle',
    backendValue: 'Vehicle',
  },
  rarity: {
    value: 'epic',
    displayValue: 'Epic',
    backendValue: 'EFortRarity::Epic',
  },
  images: { small: 'car1-small.png', large: 'car1.png' },
  added: '2025-01-01',
};

// LEGO Kit
export const mockLegoKit = {
  id: 'test-lego-1',
  name: 'Test LEGO Kit',
  type: {
    value: 'lego',
    displayValue: 'LEGO',
    backendValue: 'LegoKit',
  },
  images: {
    small: 'lego1-small.png',
    large: 'lego1.png',
    wide: 'lego1-wide.png',
  },
  added: '2025-01-01',
};

// Create a basic shop item with BR items
export const createMockEntry = (
  brItems: any[] = [mockBrItem1, mockBrItem2]
): ShopItem => ({
  regularPrice: 1000,
  finalPrice: 1000,
  devName: 'Test Bundle',
  offerId: 'test-offer-id',
  inDate: '2025-01-01T00:00:00Z',
  outDate: '2025-01-02T00:00:00Z',
  giftable: true,
  refundable: true,
  sortPriority: 0,
  layoutId: 'test-layout',
  layout: {
    id: 'test',
    name: 'Test',
    index: 0,
    rank: 0,
    showIneligibleOffers: 'always',
    useWidePreview: false,
    displayType: 'tileGrid',
  },
  tileSize: 'Size_1_x_1',
  displayAssetPath: '/test',
  newDisplayAssetPath: '/test',
  newDisplayAsset: {
    id: 'test',
    materialInstances: [],
    renderImages: [],
  },
  brItems,
});

// Create a shop item with mixed item types
export const createMockEntryWithMixedItems = (): ShopItem => ({
  ...createMockEntry(),
  tracks: [mockTrack],
  instruments: [mockInstrument],
});

// Shop item with multiple types for testing
export const mockItemWithMultipleTypes = {
  regularPrice: 2000,
  finalPrice: 1800,
  devName: 'Test Bundle',
  offerId: 'test-bundle-id',
  inDate: '2025-01-01T00:00:00Z',
  outDate: '2025-01-02T00:00:00Z',
  giftable: true,
  refundable: true,
  sortPriority: 0,
  layoutId: 'test-layout',
  layout: {
    id: 'test',
    name: 'Test',
    index: 0,
    rank: 0,
    showIneligibleOffers: 'always',
    useWidePreview: false,
    displayType: 'tileGrid',
  },
  tileSize: 'Size_1_x_1',
  displayAssetPath: '/test',
  newDisplayAssetPath: '/test',
  newDisplayAsset: {
    id: 'test',
    materialInstances: [],
    renderImages: [],
  },
  brItems: [mockBrItem1, mockBrItem2],
  tracks: [mockTrack],
  instruments: [mockInstrument],
  cars: [mockCar],
  legoKits: [mockLegoKit],
};
