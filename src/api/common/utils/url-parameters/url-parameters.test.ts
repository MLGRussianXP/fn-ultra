import { getUrlParameters } from './url-parameters';

describe('getUrlParameters', () => {
  it('should return null when the URL is null', () => {
    const result = getUrlParameters(null);
    expect(result).toBeNull();
  });

  it('should extract query parameters from a URL', () => {
    const url = 'https://example.com/api?page=2&limit=10&sort=desc';
    const result = getUrlParameters(url);
    expect(result).toEqual({
      page: '2',
      limit: '10',
      sort: 'desc',
    });
  });

  it('should handle URLs with no query parameters', () => {
    const url = 'https://example.com/api';
    const result = getUrlParameters(url);
    expect(result).toEqual({});
  });

  it('should handle URLs with hash fragments', () => {
    const url = 'https://example.com/api?page=2&limit=10#section';
    const result = getUrlParameters(url);
    expect(result).toEqual({
      page: '2',
      limit: '10',
    });
  });

  it('should handle encoded parameter values', () => {
    const url =
      'https://example.com/api?name=John%20Doe&email=john%40example.com';
    const result = getUrlParameters(url);
    expect(result).toEqual({
      name: 'John%20Doe',
      email: 'john%40example.com',
    });
  });

  // This test is specifically to cover the branch where a parameter has no value
  it('should handle malformed query parameters', () => {
    const url = 'https://example.com/api?param=';
    const result = getUrlParameters(url);
    expect(result).toEqual({ param: '' });
  });
});
