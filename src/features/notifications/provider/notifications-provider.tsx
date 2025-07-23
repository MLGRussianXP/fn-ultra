import * as Notifications from 'expo-notifications';
import React from 'react';
import { AppState } from 'react-native';

import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  requestNotificationPermissions,
  setupNotificationChannels,
} from '@/features/notifications/services';
import { STORAGE_KEYS } from '@/features/notifications/utils/storage-keys';
import { getItem, setItem } from '@/lib/storage';

type WatchedItems = Record<string, boolean>;

interface NotificationsContextType {
  shopUpdatesEnabled: boolean;
  watchedItems: WatchedItems;
  permissionStatus: Notifications.PermissionStatus | null;
  isPermissionLoading: boolean;
  toggleShopUpdates: (enabled: boolean) => void;
  toggleItemWatch: (itemId: string, watched: boolean) => void;
  isItemWatched: (itemId: string) => boolean;
  requestPermissions: () => Promise<boolean>;
  hasPermissions: boolean;
}

const NotificationsContext = React.createContext<NotificationsContextType>({
  shopUpdatesEnabled: false,
  watchedItems: {},
  permissionStatus: null,
  isPermissionLoading: false,
  toggleShopUpdates: () => {},
  toggleItemWatch: () => {},
  isItemWatched: () => false,
  requestPermissions: async () => false,
  hasPermissions: false,
});

// Handle notification response
const handleNotificationResponse = (
  response: Notifications.NotificationResponse
) => {
  console.log('Notification response received:', response);
  // Handle notification tap here
  const { notification } = response;
  const data = notification.request.content.data;

  // Handle different notification types
  if (data.type === 'shop_update') {
    // Navigate to shop screen
    console.log('Shop update notification tapped');
  } else if (data.type === 'item_watch' && data.itemId) {
    // Navigate to item details screen
    console.log('Item watch notification tapped:', data.itemId);
  }
};

// Permission checking hook
const usePermissionCheck = () => {
  const [permissionStatus, setPermissionStatus] =
    React.useState<Notifications.PermissionStatus | null>(null);
  const [isPermissionLoading, setIsPermissionLoading] = React.useState(false);

  const hasPermissions = React.useMemo(
    () => permissionStatus === Notifications.PermissionStatus.GRANTED,
    [permissionStatus]
  );

  // Check permissions status
  const checkPermissions = React.useCallback(async () => {
    try {
      setIsPermissionLoading(true);
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
      return status;
    } catch (error) {
      console.error('Failed to check notification permissions:', error);
      return Notifications.PermissionStatus.UNDETERMINED;
    } finally {
      setIsPermissionLoading(false);
    }
  }, []);

  return {
    permissionStatus,
    setPermissionStatus,
    isPermissionLoading,
    setIsPermissionLoading,
    hasPermissions,
    checkPermissions,
  };
};

// Permission request hook
const usePermissionRequest = (
  checkPermissions: () => Promise<Notifications.PermissionStatus>,
  setIsPermissionLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPermissionStatus: React.Dispatch<
    React.SetStateAction<Notifications.PermissionStatus | null>
  >
) => {
  return React.useCallback(async () => {
    try {
      setIsPermissionLoading(true);
      const result = await requestNotificationPermissions();
      const granted = result.status === Notifications.PermissionStatus.GRANTED;

      // Update permission status
      setPermissionStatus(result.status);

      // If permissions were granted, make sure to check again after a short delay
      if (granted) {
        setTimeout(async () => {
          await checkPermissions();
        }, 300);
      }

      return granted;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    } finally {
      setIsPermissionLoading(false);
    }
  }, [checkPermissions, setIsPermissionLoading, setPermissionStatus]);
};

