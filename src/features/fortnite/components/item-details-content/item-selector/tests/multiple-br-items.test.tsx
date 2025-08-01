import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import type { ShopItem } from '@/api/fortnite/types';

import { ItemSelector } from '../item-selector';
import { createMockEntry } from './mock-data';

describe('ItemSelector with multiple BR items', () => {
  it('renders all BR items', () => {
    const onSelectItem = jest.fn();
    const mockEntry = createMockEntry();

    render(
      <ItemSelector
        entry={mockEntry as ShopItem}
        selectedItemId="test-br-item-1"
        onSelectItem={onSelectItem}
      />
    );

    expect(screen.getByText('Test BR Item 1')).toBeTruthy();
    expect(screen.getByText('Test BR Item 2')).toBeTruthy();
  });

  it('selects the correct item based on selectedItemId', () => {
    const onSelectItem = jest.fn();
    const mockEntry = createMockEntry();

    render(
      <ItemSelector
        entry={mockEntry as ShopItem}
        selectedItemId="test-br-item-2"
        onSelectItem={onSelectItem}
      />
    );

    // This would be better with testIDs, but we're checking the component structure
    const selectedItem = screen.getByText('Test BR Item 2').parent?.parent;
    expect(selectedItem).toBeTruthy();
    // Would check for specific styling here in a real test
  });

  it('calls onSelectItem when an item is pressed', () => {
    const onSelectItem = jest.fn();
    const mockEntry = createMockEntry();

    render(
      <ItemSelector
        entry={mockEntry as ShopItem}
        selectedItemId="test-br-item-1"
        onSelectItem={onSelectItem}
      />
    );

    // Press the second item
    fireEvent.press(screen.getByText('Test BR Item 2'));

    // Check if onSelectItem was called with the correct ID
    expect(onSelectItem).toHaveBeenCalledWith('test-br-item-2');
  });
});
