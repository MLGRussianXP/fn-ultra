import { render, screen } from '@testing-library/react-native';
import React from 'react';

import type { ShopItem } from '@/api/fortnite/types';

import { ShopItemContent } from './shop-item-content';

describe('ShopItemContent', () => {
  it('renders with name and type', () => {
    const mockItem: ShopItem = {
      regularPrice: 1000,
      finalPrice: 1000,
      offerId: 'test-offer',
      devName: 'Test Item',
      inDate: '2023-01-01',
      outDate: '2023-01-02',
      giftable: true,
      refundable: true,
      sortPriority: 0,
      layoutId: 'test',
      layout: {
        id: 'test',
        name: 'Test',
        index: 0,
        rank: 0,
        showIneligibleOffers: 'always',
        useWidePreview: false,
        displayType: 'normal',
      },
      tileSize: 'normal',
      displayAssetPath: 'test',
      newDisplayAssetPath: 'test',
      newDisplayAsset: {
        id: 'test',
        materialInstances: [],
        renderImages: [],
      },
      brItems: [
        {
          id: 'test-id',
          name: 'Test Item',
          description: 'Test Description',
          type: {
            value: 'outfit',
            displayValue: 'Outfit',
            backendValue: 'AthenaCharacter',
          },
          rarity: {
            value: 'uncommon',
            displayValue: 'Uncommon',
            backendValue: 'EFortRarity::Uncommon',
          },
          images: {
            smallIcon: 'https://example.com/small.png',
            icon: 'https://example.com/icon.png',
          },
          added: '2023-01-01',
        },
      ],
    };

    render(<ShopItemContent item={mockItem} />);

    expect(screen.getByText('Test Item')).toBeTruthy();
    expect(screen.getByText('Outfit')).toBeTruthy();
  });
});