// Shop updates preference hook
const useShopUpdatesPreference = () => {
  const [shopUpdatesEnabled, setShopUpdatesEnabled] = React.useState(false);

  // Load preference
  const loadShopUpdatesPreference = React.useCallback(() => {
    const savedShopUpdates = getItem<boolean>(
      STORAGE_KEYS.NOTIFICATIONS.SHOP_UPDATES_ENABLED
    );
    if (savedShopUpdates !== null) {
      setShopUpdatesEnabled(savedShopUpdates);
    }
  }, []);

  // Toggle function
  const toggleShopUpdates = React.useCallback((enabled: boolean) => {
    setShopUpdatesEnabled(enabled);
    setItem(STORAGE_KEYS.NOTIFICATIONS.SHOP_UPDATES_ENABLED, enabled);
  }, []);

  return {
    shopUpdatesEnabled,
    loadShopUpdatesPreference,
    toggleShopUpdates,
  };
};

// Watched items preference hook
const useWatchedItemsPreference = () => {
  const [watchedItems, setWatchedItems] = React.useState<WatchedItems>({});

  // Load preference
  const loadWatchedItemsPreference = React.useCallback(() => {
    const savedWatchedItems = getItem<WatchedItems>(
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
        setItem(STORAGE_KEYS.NOTIFICATIONS.WATCHED_ITEMS, updated);

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

// Setup notification channels
const useNotificationChannelSetup = () => {
  React.useEffect(() => {
    setupNotificationChannels();
  }, []);
};

// Setup notification received listener
const useNotificationReceivedListener = () => {
  React.useEffect(() => {
    const subscription = addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });
    return () => subscription.remove();
  }, []);
};

// Setup notification response listener
const useNotificationResponseListener = () => {
  React.useEffect(() => {
    const subscription = addNotificationResponseReceivedListener(
      handleNotificationResponse
    );
    return () => subscription.remove();
  }, []);
};

// Setup app state change listener
const useAppStateChangeListener = (
  checkPermissions: () => Promise<Notifications.PermissionStatus>
) => {
  const appState = React.useRef(AppState.currentState);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground, check permissions
        checkPermissions();
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [checkPermissions]);
};

// Create context value
const useCreateContextValue = (contextData: NotificationsContextType) => {
  return React.useMemo(
    () => contextData,
    [
      contextData.shopUpdatesEnabled,
      contextData.watchedItems,
      contextData.permissionStatus,
      contextData.isPermissionLoading,
      contextData.toggleShopUpdates,
      contextData.toggleItemWatch,
      contextData.isItemWatched,
      contextData.requestPermissions,
      contextData.hasPermissions,
    ]
  );
};

// Setup hooks for the provider
const useProviderSetup = () => {
  // Permission state
  const {
    permissionStatus,
    setPermissionStatus,
    isPermissionLoading,
    setIsPermissionLoading,
    hasPermissions,
    checkPermissions,
  } = usePermissionCheck();

  // Request permissions function
  const requestPermissions = usePermissionRequest(
    checkPermissions,
    setIsPermissionLoading,
    setPermissionStatus
  );

  // Shop updates preference
  const { shopUpdatesEnabled, loadShopUpdatesPreference, toggleShopUpdates } =
    useShopUpdatesPreference();

  // Watched items preference
  const {
    watchedItems,
    loadWatchedItemsPreference,
    toggleItemWatch,
    isItemWatched,
  } = useWatchedItemsPreference();

  // Setup notification listeners
  useNotificationChannelSetup();
  useNotificationReceivedListener();
  useNotificationResponseListener();
  useAppStateChangeListener(checkPermissions);

  // Check permissions on mount
  React.useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  // Load preferences on mount
  React.useEffect(() => {
    loadShopUpdatesPreference();
    loadWatchedItemsPreference();
  }, [loadShopUpdatesPreference, loadWatchedItemsPreference]);

  // Create context data
  const contextData: NotificationsContextType = {
    shopUpdatesEnabled,
    watchedItems,
    permissionStatus,
    isPermissionLoading,
    toggleShopUpdates,
    toggleItemWatch,
    isItemWatched,
    requestPermissions,
    hasPermissions,
  };

  // Create memoized context value
  return useCreateContextValue(contextData);
};

export const NotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const value = useProviderSetup();

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = React.useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      'useNotifications must be used within a NotificationsProvider'
    );
  }
  return context;
};
