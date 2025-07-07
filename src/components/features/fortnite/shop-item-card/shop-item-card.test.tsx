import { render, screen } from '@testing-library/react-native';
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

const mockEntryWithSeriesImage = {
  offerId: '2',
  regularPrice: 1000,
  finalPrice: 800,
  layout: { useWidePreview: false },
  devName: 'Test Item with Series',
  colors: undefined,
  brItems: [
    {
      series: {
        value: 'MARVEL SERIES',
        image: 'https://example.com/series-image.png',
        colors: ['ed1c24ff', 'd60203ff'],
        backendValue: 'MarvelSeries',
      },
    },
  ],
};

describe('ShopItemCard', () => {
  it('renders without crashing', () => {
    render(<ShopItemCard entry={mockEntry as any} />);
  });

  it('renders with series image when available', () => {
    render(<ShopItemCard entry={mockEntryWithSeriesImage as any} />);
    const seriesImage = screen.getByTestId('shop-item-card-pressable');
    expect(seriesImage).toBeTruthy();
  });
});
