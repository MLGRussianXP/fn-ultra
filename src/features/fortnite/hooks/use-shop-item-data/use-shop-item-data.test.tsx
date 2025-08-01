/**
 * Tests for use-shop-item-data hook
 * @module features/fortnite/hooks/use-shop-item-data
 */

import { renderHook } from '@testing-library/react-native';

import type { ShopItem } from '@/api/fortnite/types';
import * as shopItemDataUtils from '@/features/fortnite/utils/shop-item-data';

import { useShopItemData } from './use-shop-item-data';

// Mock the shop-item-data utilities
jest.mock('@/features/fortnite/utils/shop-item-data', () => ({
  getShopItemData: jest.fn(),
}));

describe('useShopItemData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls getShopItemData with the provided entry', () => {
    const mockEntry = { id: 'test-entry' } as unknown as ShopItem;
    const mockResult = {
      mainItem: null,
      title: 'Test Item',
      image: 'test-image.png',
      gradientColors: ['#ff0000', '#00ff00'] as [string, string],
      hasColors: true,
      seriesImage: 'series-image.png',
      hasSeriesImage: true,
    };

    // Set up the mock implementation
    (shopItemDataUtils.getShopItemData as jest.Mock).mockReturnValue(
      mockResult
    );

    // Render the hook
    const { result } = renderHook(() => useShopItemData(mockEntry));

    // Verify the result
    expect(shopItemDataUtils.getShopItemData).toHaveBeenCalledWith(mockEntry);
    expect(result.current).toEqual(mockResult);
  });
});
