import { render, screen } from '@testing-library/react-native';

import { ItemSelector } from '../item-selector';
import { createMockEntry, mockBrItem1 } from './mock-data';

describe('ItemSelector - Single item entries', () => {
  it('renders nothing for single item entries', () => {
    const singleItemEntry = createMockEntry([mockBrItem1]);

    render(
      <ItemSelector
        entry={singleItemEntry}
        selectedItemId="item-1"
        onItemSelect={jest.fn()}
      />
    );

    expect(screen.queryByText('Items in this bundle')).toBeNull();
  });
});
