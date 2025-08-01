import { getQueryKey } from './query-key';

describe('getQueryKey', () => {
  it('should return an array with only the key when no params are provided', () => {
    const result = getQueryKey('test');
    expect(result).toEqual(['test']);
  });

  it('should return an array with the key and params when params are provided', () => {
    const params = { id: 1, name: 'test' };
    const result = getQueryKey('test', params);
    expect(result).toEqual(['test', params]);
  });

  it('should handle empty object params', () => {
    const params = {};
    const result = getQueryKey('test', params);
    expect(result).toEqual(['test', params]);
  });
});
