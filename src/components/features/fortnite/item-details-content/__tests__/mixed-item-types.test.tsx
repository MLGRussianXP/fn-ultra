import { fireEvent, render, screen } from '@testing-library/react-native';

import { ItemSelector } from '../item-selector';
import { createMockEntryWithMixedItems } from './mock-data';

describe('ItemSelector - Mixed item types', () => {
  it('does not call onItemSelect when non-accessible item is pressed', () => {
    const onItemSelect = jest.fn();
    const mockEntry = createMockEntryWithMixedItems();

    render(
      <ItemSelector
        entry={mockEntry}
        selectedItemId="item-1"
        onItemSelect={onItemSelect}
      />
    );

    const trackItem = screen.getByTestId('item-selector-track-1');
    fireEvent.press(trackItem);

    expect(onItemSelect).not.toHaveBeenCalled();
  });

  it('renders mixed accessible and non-accessible items', () => {
    const mockEntry = createMockEntryWithMixedItems();

    render(
      <ItemSelector
        entry={mockEntry}
        selectedItemId="item-1"
        onItemSelect={jest.fn()}
      />
    );

    expect(screen.getByText('Items in this bundle (4)')).toBeTruthy();
    expect(screen.getByText('Test Item 1')).toBeTruthy();
    expect(screen.getByText('Test Item 2')).toBeTruthy();
    expect(screen.getByText('Test Track')).toBeTruthy();
    expect(screen.getByText('Test Instrument')).toBeTruthy();
  });

  it('disables non-accessible items visually', () => {
    const mockEntry = createMockEntryWithMixedItems();

    render(
      <ItemSelector
        entry={mockEntry}
        selectedItemId="item-1"
        onItemSelect={jest.fn()}
      />
    );

    const trackItem = screen.getByTestId('item-selector-track-1');
    const instrumentItem = screen.getByTestId('item-selector-instrument-1');

    expect(trackItem.props.accessibilityState?.disabled).toBe(true);
    expect(instrumentItem.props.accessibilityState?.disabled).toBe(true);
  });
});
