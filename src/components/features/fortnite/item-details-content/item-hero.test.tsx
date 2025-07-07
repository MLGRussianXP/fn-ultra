import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { ItemHero } from './item-hero';

const mockItem = {
  id: 'test-item',
  name: 'Test Item',
  description: 'Test description',
  type: {
    value: 'backpack',
    displayValue: 'Back Bling',
    backendValue: 'AthenaBackpack',
  },
  rarity: {
    value: 'rare',
    displayValue: 'Rare',
    backendValue: 'EFortRarity::Rare',
  },
  images: {
    smallIcon: 'https://example.com/small-icon.png',
    icon: 'https://example.com/icon.png',
    featured: 'https://example.com/featured.png',
  },
  added: '2025-01-01T00:00:00Z',
};

const mockItemWithSeriesImage = {
  ...mockItem,
  series: {
    value: 'MARVEL SERIES',
    image: 'https://example.com/series-image.png',
    colors: ['ed1c24ff', 'd60203ff'],
    backendValue: 'MarvelSeries',
  },
};

const mockItemWithSeriesColors = {
  ...mockItem,
  series: {
    value: 'MARVEL SERIES',
    colors: ['ed1c24ff', 'd60203ff'],
    backendValue: 'MarvelSeries',
  },
};

describe('ItemHero', () => {
  it('renders without crashing', () => {
    render(<ItemHero item={mockItem as any} />);
  });

  it('renders with series image when available', () => {
    render(<ItemHero item={mockItemWithSeriesImage as any} />);
    const seriesImage = screen.getByTestId('item-hero-series-image');
    expect(seriesImage).toBeTruthy();
  });

  it('renders with gradient when no series image but series colors available', () => {
    render(<ItemHero item={mockItemWithSeriesColors as any} />);
    const gradient = screen.getByTestId('item-hero-gradient');
    expect(gradient).toBeTruthy();
  });

  it('renders with default gradient when no series data', () => {
    render(<ItemHero item={mockItem as any} />);
    const gradient = screen.getByTestId('item-hero-gradient');
    expect(gradient).toBeTruthy();
  });
});
