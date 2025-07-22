import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import type { ShopItem } from '@/api/fortnite/types';

import { ItemSelector } from './item-selector';
import { createMockEntry, mockBrItem1 } from './tests/mock-data';

describe('ItemSelector', () => {
  it('renders correctly with multiple items', () => {
    const mockEntry = createMockEntry();

    render(
      <ItemSelector
        entry={mockEntry as ShopItem}
        selectedItemId="test-br-item-1"
        onSelectItem={() => {}}
      />
    );

    expect(screen.getByText('Bundle Contents')).toBeTruthy();
    expect(screen.getByText('Test BR Item 1')).toBeTruthy();
    expect(screen.getByText('Test BR Item 2')).toBeTruthy();
  });

  it('handles item selection', () => {
    const mockEntry = createMockEntry();
    const onSelectItem = jest.fn();

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

  it('returns null for single item entries', () => {
    // Create a mock entry with only one item
    const mockEntry: ShopItem = {
      ...createMockEntry(),
      brItems: [mockBrItem1],
    };

    render(
      <ItemSelector
        entry={mockEntry}
        selectedItemId="test-br-item-1"
        onSelectItem={() => {}}
      />
    );

    // Bundle Contents heading should not be present
    expect(screen.queryByText('Bundle Contents')).toBeNull();
  });
});
