import { act, renderHook } from '@testing-library/react-native';
import * as React from 'react';

import * as storage from '@/lib/storage';

import { STORAGE_KEYS } from './storage-keys';

// Mock the storage module
jest.mock('@/lib/storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Create a simple hook to test the watched items functionality
const useWatchedItemsPreference = () => {
  const [watchedItems, setWatchedItems] = React.useState<
    Record<string, boolean>
  >({});

  // Load preference
  const loadWatchedItemsPreference = React.useCallback(() => {
    const savedWatchedItems = storage.getItem<Record<string, boolean>>(
      STORAGE_KEYS.NOTIFICATIONS.WATCHED_ITEMS
    );
    if (savedWatchedItems !== null) {
      setWatchedItems(savedWatchedItems);
    }
  }, []);

  // Toggle function
  const toggleItemWatch = React.useCallback(
    (itemId: string, watched: boolean) => {
      setWatchedItems((prev) => {
        const updated = { ...prev, [itemId]: watched };

        // If not watched anymore, remove from the object
        if (!watched && itemId in updated) {
          delete updated[itemId];
        }

        // Save to storage
        storage.setItem(STORAGE_KEYS.NOTIFICATIONS.WATCHED_ITEMS, updated);

        return updated;
      });
    },
    []
  );

  const isItemWatched = React.useCallback(
    (itemId: string) => Boolean(watchedItems[itemId]),
    [watchedItems]
  );

  return {
    watchedItems,
    loadWatchedItemsPreference,
    toggleItemWatch,
    isItemWatched,
  };
};

// Helper function to setup watched items tests
const setupWatchedItemsTest = (
  initialItems: Record<string, boolean> | null = null
) => {
  // Mock storage.getItem to return the initial items
  (storage.getItem as jest.Mock).mockReturnValue(initialItems);

  // Render the hook
  const { result } = renderHook(() => useWatchedItemsPreference());

  return { result };
};

describe('Watched Items Storage - Loading', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load watched items from storage', () => {
    // Mock watched items
    const mockWatchedItems = { 'item-1': true, 'item-2': true };
    const { result } = setupWatchedItemsTest(mockWatchedItems);

    // Call loadWatchedItemsPreference to load items from storage
    act(() => {
      result.current.loadWatchedItemsPreference();
    });

    // Verify that getItem was called with the correct key
    expect(storage.getItem).toHaveBeenCalledWith(
      STORAGE_KEYS.NOTIFICATIONS.WATCHED_ITEMS
    );

    // Verify that the watched items were loaded correctly
    expect(result.current.watchedItems).toEqual(mockWatchedItems);
  });

  it('should not update state if storage returns null', () => {
    // Mock storage.getItem to return null
    const { result } = setupWatchedItemsTest(null);

    // Call loadWatchedItemsPreference
    act(() => {
      result.current.loadWatchedItemsPreference();
    });

    // Verify that getItem was called with the correct key
    expect(storage.getItem).toHaveBeenCalledWith(
      STORAGE_KEYS.NOTIFICATIONS.WATCHED_ITEMS
    );

    // Verify that the watched items state remains empty
    expect(result.current.watchedItems).toEqual({});
  });
});

describe('Watched Items Storage - Adding and Removing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add an item to watched items', () => {
    // Render the hook
    const { result } = renderHook(() => useWatchedItemsPreference());

    // Add an item to watched items
    act(() => {
      result.current.toggleItemWatch('item-1', true);
    });

    // Verify that setItem was called with the correct key and value
    expect(storage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.NOTIFICATIONS.WATCHED_ITEMS,
      { 'item-1': true }
    );

    // Verify that the watched items state was updated
    expect(result.current.watchedItems).toEqual({ 'item-1': true });
  });

  it('should remove an item from watched items', () => {
    // Start with an item in the watched items
    const initialState = { 'item-1': true };
    (storage.getItem as jest.Mock).mockReturnValue(initialState);

    // Render the hook
    const { result } = renderHook(() => useWatchedItemsPreference());

    // Load the initial state
    act(() => {
      result.current.loadWatchedItemsPreference();
    });

    // Remove the item from watched items
    act(() => {
      result.current.toggleItemWatch('item-1', false);
    });

    // Verify that setItem was called with the correct key and value (empty object)
    expect(storage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.NOTIFICATIONS.WATCHED_ITEMS,
      {}
    );

    // Verify that the watched items state was updated
    expect(result.current.watchedItems).toEqual({});
  });
});

describe('Watched Items Storage - Status Checking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly identify if an item is watched', () => {
    // Start with some items in the watched items
    const initialState = { 'item-1': true, 'item-2': true };
    (storage.getItem as jest.Mock).mockReturnValue(initialState);

    // Render the hook
    const { result } = renderHook(() => useWatchedItemsPreference());

    // Load the initial state
    act(() => {
      result.current.loadWatchedItemsPreference();
    });

    // Check if items are watched
    expect(result.current.isItemWatched('item-1')).toBe(true);
    expect(result.current.isItemWatched('item-2')).toBe(true);
    expect(result.current.isItemWatched('item-3')).toBe(false);
  });

  it('should update watched items when toggling multiple items', () => {
    // Render the hook
    const { result } = renderHook(() => useWatchedItemsPreference());

    // Add multiple items to watched items
    act(() => {
      result.current.toggleItemWatch('item-1', true);
    });

    act(() => {
      result.current.toggleItemWatch('item-2', true);
    });

    // Verify the state after adding items
    expect(result.current.watchedItems).toEqual({
      'item-1': true,
      'item-2': true,
    });

    // Remove one item
    act(() => {
      result.current.toggleItemWatch('item-1', false);
    });

    // Verify the state after removing an item
    expect(result.current.watchedItems).toEqual({ 'item-2': true });

    // Verify that setItem was called with the correct values
    expect(storage.setItem).toHaveBeenNthCalledWith(
      3,
      STORAGE_KEYS.NOTIFICATIONS.WATCHED_ITEMS,
      { 'item-2': true }
    );
  });
});
