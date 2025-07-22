import { render, screen } from '@testing-library/react-native';
import React from 'react';

import type { ShopItem } from '@/api/fortnite/types';

import { ShopItemPrice } from './shop-item-price';

// Create a mock item factory to reduce duplication
const createMockItem = (
  regularPrice: number,
  finalPrice: number
): ShopItem => ({
  regularPrice,
  finalPrice,
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
});

describe('ShopItemPrice', () => {
  it('renders with regular and final price', () => {
    const mockItem = createMockItem(1000, 1000);
    render(<ShopItemPrice item={mockItem} />);

    expect(screen.getByText('1000')).toBeTruthy();
    expect(screen.getByText('V-Bucks')).toBeTruthy();
  });

  it('renders with discount', () => {
    const mockItem = createMockItem(1500, 1000);
    render(<ShopItemPrice item={mockItem} />);

    expect(screen.getByText('1000')).toBeTruthy();
    expect(screen.getByText('V-Bucks')).toBeTruthy();
    expect(screen.getByText('1500')).toBeTruthy();
  });
});
