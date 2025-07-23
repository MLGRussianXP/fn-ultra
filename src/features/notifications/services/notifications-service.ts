import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

/**
 * Checks if the device can receive notifications
 */
export async function canReceiveNotifications(): Promise<boolean> {
  if (!Device.isDevice) {
    return false;
  }
  return true;
}

/**
 * Opens the app settings page where the user can enable notifications
 */
export async function openAppSettings(): Promise<void> {
  if (Platform.OS === 'ios') {
    await Linking.openURL('app-settings:');
  } else {
    await Linking.openSettings();
  }
}

/**
 * Handles the case when permissions are denied and can't be requested again
 */
async function handlePermissionDenied(): Promise<Notifications.NotificationPermissionsStatus> {
  await openAppSettings();
  return await Notifications.getPermissionsAsync();
}

/**
 * Requests notification permissions from the user using the system dialog
 */
export async function requestNotificationPermissions(): Promise<Notifications.NotificationPermissionsStatus> {
  if (!Device.isDevice) {
    return {
      status: Notifications.PermissionStatus.UNDETERMINED,
      canAskAgain: false,
      granted: false,
      expires: 'never',
    };
  }

  try {
    const currentStatus = await Notifications.getPermissionsAsync();

    if (
      currentStatus.status === Notifications.PermissionStatus.DENIED &&
      !currentStatus.canAskAgain
    ) {
      return await handlePermissionDenied();
    }

    const result = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowDisplayInCarPlay: true,
        allowCriticalAlerts: true,
        provideAppNotificationSettings: true,
      },
      android: {},
    });

    if (
      Platform.OS === 'ios' &&
      result.status === Notifications.PermissionStatus.DENIED
    ) {
      setTimeout(() => {
        openAppSettings();
      }, 1000);
    }

    return result;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return await Notifications.getPermissionsAsync();
  }
}

/**
 * Helper function to handle permission request flow
 */
export async function handlePermissionRequest(
  onGranted: () => void
): Promise<boolean> {
  try {
    const { granted } = await requestNotificationPermissions();

    if (granted) {
      onGranted();
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error in permission request flow:', error);
    return false;
  }
}

/**
 * Sets up notification channels for Android
 */
export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

      await Notifications.setNotificationChannelAsync('shop-updates', {
        name: 'Shop Updates',
        description: 'Notifications for Fortnite shop updates',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#5856D6',
      });

      await Notifications.setNotificationChannelAsync('item-watch', {
        name: 'Item Watch',
        description: 'Notifications for watched items',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF9500',
      });
    } catch (error) {
      console.error('Failed to set up notification channels:', error);
    }
  }
}

/**
 * Registers for push notification token
 */
export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  if (!Device.isDevice) {
    return undefined;
  }

  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== Notifications.PermissionStatus.GRANTED) {
      return undefined;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } catch (error) {
    console.error('Failed to register for push notifications:', error);
    return undefined;
  }
}

/**
 * Adds a listener for notification received
 */
export function addNotificationReceivedListener(
  listener: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(listener);
}

/**
 * Adds a listener for notification response received
 */
export function addNotificationResponseReceivedListener(
  listener: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(listener);
}

/**
 * Schedules a local notification
 */
export async function scheduleLocalNotification(
  notificationData: NotificationData
): Promise<string> {
  const { title, body, data } = notificationData;

  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
    },
    trigger: null, // Send immediately
  });
}

/**
 * Sends a test notification
 */
export async function sendTestNotification(): Promise<string> {
  return await scheduleLocalNotification({
    title: 'Test Notification',
    body: 'This is a test notification from the app',
    data: {
      type: 'test',
    },
  });
}
