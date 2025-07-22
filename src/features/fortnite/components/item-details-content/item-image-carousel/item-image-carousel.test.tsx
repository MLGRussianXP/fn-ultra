import { render, screen } from '@testing-library/react-native';
import React from 'react';

import type { DetailedBrItem } from '@/api/fortnite/types';

import { ItemImageCarousel } from './item-image-carousel';

// eslint-disable-next-line max-lines-per-function
describe('ItemImageCarousel', () => {
  // Mock data for testing
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
      icon: 'test-icon.png',
      featured: 'test-featured.png',
    },
    added: '2023-01-01',
  };

  const itemWithOnlyIcon: DetailedBrItem = {
    ...mockItem,
    images: {
      smallIcon: 'test-small.png',
      icon: 'test-icon.png',
    },
  };

  const itemWithNoImages: DetailedBrItem = {
    ...mockItem,
    images: {
      smallIcon: '',
      icon: '',
    },
  };

  it('renders with multiple images', () => {
    render(<ItemImageCarousel brItemData={mockItem} />);
    // We should have a FlatList with images
    expect(screen.queryByText('No images available')).toBeNull();
  });

  it('shows pagination dots when multiple images', () => {
    render(<ItemImageCarousel brItemData={mockItem} />);
    // There should be pagination dots for multiple images
    const paginationContainer = screen.getByTestId('pagination-container');
    expect(paginationContainer).toBeTruthy();
  });

  it('renders with only icon image', () => {
    render(<ItemImageCarousel brItemData={itemWithOnlyIcon} />);
    // Should still render with just one image
    expect(screen.queryByText('No images available')).toBeNull();
  });

  it('shows no pagination when only one image', () => {
    render(<ItemImageCarousel brItemData={itemWithOnlyIcon} />);
    // There should be no pagination dots for a single image
    const paginationContainer = screen.queryByTestId('pagination-container');
    expect(paginationContainer).toBeNull();
  });

  it('shows fallback when no images available', () => {
    render(<ItemImageCarousel brItemData={itemWithNoImages} />);
    expect(screen.getByText('No images available')).toBeTruthy();
  });

  it('renders with series image when provided', () => {
    render(
      <ItemImageCarousel brItemData={mockItem} seriesImage="test-series.png" />
    );
    // Just check that it renders without errors
    expect(screen.queryByText('No images available')).toBeNull();
  });

  it('renders with gradient colors when provided', () => {
    render(
      <ItemImageCarousel
        brItemData={mockItem}
        gradientColors={['#ff0000', '#00ff00']}
      />
    );
    // Just check that it renders without errors
    expect(screen.queryByText('No images available')).toBeNull();
  });
});
