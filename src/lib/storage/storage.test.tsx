import * as storage from './storage';

describe('storage', () => {
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
