import { renderHook } from '@testing-library/react-native';

import { useShopItemData } from './use-shop-item-data';

describe('useShopItemData', () => {
  it('returns correct data for entry', () => {
    const entry = {
      devName: 'Test',
      colors: undefined,
      regularPrice: 1000,
      finalPrice: 800,
      layout: { useWidePreview: false },
    };
    const { result } = renderHook(() => useShopItemData(entry as any));
    expect(result.current).toHaveProperty('title');
  });
});
