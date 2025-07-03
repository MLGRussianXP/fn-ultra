import { render } from '@testing-library/react-native';
import React from 'react';

import { ShopItemCard } from './shop-item-card';

const mockEntry = {
  offerId: '1',
  regularPrice: 1000,
  finalPrice: 800,
  layout: { useWidePreview: false },
  devName: 'Test Item',
  colors: undefined,
};

describe('ShopItemCard', () => {
  it('renders without crashing', () => {
    render(<ShopItemCard entry={mockEntry as any} />);
  });
});
