import type { FortniteShopItem } from '@/api/fortnite/types';

export const mockBrItem1 = {
  id: 'item-1',
  name: 'Test Item 1',
  description: 'Test description 1',
  type: { value: 'test', displayValue: 'Test', backendValue: 'test' },
  rarity: {
    value: 'common',
    displayValue: 'Common',
    backendValue: 'common',
  },
  images: { smallIcon: 'test1.png', icon: 'test1.png' },
  added: '2025-01-01',
};

export const mockBrItem2 = {
  id: 'item-2',
  name: 'Test Item 2',
  description: 'Test description 2',
  type: { value: 'test', displayValue: 'Test', backendValue: 'test' },
  rarity: { value: 'rare', displayValue: 'Rare', backendValue: 'rare' },
  images: { smallIcon: 'test2.png', icon: 'test2.png' },
  added: '2025-01-01',
};

export const mockTrack = {
  id: 'track-1',
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

export const mockInstrument = {
  id: 'instrument-1',
  name: 'Test Instrument',
  description: 'Test instrument description',
  type: {
    value: 'instrument',
    displayValue: 'Instrument',
    backendValue: 'instrument',
  },
  rarity: { value: 'common', displayValue: 'Common', backendValue: 'common' },
  images: { small: 'instrument1-small.png', large: 'instrument1.png' },
  added: '2025-01-01',
};

export const createMockEntry = (
  brItems: any[] = [mockBrItem1, mockBrItem2]
): FortniteShopItem => ({
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

export const createMockEntryWithMixedItems = (): FortniteShopItem => ({
  ...createMockEntry(),
  tracks: [mockTrack],
  instruments: [mockInstrument],
});
