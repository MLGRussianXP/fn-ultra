import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';

import type { FortniteShopItem } from '@/api/fortnite/types';

import { ItemSelector } from './item-selector';

const mockEntry: FortniteShopItem = {
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
  brItems: [
    {
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
    },
    {
      id: 'item-2',
      name: 'Test Item 2',
      description: 'Test description 2',
      type: { value: 'test', displayValue: 'Test', backendValue: 'test' },
      rarity: { value: 'rare', displayValue: 'Rare', backendValue: 'rare' },
      images: { smallIcon: 'test2.png', icon: 'test2.png' },
      added: '2025-01-01',
    },
  ],
};

describe('ItemSelector', () => {
  it('renders nothing for single item entries', () => {
    const singleItemEntry = {
      ...mockEntry,
      brItems: [mockEntry.brItems![0]],
    };

    render(
      <ItemSelector
        entry={singleItemEntry}
        selectedItemId="item-1"
        onItemSelect={jest.fn()}
      />
    );

    expect(screen.queryByText('Items in this bundle')).toBeNull();
  });

  it('renders multiple items correctly', () => {
    const onItemSelect = jest.fn();

    render(
      <ItemSelector
        entry={mockEntry}
        selectedItemId="item-1"
        onItemSelect={onItemSelect}
      />
    );

    expect(screen.getByText('Items in this bundle (2)')).toBeTruthy();
    expect(screen.getByText('Test Item 1')).toBeTruthy();
    expect(screen.getByText('Test Item 2')).toBeTruthy();
  });

  it('calls onItemSelect when item is pressed', () => {
    const onItemSelect = jest.fn();

    render(
      <ItemSelector
        entry={mockEntry}
        selectedItemId="item-1"
        onItemSelect={onItemSelect}
      />
    );

    const item2 = screen.getByTestId('item-selector-item-2');
    fireEvent.press(item2);

    expect(onItemSelect).toHaveBeenCalledWith('item-2');
  });

  it('highlights selected item', () => {
    render(
      <ItemSelector
        entry={mockEntry}
        selectedItemId="item-2"
        onItemSelect={jest.fn()}
      />
    );

    const selectedItem = screen.getByTestId('item-selector-item-2');
    expect(selectedItem).toBeTruthy();
  });
});
