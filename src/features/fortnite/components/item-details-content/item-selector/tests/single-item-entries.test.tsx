import { render, screen } from '@testing-library/react-native';
import React from 'react';

import type { ShopItem } from '@/api/fortnite/types';

import { ItemSelector } from '../item-selector';
import { mockBrItem1 } from './mock-data';

describe('ItemSelector with single item', () => {
  it('returns null when there is only one item', () => {
    // Create a mock entry with only one item
    const mockEntry: ShopItem = {
      regularPrice: 1000,
      finalPrice: 1000,
      devName: 'Test Item',
      offerId: 'test-offer',
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
      brItems: [mockBrItem1],
    };

    render(
      <ItemSelector
        entry={mockEntry}
        selectedItemId="test-br-item-1"
        onSelectItem={jest.fn()}
      />
    );

    // Expect the component to return null (no rendered output)
    expect(screen.queryByText('Bundle Contents')).toBeNull();
  });
});
