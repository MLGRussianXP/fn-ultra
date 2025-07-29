import { render, screen } from '@testing-library/react-native';
import React from 'react';

import type { ShopItem } from '@/api/fortnite/types';

import { ShopItemCard } from './shop-item-card';

// Mock the useShopItemData hook
jest.mock('@/features/fortnite/hooks/use-shop-item-data', () => ({
  useShopItemData: jest.fn(() => ({
    mainItem: {
      name: 'Test Item',
      type: { displayValue: 'Outfit' },
    },
    image: 'https://example.com/image.png',
    title: 'Test Item',
    gradientColors: ['#123456', '#654321'],
    hasColors: true,
    seriesImage: null,
    hasSeriesImage: false,
  })),
}));

// Mock the useShop hook
jest.mock('@/api/fortnite', () => ({
  useShop: jest.fn(() => ({
    data: {
      data: {
        vbuckIcon: 'https://example.com/vbuck.png',
      },
    },
  })),
}));

const mockEntry: ShopItem = {
  offerId: '1',
  regularPrice: 1000,
  finalPrice: 800,
  layout: {
    id: 'test',
    name: 'Test',
    index: 0,
    rank: 0,
    showIneligibleOffers: 'always',
    useWidePreview: false,
    displayType: 'normal',
  },
  devName: 'Test Item',
  inDate: '2023-01-01',
  outDate: '2023-01-02',
  giftable: true,
  refundable: true,
  sortPriority: 0,
  layoutId: 'test',
  tileSize: 'normal',
  displayAssetPath: 'test',
  newDisplayAssetPath: 'test',
  newDisplayAsset: { id: 'test', materialInstances: [], renderImages: [] },
};

describe('ShopItemCard', () => {
  it('renders without crashing', () => {
    render(<ShopItemCard entry={mockEntry} />);
    expect(screen.getByText('Test Item')).toBeTruthy();
  });
});
