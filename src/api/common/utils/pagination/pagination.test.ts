import {
  DEFAULT_LIMIT,
  getNextPageParam,
  getPreviousPageParam,
  type PaginateQuery,
} from './pagination';

// Mock the getUrlParameters function
jest.mock('../url-parameters', () => ({
  getUrlParameters: jest.fn((url) => {
    if (!url) return null;
    if (url.includes('offset=10')) return { offset: '10' };
    if (url.includes('offset=20')) return { offset: '20' };
    return {};
  }),
}));

describe('pagination utils', () => {
  describe('DEFAULT_LIMIT', () => {
    it('should be 10', () => {
      expect(DEFAULT_LIMIT).toBe(10);
    });
  });

  describe('getPreviousPageParam', () => {
    it('should extract offset from previous URL', () => {
      const page: PaginateQuery<unknown> = {
        results: [],
        count: 0,
        next: null,
        previous: 'https://api.example.com/items?offset=10',
      };

      // @ts-ignore - we only need the first argument for our test
      const result = getPreviousPageParam(page);
      expect(result).toBe('10');
    });

    it('should return null when previous URL is null', () => {
      const page: PaginateQuery<unknown> = {
        results: [],
        count: 0,
        next: null,
        previous: null,
      };

      // @ts-ignore - we only need the first argument for our test
      const result = getPreviousPageParam(page);
      expect(result).toBeNull();
    });
  });

  describe('getNextPageParam', () => {
    it('should extract offset from next URL', () => {
      const page: PaginateQuery<unknown> = {
        results: [],
        count: 0,
        next: 'https://api.example.com/items?offset=20',
        previous: null,
      };

      // @ts-ignore - we only need the first argument for our test
      const result = getNextPageParam(page);
      expect(result).toBe('20');
    });

    it('should return null when next URL is null', () => {
      const page: PaginateQuery<unknown> = {
        results: [],
        count: 0,
        next: null,
        previous: null,
      };

      // @ts-ignore - we only need the first argument for our test
      const result = getNextPageParam(page);
      expect(result).toBeNull();
    });
  });
});
