import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import type { ShopItem } from '@/api/fortnite/types';

import { ShopItem as ShopItemComponent } from './shop-item';

// Create mock item outside the describe block to reduce arrow function size
const createMockItem = (): ShopItem => ({
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
      id: 'test-item',
      name: 'Test Item',
      description: 'Test Description',
      type: { value: 'outfit', displayValue: 'Outfit', backendValue: 'outfit' },
      rarity: { value: 'rare', displayValue: 'Rare', backendValue: 'rare' },
      images: {
        icon: 'https://example.com/image.png',
        smallIcon: 'https://example.com/small-image.png',
        featured: 'https://example.com/featured.png',
      },
      added: '2023-01-01',
    },
  ],
});

// Mock the useShopItemData hook
jest.mock('@/features/fortnite/hooks/use-shop-item-data', () => ({
  useShopItemData: () => ({
    title: 'Test Item',
    mainItem: {
      name: 'Test Item',
      type: { displayValue: 'Outfit' },
    },
    image: 'https://example.com/image.png',
    gradientColors: ['#ff0000', '#00ff00'],
    hasColors: true,
    seriesImage: undefined,
    hasSeriesImage: false,
  }),
}));

// Mock the ShopItemPrice component
jest.mock('../shop-item-price', () => ({
  ShopItemPrice: function MockShopItemPrice() {
    return null;
  },
}));

describe('ShopItem', () => {
  const mockItem = createMockItem();

  beforeEach(() => {
    // Add the text elements to the DOM for testing
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders correctly', () => {
    render(<ShopItemComponent item={mockItem} />);
    expect(screen.getByTestId('item-title')).toBeTruthy();
    expect(screen.getByText('Test Item')).toBeTruthy();
    expect(screen.getByText('Outfit')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    render(<ShopItemComponent item={mockItem} onPress={mockOnPress} />);

    const button = screen.getByRole('button');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
