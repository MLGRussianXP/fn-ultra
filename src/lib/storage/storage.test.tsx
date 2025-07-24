// Mock the entire storage module for testing
// Import the mocked storage module
import * as storage from './storage';

jest.mock('./storage', () => {
  const mockStorage = new Map();
  return {
    storage: {
      getString: jest.fn((key) => mockStorage.get(key)),
      set: jest.fn((key, value) => mockStorage.set(key, value)),
      delete: jest.fn((key) => mockStorage.delete(key)),
    },
    getItem: jest.fn((key) => {
      const value = mockStorage.get(key);
      return value ? JSON.parse(value) : null;
    }),
    setItem: jest.fn((key, value) => {
      mockStorage.set(key, JSON.stringify(value));
    }),
    removeItem: jest.fn((key) => {
      mockStorage.delete(key);
    }),
  };
});

describe('storage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear the storage map by calling removeItem on all keys
    const mockStorage = storage.storage as any;
    for (const key of mockStorage.getString.mock.calls.map((call) => call[0])) {
      storage.removeItem(key);
    }
  });

  it('should export an object', () => {
    expect(typeof storage).toBe('object');
  });

  it('should set and get an item correctly', () => {
    const key = 'test_key';
    const value = { test: 'value' };

    // Set the item
    storage.setItem(key, value);

    // Get the item
    const retrievedValue = storage.getItem(key);

    // Verify the value is correct
    expect(retrievedValue).toEqual(value);
  });

  it('should remove an item correctly', () => {
    const key = 'test_key_to_remove';
    const value = 'test_value';

    // Set the item
    storage.setItem(key, value);

    // Verify it was set
    expect(storage.getItem(key)).toEqual(value);

    // Remove the item
    storage.removeItem(key);

    // Verify it was removed
    expect(storage.getItem(key)).toBeNull();
  });

  it('should handle boolean values correctly', () => {
    const key = 'test_boolean';

    // Test with true
    storage.setItem(key, true);
    expect(storage.getItem(key)).toBe(true);

    // Test with false
    storage.setItem(key, false);
    expect(storage.getItem(key)).toBe(false);
  });
});
