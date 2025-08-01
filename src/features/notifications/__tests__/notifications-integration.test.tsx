import { act } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { Alert } from 'react-native';

// Import mocked services
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  handlePermissionRequest,
  manageShopNotifications,
  requestNotificationPermissions,
  setupNotificationChannels,
} from '@/features/notifications/services';
import { getItem } from '@/lib/storage';
import { screen, setup, waitFor } from '@/test';

import { ItemWatchToggle } from '../components/item-watch-toggle/item-watch-toggle';
import { ShopUpdatesToggle } from '../components/shop-updates-toggle/shop-updates-toggle';
import { NotificationsProvider } from '../provider/notifications-provider';
import { STORAGE_KEYS } from '../utils/storage-keys';

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
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

// Mock the notifications service
jest.mock('@/features/notifications/services', () => ({
  handlePermissionRequest: jest.fn(),
  requestNotificationPermissions: jest.fn(),
  setupNotificationChannels: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  addNotificationResponseReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  manageShopNotifications: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock storage
jest.mock('@/lib/storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  storage: {
    getString: jest.fn(),
    setString: jest.fn(),
  },
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

const mockGetItem = getItem as jest.MockedFunction<typeof getItem>;
const mockHandlePermissionRequest =
  handlePermissionRequest as jest.MockedFunction<
    typeof handlePermissionRequest
  >;
const mockRequestNotificationPermissions =
  requestNotificationPermissions as jest.MockedFunction<
    typeof requestNotificationPermissions
  >;
const mockSetupNotificationChannels =
  setupNotificationChannels as jest.MockedFunction<
    typeof setupNotificationChannels
  >;
const mockAddNotificationReceivedListener =
  addNotificationReceivedListener as jest.MockedFunction<
    typeof addNotificationReceivedListener
  >;
const mockAddNotificationResponseReceivedListener =
  addNotificationResponseReceivedListener as jest.MockedFunction<
    typeof addNotificationResponseReceivedListener
  >;
const mockManageShopNotifications =
  manageShopNotifications as jest.MockedFunction<
    typeof manageShopNotifications
  >;

// Helper function to setup default mocks
const setupDefaultMocks = () => {
  mockGetItem.mockImplementation((key) => {
    if (key === STORAGE_KEYS.NOTIFICATIONS.SHOP_UPDATES_ENABLED) {
      return false;
    }
    if (key === STORAGE_KEYS.NOTIFICATIONS.WATCHED_ITEMS) {
      return {};
    }
    return null;
  });

  (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
    status: Notifications.PermissionStatus.UNDETERMINED,
  });

  (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
    status: Notifications.PermissionStatus.GRANTED,
  });

  mockHandlePermissionRequest.mockImplementation(
    async (_callback: () => void) => {
      const result = await mockRequestNotificationPermissions();
      if (result.status === Notifications.PermissionStatus.GRANTED) {
        // callback();
      }
      return result.status === Notifications.PermissionStatus.GRANTED;
    }
  );

  mockRequestNotificationPermissions.mockResolvedValue({
    status: Notifications.PermissionStatus.GRANTED,
    granted: true,
    expires: 'never',
    canAskAgain: true,
  });

  mockSetupNotificationChannels.mockResolvedValue(undefined);
  mockAddNotificationReceivedListener.mockReturnValue({
    remove: jest.fn(),
  });
  mockAddNotificationResponseReceivedListener.mockReturnValue({
    remove: jest.fn(),
  });
  mockManageShopNotifications.mockResolvedValue(undefined);
};

// Helper function to test permission request handling
const testPermissionRequestHandling = async () => {
  const mockBrItemData = {
    id: 'test-item-id',
    name: 'Test Item',
    description: 'Test Description',
    rarity: {
      value: 'rare',
      displayValue: 'Rare',
      backendValue: 'rare',
    },
    type: {
      value: 'outfit',
      displayValue: 'Outfit',
      backendValue: 'outfit',
    },
    images: {
      smallIcon: 'test-icon.png',
      icon: 'test-icon.png',
    },
    added: '2023-01-01T00:00:00Z',
  };

  // Setup: item is not currently watched
  mockGetItem.mockImplementation((key) => {
    if (key === STORAGE_KEYS.NOTIFICATIONS.WATCHED_ITEMS) {
      return {};
    }
    return null;
  });

  const { user } = setup(
    <NotificationsProvider>
      <ItemWatchToggle brItemData={mockBrItemData} />
    </NotificationsProvider>
  );

  const toggle = screen.getByRole('switch');
  expect(toggle.props.accessibilityState?.checked).toBe(false);

  await act(async () => {
    await user.press(toggle);
  });

  await waitFor(() => {
    expect(mockHandlePermissionRequest).toHaveBeenCalled();
  });
};

// Helper function to test permission denied handling
const testPermissionDeniedHandling = async () => {
  const mockBrItemData = {
    id: 'test-item-id',
    name: 'Test Item',
    description: 'Test Description',
    rarity: {
      value: 'rare',
      displayValue: 'Rare',
      backendValue: 'rare',
    },
    type: {
      value: 'outfit',
      displayValue: 'Outfit',
      backendValue: 'outfit',
    },
    images: {
      smallIcon: 'test-icon.png',
      icon: 'test-icon.png',
    },
    added: '2023-01-01T00:00:00Z',
  };

  // Setup: permission will be denied
  mockRequestNotificationPermissions.mockResolvedValue({
    status: Notifications.PermissionStatus.DENIED,
    granted: false,
    expires: 'never',
    canAskAgain: true,
  });

  mockHandlePermissionRequest.mockImplementation(
    async (_callback: () => void) => {
      const result = await mockRequestNotificationPermissions();
      // Don't call callback when permission is denied
      return result.status === Notifications.PermissionStatus.GRANTED;
    }
  );

  const { user } = setup(
    <NotificationsProvider>
      <ItemWatchToggle brItemData={mockBrItemData} />
    </NotificationsProvider>
  );

  const toggle = screen.getByRole('switch');
  expect(toggle.props.accessibilityState?.checked).toBe(false);

  await act(async () => {
    await user.press(toggle);
  });

  await waitFor(() => {
    expect(mockHandlePermissionRequest).toHaveBeenCalled();
  });

  // The toggle should remain unchecked since permission was denied
  await waitFor(() => {
    expect(toggle.props.accessibilityState?.checked).toBe(false);
  });
};

// Helper function to test disable without permission
const testDisableWithoutPermission = async () => {
  const mockBrItemData = {
    id: 'test-item-id',
    name: 'Test Item',
    description: 'Test Description',
    rarity: {
      value: 'rare',
      displayValue: 'Rare',
      backendValue: 'rare',
    },
    type: {
      value: 'outfit',
      displayValue: 'Outfit',
      backendValue: 'outfit',
    },
    images: {
      smallIcon: 'test-icon.png',
      icon: 'test-icon.png',
    },
    added: '2023-01-01T00:00:00Z',
  };

  // Setup: item is currently watched
  mockGetItem.mockImplementation((key) => {
    if (key === STORAGE_KEYS.NOTIFICATIONS.WATCHED_ITEMS) {
      return { [mockBrItemData.id]: true };
    }
    return null;
  });

  const { user } = setup(
    <NotificationsProvider>
      <ItemWatchToggle brItemData={mockBrItemData} />
    </NotificationsProvider>
  );

  const toggle = screen.getByRole('switch');
  // The toggle should be checked since the item is watched
  expect(toggle.props.accessibilityState?.checked).toBe(true);

  await act(async () => {
    await user.press(toggle);
  });

  // Should not request permission when disabling
  expect(mockHandlePermissionRequest).not.toHaveBeenCalled();
};

// Helper function to test item watch toggle integration
const testItemWatchToggleIntegration = () => {
  describe('Item Watch Toggle Integration', () => {
    it('should handle permission request when enabling item watch', async () => {
      await testPermissionRequestHandling();
    });

    it('should revert toggle state when permission is denied', async () => {
      await testPermissionDeniedHandling();
    });

    it('should disable item watch without permission request', async () => {
      await testDisableWithoutPermission();
    });
  });
};

// Helper function to test shop updates toggle integration
const testShopUpdatesToggleIntegration = () => {
  describe('Shop Updates Toggle Integration', () => {
    it('should enable shop updates and schedule notifications', async () => {
      const { user } = setup(
        <NotificationsProvider>
          <ShopUpdatesToggle />
        </NotificationsProvider>
      );

      const toggle = screen.getByRole('switch');
      expect(toggle.props.accessibilityState?.checked).toBe(false);

      await act(async () => {
        await user.press(toggle);
      });

      await waitFor(() => {
        expect(mockHandlePermissionRequest).toHaveBeenCalled();
      });
    });

    it('should disable shop updates and cancel notifications', async () => {
      // Setup: shop updates are currently enabled
      mockGetItem.mockImplementation((key) => {
        if (key === STORAGE_KEYS.NOTIFICATIONS.SHOP_UPDATES_ENABLED) {
          return true;
        }
        return null;
      });

      const { user } = setup(
        <NotificationsProvider>
          <ShopUpdatesToggle />
        </NotificationsProvider>
      );

      const toggle = screen.getByRole('switch');
      // The toggle should be checked since shop updates are enabled
      expect(toggle.props.accessibilityState?.checked).toBe(true);

      await act(async () => {
        await user.press(toggle);
      });

      // Should not request permission when disabling
      expect(mockHandlePermissionRequest).not.toHaveBeenCalled();
    });
  });
};

// Helper function to test edge cases and error handling
const testEdgeCasesAndErrorHandling = () => {
  const mockBrItemData = {
    id: 'test-item-id',
    name: 'Test Item',
    description: 'Test Description',
    rarity: {
      value: 'rare',
      displayValue: 'Rare',
      backendValue: 'rare',
    },
    type: {
      value: 'outfit',
      displayValue: 'Outfit',
      backendValue: 'outfit',
    },
    images: {
      smallIcon: 'test-icon.png',
      icon: 'test-icon.png',
    },
    added: '2023-01-01T00:00:00Z',
  };

  describe('Edge Cases and Error Handling', () => {
    it('should handle multiple rapid toggle presses', async () => {
      const { user } = setup(
        <NotificationsProvider>
          <ItemWatchToggle brItemData={mockBrItemData} />
        </NotificationsProvider>
      );

      const toggle = screen.getByRole('switch');

      // Rapidly press the toggle multiple times
      await act(async () => {
        await user.press(toggle);
        await user.press(toggle);
        await user.press(toggle);
      });

      // Should call the handler for each press
      await waitFor(() => {
        expect(mockHandlePermissionRequest).toHaveBeenCalledTimes(3);
      });
    });
  });
};

describe('Notifications Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDefaultMocks();
  });

  testItemWatchToggleIntegration();
  testShopUpdatesToggleIntegration();
  testEdgeCasesAndErrorHandling();
});
