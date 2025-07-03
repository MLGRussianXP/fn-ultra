import { render } from '@testing-library/react-native';
import React from 'react';

import { ShopItemPrice } from './shop-item-price';

describe('ShopItemPrice', () => {
  it('renders with regular and final price', () => {
    render(
      <ShopItemPrice
        regularPrice={1000}
        finalPrice={800}
        priceClass="text-base"
      />
    );
  });
});
