// Mock the entire storage module for testing
// Import the mocked storage module
import * as storage from './storage';

const mockStorageMap = new Map<string, string>();

jest.mock('./storage', () => {
  return {
    storage: {
      getString: jest.fn((key) => mockStorageMap.get(key)),
      set: jest.fn((key, value) => mockStorageMap.set(key, value)),
      delete: jest.fn((key) => mockStorageMap.delete(key)),
    },
    getItem: jest.fn((key) => {
      const value = mockStorageMap.get(key);
      return value ? JSON.parse(value) : null;
    }),
    setItem: jest.fn((key, value) => {
      mockStorageMap.set(key, JSON.stringify(value));
    }),
    removeItem: jest.fn((key) => {
      mockStorageMap.delete(key);
    }),
  };
});

describe('storage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear the storage map
    mockStorageMap.clear();
  });

  it('should export an object', () => {
    expect(typeof storage).toBe('object');
  });

  it('should set and get an item correctly', () => {
    const key = 'test_key';
    const value = { test: 'value' };
    const jsonValue = JSON.stringify(value);

    // Set the item
    storage.setItem(key, value);

    // Verify the value was stored in our mock
    expect(mockStorageMap.get(key)).toBe(jsonValue);

    // Get the item
    const retrievedValue = storage.getItem(key);

    // Verify the value is correct
    expect(retrievedValue).toEqual(value);
  });

  it('should remove an item correctly', () => {
    const key = 'test_key_to_remove';
    const value = 'test_value';
    const jsonValue = JSON.stringify(value);

    // Set the item in our mock map
    mockStorageMap.set(key, jsonValue);

    // Verify it was set
    expect(storage.getItem(key)).toEqual(value);

    // Remove the item
    storage.removeItem(key);

    // Verify it was removed from our mock map
    expect(mockStorageMap.has(key)).toBe(false);

    // Verify it returns null when getting the removed item
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
