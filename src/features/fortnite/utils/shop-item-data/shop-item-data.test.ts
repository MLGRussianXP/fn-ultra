/**
 * Tests for shop-item-data utilities
 * @module features/fortnite/utils/shop-item-data
 */

import type { ShopItem } from '@/api/fortnite/types';

import {
  getGradientColors,
  getMainItem,
  getSeriesImage,
  getShopItemData,
} from './shop-item-data';

// Test getShopItemData function
describe('getShopItemData', () => {
  it('returns correct data for entry', () => {
    const entry = {
      devName: 'Test',
      colors: undefined,
      regularPrice: 1000,
      finalPrice: 800,
      layout: { useWidePreview: false },
    } as ShopItem;

    const result = getShopItemData(entry);
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('mainItem');
    expect(result).toHaveProperty('image');
    expect(result).toHaveProperty('gradientColors');
    expect(result).toHaveProperty('hasColors');
    expect(result).toHaveProperty('seriesImage');
    expect(result).toHaveProperty('hasSeriesImage');
  });
});

// Test getSeriesImage function
describe('getSeriesImage', () => {
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
    } as unknown as ShopItem;

    const result = getSeriesImage(entry);
    expect(result).toBe('https://example.com/series-image.png');
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
    } as unknown as ShopItem;

    const result = getSeriesImage(entry);
    expect(result).toBeUndefined();
  });
});

// Test getMainItem function
describe('getMainItem', () => {
  it('returns the first brItem when available', () => {
    const brItem = { id: 'test-br-item' };
    const entry = {
      brItems: [brItem],
    } as unknown as ShopItem;

    const result = getMainItem(entry);
    expect(result).toBe(brItem);
  });

  it('returns the first instrument when no brItems are available', () => {
    const instrument = { id: 'test-instrument' };
    const entry = {
      instruments: [instrument],
    } as unknown as ShopItem;

    const result = getMainItem(entry);
    expect(result).toBe(instrument);
  });

  it('returns null when no items are available', () => {
    const entry = {} as ShopItem;

    const result = getMainItem(entry);
    expect(result).toBeNull();
  });
});

// Test getGradientColors function
describe('getGradientColors', () => {
  it('returns default colors when entry has no colors', () => {
    const entry = {
      colors: undefined,
    } as ShopItem;

    const result = getGradientColors(entry);
    expect(result).toEqual(['#6366f1', '#8b5cf6']);
  });

  it('returns converted colors when entry has colors', () => {
    const entry = {
      colors: {
        color1: 'ff0000ff', // Red with alpha
        color2: '00ff00ff', // Green with alpha
      },
    } as ShopItem;

    const result = getGradientColors(entry);
    expect(result).toEqual(['#ff0000', '#00ff00']);
  });
});
