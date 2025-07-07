import * as utils from './utils';
describe('utils', () => {
  it('should export an object', () => {
    expect(typeof utils).toBe('object');
  });
});

describe('countItemsInEntry', () => {
  it('should count single brItem correctly', () => {
    const entry = {
      brItems: [{ id: '1', name: 'Test Item' }],
    };
    expect(utils.countItemsInEntry(entry)).toBe(1);
  });

  it('should count multiple brItems correctly', () => {
    const entry = {
      brItems: [
        { id: '1', name: 'Test Item 1' },
        { id: '2', name: 'Test Item 2' },
      ],
    };
    expect(utils.countItemsInEntry(entry)).toBe(2);
  });

  it('should count items from different arrays correctly', () => {
    const entry = {
      brItems: [{ id: '1', name: 'Test Item' }],
      tracks: [{ id: '2', title: 'Test Track' }],
      instruments: [{ id: '3', name: 'Test Instrument' }],
    };
    expect(utils.countItemsInEntry(entry)).toBe(3);
  });

  it('should return 0 for entry with no items', () => {
    const entry = {};
    expect(utils.countItemsInEntry(entry)).toBe(0);
  });

  it('should handle undefined arrays gracefully', () => {
    const entry = {
      brItems: undefined,
      tracks: undefined,
    };
    expect(utils.countItemsInEntry(entry)).toBe(0);
  });
});

describe('isSingleItemEntry', () => {
  it('should return true for single item entry', () => {
    const entry = {
      brItems: [{ id: '1', name: 'Test Item' }],
    };
    expect(utils.isSingleItemEntry(entry)).toBe(true);
  });

  it('should return false for multiple items entry', () => {
    const entry = {
      brItems: [
        { id: '1', name: 'Test Item 1' },
        { id: '2', name: 'Test Item 2' },
      ],
    };
    expect(utils.isSingleItemEntry(entry)).toBe(false);
  });

  it('should return false for entry with items from different arrays', () => {
    const entry = {
      brItems: [{ id: '1', name: 'Test Item' }],
      tracks: [{ id: '2', title: 'Test Track' }],
    };
    expect(utils.isSingleItemEntry(entry)).toBe(false);
  });

  it('should return false for entry with no items', () => {
    const entry = {};
    expect(utils.isSingleItemEntry(entry)).toBe(false);
  });
});
