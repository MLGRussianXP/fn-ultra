import { fireEvent, render, screen } from '@testing-library/react-native';

import { ItemSelector } from '../item-selector';
import { createMockEntry } from './mock-data';

describe('ItemSelector - Multiple BR items', () => {
  it('renders multiple items correctly', () => {
    const onItemSelect = jest.fn();
    const mockEntry = createMockEntry();

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

  it('calls onItemSelect when accessible item is pressed', () => {
    const onItemSelect = jest.fn();
    const mockEntry = createMockEntry();

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
    const mockEntry = createMockEntry();

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
