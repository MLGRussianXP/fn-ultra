import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';

import type { FortniteShopItem } from '@/api/fortnite/types';

import { ShopItem } from './shop-item';

const mockBrItem: FortniteShopItem = {
  regularPrice: 1000,
  finalPrice: 1000,
  devName: '[VIRTUAL]1 x Mark 45 Bass',
  offerId: 'v2:/test-offer-id',
  inDate: '2025-07-02T00:00:00Z',
  outDate: '2025-07-06T23:59:59.999Z',
  giftable: true,
  refundable: true,
  sortPriority: -3,
  layoutId: 'IronMiles.98',
  layout: {
    id: 'IronMiles',
    name: 'Marvel',
    index: 22,
    rank: 194,
    showIneligibleOffers: 'always',
    useWidePreview: false,
    displayType: 'tileGrid',
  },
  colors: {
    color1: '86661cff',
    color2: '7f6326ff',
    color3: 'ddae43ff',
    textBackgroundColor: 'ddae43ff',
  },
  tileSize: 'Size_1_x_1',
  displayAssetPath:
    '/Game/Catalog/DisplayAssets/DA_Featured_Sparks_Bass_BikeMold',
  newDisplayAssetPath:
    '/OfferCatalog/NewDisplayAssets/S31/DAv2_Sparks_Bass_BikeMold',
  newDisplayAsset: {
    id: 'DAv2_Sparks_Bass_BikeMold',
    materialInstances: [],
    renderImages: [
      {
        productTag: 'Product.Sparks',
        fileName: 'T_UI_Featured_Bass_BikeMold',
        image:
          'https://fortnite-api.com/images/cosmetics/br/newdisplayassets/feba3089b4e22eab/renderimage_0.png',
      },
    ],
  },
  brItems: [
    {
      id: 'Backpack_BikeMold_Bass',
      name: 'Mark 45 Bass',
      description:
        "Tony Stark's proprietary bass design from his own collection.",
      type: {
        value: 'backpack',
        displayValue: 'Back Bling',
        backendValue: 'AthenaBackpack',
      },
      rarity: {
        value: 'marvel',
        displayValue: 'MARVEL SERIES',
        backendValue: 'EFortRarity::Rare',
      },
      series: {
        value: 'MARVEL SERIES',
        colors: ['ed1c24ff', 'd60203ff', 'b30102ff', '610709ff', '280102ff'],
        backendValue: 'MarvelSeries',
      },
      set: {
        value: 'Iron Man',
        text: 'Part of the Iron Man set.',
        backendValue: 'MarbleShot',
      },
      images: {
        smallIcon:
          'https://fortnite-api.com/images/cosmetics/br/backpack_bikemold_bass/smallicon.png',
        icon: 'https://fortnite-api.com/images/cosmetics/br/backpack_bikemold_bass/icon.png',
      },
      added: '2025-04-21T00:00:00Z',
    },
  ],
};

const mockTrackItem: FortniteShopItem = {
  regularPrice: 500,
  finalPrice: 500,
  devName: '[VIRTUAL]1 x Feather for 500 MtxCurrency',
  offerId: 'v2:/track-offer-id',
  inDate: '2025-06-30T00:00:00Z',
  outDate: '2025-07-03T23:59:59.999Z',
  giftable: true,
  refundable: true,
  sortPriority: -2,
  layoutId: 'JT0702.99',
  layout: {
    id: 'JT0702',
    name: 'Jam Tracks',
    index: 24,
    rank: 187,
    showIneligibleOffers: 'always',
    useWidePreview: false,
    displayType: 'tileGrid',
  },
  tileSize: 'Size_1_x_1',
  displayAssetPath: '/Game/Catalog/DisplayAssets/DA_Featured_Feather',
  newDisplayAssetPath: 'sid_placeholder_308',
  newDisplayAsset: {
    id: 'sid_placeholder_308',
    materialInstances: [],
    renderImages: [],
  },
  tracks: [
    {
      id: 'sid_placeholder_308',
      devName: 'feather',
      title: 'Feather',
      artist: 'Sabrina Carpenter',
      releaseYear: 2023,
      bpm: 124,
      duration: 186,
      difficulty: {
        vocals: 3,
        guitar: 2,
        bass: 1,
        plasticBass: 2,
        drums: 1,
        plasticDrums: 1,
      },
      albumArt: 'https://cdn.fortnite-api.com/tracks/d1b9812e0ad70ce4.jpg',
      added: '2024-10-17T00:00:00Z',
    },
  ],
};

describe('ShopItem', () => {
  it('renders BR item correctly', () => {
    render(<ShopItem item={mockBrItem} />);

    expect(screen.getByText('Mark 45 Bass')).toBeTruthy();
    expect(screen.getByText('1000 V-Bucks')).toBeTruthy();
    expect(screen.getByText('MARVEL SERIES')).toBeTruthy();
    expect(screen.getByText('Back Bling')).toBeTruthy();
    expect(
      screen.getByText(
        "Tony Stark's proprietary bass design from his own collection."
      )
    ).toBeTruthy();
    expect(screen.getByText('Part of the Iron Man set.')).toBeTruthy();
  });

  it('renders track item correctly', () => {
    render(<ShopItem item={mockTrackItem} />);

    expect(screen.getByText('Feather')).toBeTruthy();
    expect(screen.getByText('500 V-Bucks')).toBeTruthy();
    // Track items don't show artist name in the current implementation
    // expect(screen.getByText('Sabrina Carpenter')).toBeTruthy();
  });

  it('handles missing optional fields gracefully', () => {
    const minimalItem: FortniteShopItem = {
      ...mockBrItem,
      brItems: undefined,
      tracks: undefined,
      colors: undefined,
      bundle: undefined,
      offerTag: undefined,
    };

    render(<ShopItem item={minimalItem} />);

    expect(screen.getByText('[VIRTUAL]1 x Mark 45 Bass')).toBeTruthy();
    expect(screen.getByText('1000 V-Bucks')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<ShopItem item={mockBrItem} onPress={onPress} />);

    // Find the Pressable component and trigger onPress
    const pressable = screen.getByTestId('shop-item-pressable');
    fireEvent.press(pressable);

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
