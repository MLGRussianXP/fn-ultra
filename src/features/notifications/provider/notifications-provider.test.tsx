import { act, renderHook } from '@testing-library/react-native';
import * as React from 'react';

import * as storage from '@/lib/storage';

import { STORAGE_KEYS } from '../utils/storage-keys';
import {
  NotificationsProvider,
  useNotifications,
} from './notifications-provider';

// Mock the storage module
jest.mock('@/lib/storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock the expo-notifications module with PermissionStatus enum
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  getPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  addNotificationResponseReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  PermissionStatus: {
    GRANTED: 'granted',
    DENIED: 'denied',
    UNDETERMINED: 'undetermined',
  },
}));

// Mock the notifications services
jest.mock('../services', () => ({
  addNotificationReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  addNotificationResponseReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  requestNotificationPermissions: jest.fn().mockResolvedValue(true),
  setupNotificationChannels: jest.fn(),
}));

// Create a wrapper for the hooks
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NotificationsProvider>{children}</NotificationsProvider>
);

// Helper function to mock storage for watched items
const mockStorageWithWatchedItems = (
  watchedItems: Record<string, boolean> | null
) => {
  (storage.getItem as jest.Mock).mockImplementation((key) => {
    if (key === STORAGE_KEYS.NOTIFICATIONS.WATCHED_ITEMS) {
      return watchedItems;
    }
    return null;
  });
};

// Helper function to render the hook and wait for initialization
const renderNotificationsHook = async () => {
  const view = renderHook(() => useNotifications(), { wrapper });

  // Wait for the provider to initialize
  await act(async () => {
    await Promise.resolve();
  });

  return view;
};

describe('NotificationsProvider - Watched Items', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty watched items', async () => {
    // Mock storage.getItem to return null (no saved watched items)
    mockStorageWithWatchedItems(null);

    // Render the hook with the provider
    const { result } = await renderNotificationsHook();

    // Verify that the watched items are empty
    expect(result.current.watchedItems).toEqual({});
  });

  it('should load watched items from storage', async () => {
    // Mock storage.getItem to return some watched items
    const mockWatchedItems = {
      'item-1': true,
      'item-2': true,
    };
    mockStorageWithWatchedItems(mockWatchedItems);

    // Render the hook with the provider
    const { result } = await renderNotificationsHook();

    // Verify that the watched items were loaded correctly
    expect(result.current.watchedItems).toEqual(mockWatchedItems);
  });
});

// Tests for adding items
describe('NotificationsProvider - Adding Watched Items', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add an item to watched items', async () => {
    // Mock storage.getItem to return empty watched items
    mockStorageWithWatchedItems({});

    // Render the hook with the provider
    const { result } = await renderNotificationsHook();

    // Add an item to watched items
    await act(async () => {
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
});

// Tests for removing items
describe('NotificationsProvider - Removing Watched Items', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should remove an item from watched items', async () => {
    // Mock storage.getItem to return some watched items
    const mockWatchedItems = {
      'item-1': true,
      'item-2': true,
    };
    mockStorageWithWatchedItems(mockWatchedItems);

    // Render the hook with the provider
    const { result } = await renderNotificationsHook();

    // Remove an item from watched items
    await act(async () => {
      result.current.toggleItemWatch('item-1', false);
    });

    // Verify that setItem was called with the correct key and value
    expect(storage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.NOTIFICATIONS.WATCHED_ITEMS,
      { 'item-2': true }
    );

    // Verify that the watched items state was updated
    expect(result.current.watchedItems).toEqual({ 'item-2': true });
  });
});

// Tests for checking watched status
describe('NotificationsProvider - Checking Watched Status', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly identify if an item is watched', async () => {
    // Mock storage.getItem to return some watched items
    const mockWatchedItems = {
      'item-1': true,
      'item-2': true,
    };
    mockStorageWithWatchedItems(mockWatchedItems);

    // Render the hook with the provider
    const { result } = await renderNotificationsHook();

    // Check if items are watched
    expect(result.current.isItemWatched('item-1')).toBe(true);
    expect(result.current.isItemWatched('item-2')).toBe(true);
    expect(result.current.isItemWatched('item-3')).toBe(false);
  });
});

// Tests for multiple operations
describe('NotificationsProvider - Multiple Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle toggling multiple items', async () => {
    // Mock storage.getItem to return empty watched items
    mockStorageWithWatchedItems({});

    // Render the hook with the provider
    const { result } = await renderNotificationsHook();

    // Add multiple items to watched items
    await act(async () => {
      result.current.toggleItemWatch('item-1', true);
    });

    await act(async () => {
      result.current.toggleItemWatch('item-2', true);
    });

    // Verify the state after adding items
    expect(result.current.watchedItems).toEqual({
      'item-1': true,
      'item-2': true,
    });

    // Remove one item
    await act(async () => {
      result.current.toggleItemWatch('item-1', false);
    });

    // Verify the state after removing an item
    expect(result.current.watchedItems).toEqual({ 'item-2': true });
  });

  it('should persist watched items between renders', async () => {
    // Mock storage.getItem to return some watched items initially
    const mockWatchedItems = { 'item-1': true };
    mockStorageWithWatchedItems(mockWatchedItems);

    // Render the hook with the provider
    const { result, rerender } = renderHook(() => useNotifications(), {
      wrapper,
    });

    // Wait for the provider to initialize
    await act(async () => {
      await Promise.resolve();
    });

    // Verify initial state
    expect(result.current.watchedItems).toEqual(mockWatchedItems);

    // Add another item
    await act(async () => {
      result.current.toggleItemWatch('item-2', true);
    });

    // Rerender the hook with the same props
    rerender({ wrapper });

    // Verify that the state persists after rerender
    expect(result.current.watchedItems).toEqual({
      'item-1': true,
      'item-2': true,
    });
  });
});
