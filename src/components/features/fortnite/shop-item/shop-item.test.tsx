import { render } from '@testing-library/react-native';
import React from 'react';

import type { FortniteShopItem } from '@/api/fortnite/types';

import { ShopItem } from './shop-item';

describe('ShopItem', () => {
  it('renders without crashing', () => {
    render(<ShopItem item={{ offerId: '1' } as FortniteShopItem} />);
  });
});
