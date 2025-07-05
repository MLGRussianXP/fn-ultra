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

  it('returns series image when available', () => {
    const entry = {
      devName: 'Test',
      colors: undefined,
      regularPrice: 1000,
      finalPrice: 800,
      layout: { useWidePreview: false },
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
    const { result } = renderHook(() => useShopItemData(entry as any));
    expect(result.current.seriesImage).toBe(
      'https://example.com/series-image.png'
    );
    expect(result.current.hasSeriesImage).toBe(true);
  });

  it('returns undefined for series image when not available', () => {
    const entry = {
      devName: 'Test',
      colors: undefined,
      regularPrice: 1000,
      finalPrice: 800,
      layout: { useWidePreview: false },
      brItems: [
        {
          series: {
            value: 'MARVEL SERIES',
            colors: ['ed1c24ff', 'd60203ff'],
            backendValue: 'MarvelSeries',
          },
        },
      ],
    };
    const { result } = renderHook(() => useShopItemData(entry as any));
    expect(result.current.seriesImage).toBeUndefined();
    expect(result.current.hasSeriesImage).toBe(false);
  });
});
