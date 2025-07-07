import { fireEvent, render, screen } from '@testing-library/react-native';

import { ItemImageCarousel } from './item-image-carousel';

const mockItem = {
  id: 'test-item',
  name: 'Test Item',
  description: 'Test description',
  type: {
    value: 'outfit',
    displayValue: 'Outfit',
    backendValue: 'AthenaCharacter',
  },
  rarity: {
    value: 'legendary',
    displayValue: 'Legendary',
    backendValue: 'EFortRarity::Legendary',
  },
  images: {
    smallIcon: 'https://example.com/small-icon.png',
    icon: 'https://example.com/icon.png',
    featured: 'https://example.com/featured.png',
  },
  variants: [
    {
      channel: 'Material',
      type: 'Material',
      options: [
        {
          tag: 'Material1',
          name: 'Default',
          unlockRequirements: '',
          image: 'https://example.com/variant1.png',
        },
      ],
    },
  ],
  added: '2023-01-01',
};

describe('ItemImageCarousel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders featured image when available', () => {
    render(<ItemImageCarousel item={mockItem as any} />);

    expect(screen.getByTestId('carousel-image-0')).toBeTruthy();
    expect(screen.getByTestId('image-carousel')).toBeTruthy();
  });

  it('shows image counter when multiple images are available', () => {
    render(<ItemImageCarousel item={mockItem as any} />);

    expect(screen.getByText('1 / 2')).toBeTruthy(); // featured + icon
  });

  it('handles item with only icon image', () => {
    const itemWithOnlyIcon = {
      ...mockItem,
      images: {
        smallIcon: 'https://example.com/small-icon.png',
        icon: 'https://example.com/icon.png',
      },
      variants: undefined,
    };

    render(<ItemImageCarousel item={itemWithOnlyIcon as any} />);

    expect(screen.getByTestId('carousel-image-0')).toBeTruthy();
    expect(screen.queryByText(/1 \/ 1/)).toBeFalsy();
  });

  it('handles item with no images', () => {
    const itemWithNoImages = {
      ...mockItem,
      images: {
        smallIcon: '',
        icon: '',
      },
      variants: undefined,
    };

    render(<ItemImageCarousel item={itemWithNoImages as any} />);

    expect(screen.getByText('No images available')).toBeTruthy();
  });

  it('handles scroll events correctly', () => {
    render(<ItemImageCarousel item={mockItem as any} />);

    const carousel = screen.getByTestId('image-carousel');

    fireEvent(carousel, 'onMomentumScrollEnd', {
      nativeEvent: {
        contentOffset: { x: 375 }, // screen width
      },
    });

    expect(screen.getByText('2 / 2')).toBeTruthy();
  });
});
