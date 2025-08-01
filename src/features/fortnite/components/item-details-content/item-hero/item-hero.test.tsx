import { render, screen } from '@testing-library/react-native';
import React from 'react';

import type { DetailedBrItem } from '@/api/fortnite/types';

// Import the mocked component to spy on it
import { ItemImageCarousel } from '../item-image-carousel';
import { ItemHero } from './item-hero';

// Mock the ItemImageCarousel component
jest.mock('../item-image-carousel', () => ({
  ItemImageCarousel: jest.fn(() => null),
}));

// Create mock item data outside the describe block to reduce arrow function size
const mockItem: DetailedBrItem = {
  id: 'test-item',
  name: 'Test Item',
  description: 'Test description',
  type: {
    value: 'outfit',
    displayValue: 'Outfit',
    backendValue: 'AthenaCharacter',
  },
  rarity: {
    value: 'rare',
    displayValue: 'Rare',
    backendValue: 'EFortRarity::Rare',
  },
  images: {
    smallIcon: 'test-small.png',
    icon: 'test.png',
  },
  added: '2023-01-01',
};

const mockItemWithSeriesImage: DetailedBrItem = {
  ...mockItem,
  series: {
    value: 'Test Series',
    image: 'test-series.png',
    colors: ['ff0000ff', '00ff00ff'],
    backendValue: 'TestSeries',
  },
};

describe('ItemHero', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with basic item', () => {
    render(<ItemHero brItemData={mockItem} />);
    expect(screen.getByTestId('item-hero')).toBeTruthy();

    // Check that ItemImageCarousel was called with the correct props
    const calls = (ItemImageCarousel as jest.Mock).mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0].brItemData).toBe(mockItem);
    expect(calls[0][0].testID).toBe('item-image-carousel');
  });

  it('passes series image to carousel when available', () => {
    render(
      <ItemHero
        brItemData={mockItemWithSeriesImage}
        seriesImage="test-series.png"
      />
    );

    const calls = (ItemImageCarousel as jest.Mock).mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0].brItemData).toBe(mockItemWithSeriesImage);
    expect(calls[0][0].seriesImage).toBe('test-series.png');
    expect(calls[0][0].testID).toBe('item-image-carousel');
  });

  it('passes gradient colors to carousel when available', () => {
    const gradientColors = ['#ff0000', '#00ff00'];
    render(<ItemHero brItemData={mockItem} gradientColors={gradientColors} />);

    const calls = (ItemImageCarousel as jest.Mock).mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0].brItemData).toBe(mockItem);
    expect(calls[0][0].gradientColors).toBe(gradientColors);
    expect(calls[0][0].testID).toBe('item-image-carousel');
  });

  it('renders with all props', () => {
    const gradientColors = ['#ff0000', '#00ff00'];
    render(
      <ItemHero
        brItemData={mockItem}
        seriesImage="test-series.png"
        gradientColors={gradientColors}
      />
    );

    const calls = (ItemImageCarousel as jest.Mock).mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0].brItemData).toBe(mockItem);
    expect(calls[0][0].seriesImage).toBe('test-series.png');
    expect(calls[0][0].gradientColors).toBe(gradientColors);
    expect(calls[0][0].testID).toBe('item-image-carousel');
  });
});
