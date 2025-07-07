import { render } from '@testing-library/react-native';
import React from 'react';

import type { FortniteShopItem } from '@/api/fortnite/types';

import { ShopItemContent } from './shop-item-content';

describe('ShopItemContent', () => {
  it('renders without crashing', () => {
    render(
      <ShopItemContent
        item={{ offerId: '1' } as FortniteShopItem}
        mainItem={{}}
      />
    );
  });
});
