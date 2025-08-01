import type { PaginateQuery } from '../pagination';
import { normalizePages } from './normalize-pages';

describe('normalizePages', () => {
  it('should return an empty array when pages is undefined', () => {
    const result = normalizePages(undefined);
    expect(result).toEqual([]);
  });

  it('should flatten pages into a single array of results', () => {
    const pages: PaginateQuery<number>[] = [
      {
        results: [1, 2, 3],
        count: 3,
        next: 'https://api.example.com/items?page=2',
        previous: null,
      },
      {
        results: [4, 5, 6],
        count: 3,
        next: 'https://api.example.com/items?page=3',
        previous: 'https://api.example.com/items?page=1',
      },
    ];

    const result = normalizePages(pages);
    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should handle empty results arrays', () => {
    const pages: PaginateQuery<number>[] = [
      {
        results: [],
        count: 0,
        next: null,
        previous: null,
      },
      {
        results: [],
        count: 0,
        next: null,
        previous: null,
      },
    ];

    const result = normalizePages(pages);
    expect(result).toEqual([]);
  });
});
