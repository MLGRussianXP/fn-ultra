import { Env } from '@env';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

import type { BrItem, ShopData, ShopResponse } from '@/api/fortnite/types';
import { STORAGE_KEYS } from '@/features/notifications/utils/storage-keys';
import { getItem, setItem as storeItem } from '@/lib/storage';

// Task names
export const SHOP_UPDATE_TASK = 'SHOP_UPDATE_TASK';
export const WATCHED_ITEMS_TASK = 'WATCHED_ITEMS_TASK';

// Last notification timestamps (to prevent duplicate notifications)
const LAST_ITEM_WATCH_KEY = 'notifications.lastItemWatch';

// Notification identifier for scheduled daily notifications
const DAILY_SHOP_NOTIFICATION_ID = 'daily-shop-update';

/**
 * Calculates the next 00:00 GMT time
 */
function getNext00GMT(): Date {
  const now = new Date();
  const next00GMT = new Date();

  // Set to next 00:00 GMT
  next00GMT.setUTCHours(0, 0, 0, 0);

  // If it's already past 00:00 GMT today, schedule for tomorrow
  if (now.getTime() >= next00GMT.getTime()) {
    next00GMT.setUTCDate(next00GMT.getUTCDate() + 1);
  }

  return next00GMT;
}

/**
 * Processes shop data and sends appropriate notifications
 */
async function processShopDataAndNotify(shopData: ShopData): Promise<void> {
  // Get the last seen shop date
  const lastSeenShopDate = getItem<string>(
    STORAGE_KEYS.NOTIFICATIONS.LAST_SEEN_SHOP_DATE
  );

  // If we've already seen this shop update, don't send notifications
  if (lastSeenShopDate === shopData.date) {
    console.log(
      '[DailyNotification] Shop not updated (date:',
      shopData.date,
      '), skipping notification'
    );
    return;
  }

  console.log('[DailyNotification] Shop updated! New date:', shopData.date);

  // Store the current shop date
  storeItem(STORAGE_KEYS.NOTIFICATIONS.LAST_SEEN_SHOP_DATE, shopData.date);

  // Always send shop update notification
  await sendShopUpdateNotification(shopData.date);
  console.log('[DailyNotification] Shop update notification sent');

  // Check for watched items separately
  const watchedItemsInShop = getWatchedItemsInShop(shopData);

  // Send individual notifications for each watched item
  if (
    watchedItemsInShop.length > 0 &&
    (await shouldSendWatchedItemsNotification())
  ) {
    for (const item of watchedItemsInShop) {
      await sendWatchedItemNotification(item);
      console.log(
        `[DailyNotification] Watched item notification sent for: ${item.name}`
      );
    }

    // Save the notification timestamp after sending all item notifications
    await storeItem(LAST_ITEM_WATCH_KEY, new Date().toISOString());
  }
}

/**
 * Fetches the latest shop data from the Fortnite API
 */
export async function fetchShopData(): Promise<ShopData | null> {
  try {
    const response = await fetch(`${Env.FORTNITE_API_URL}/v2/shop`);

    if (!response.ok) {
      console.error('Failed to fetch shop data:', response.status);
      return null;
    }

    const data: ShopResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching shop data:', error);
    return null;
  }
}

/**
 * Checks which watched items are in the shop
 * @param shopData Current shop data
 * @returns Array of watched items that are in the shop
 */
export function getWatchedItemsInShop(shopData: ShopData): BrItem[] {
  // Get watched items from storage
  const watchedItems =
    getItem<Record<string, boolean>>(
      STORAGE_KEYS.NOTIFICATIONS.WATCHED_ITEMS
    ) || {};
  const watchedItemIds = Object.keys(watchedItems).filter(
    (id) => watchedItems[id]
  );

  if (watchedItemIds.length === 0) {
    return [];
  }

  // Find watched items in the shop
  const itemsInShop: BrItem[] = [];

  for (const entry of shopData.entries) {
    // Check BR items
    if (entry.brItems) {
      for (const item of entry.brItems) {
        if (watchedItemIds.includes(item.id)) {
          itemsInShop.push(item);
        }
      }
    }

    // Check instruments
    if (entry.instruments) {
      for (const item of entry.instruments) {
        if (watchedItemIds.includes(item.id)) {
          itemsInShop.push(item as unknown as BrItem);
        }
      }
    }

    // Check tracks
    if (entry.tracks) {
      for (const item of entry.tracks) {
        if (watchedItemIds.includes(item.id)) {
          itemsInShop.push(item as unknown as BrItem);
        }
      }
    }

    // Check cars
    if (entry.cars) {
      for (const item of entry.cars) {
        if (watchedItemIds.includes(item.id)) {
          itemsInShop.push(item as unknown as BrItem);
        }
      }
    }

    // Check LEGO kits
    if (entry.legoKits) {
      for (const item of entry.legoKits) {
        if (watchedItemIds.includes(item.id)) {
          itemsInShop.push(item as unknown as BrItem);
        }
      }
    }
  }

  return itemsInShop;
}

/**
 * Checks if a watched items notification should be sent
 * @returns Whether a notification should be sent
 */
async function shouldSendWatchedItemsNotification(): Promise<boolean> {
  // Get the last notification timestamp
  const lastNotification = getItem<string>(LAST_ITEM_WATCH_KEY);

  if (!lastNotification) {
    return true;
  }

  // Check if we already sent a notification today
  const now = new Date();
  const lastNotificationDate = new Date(lastNotification);

  // If we already sent a notification today, don't send another one
  if (
    now.getFullYear() === lastNotificationDate.getFullYear() &&
    now.getMonth() === lastNotificationDate.getMonth() &&
    now.getDate() === lastNotificationDate.getDate()
  ) {
    return false;
  }

  return true;
}

/**
 * Sends a notification for a single watched item
 */
export async function sendWatchedItemNotification(item: BrItem): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Watched Item Available!',
      body: `${item.name} is now available in the shop!`,
      data: {
        type: 'item_watch',
        itemId: item.id,
      },
    },
    trigger: null, // Send immediately
  });
}

/**
 * Sends a shop update notification
 */
export async function sendShopUpdateNotification(
  shopDate: string
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Fortnite Shop Update',
      body: 'The item shop has been updated! Check out the new items.',
      data: {
        type: 'shop_update',
        shopDate,
      },
    },
    trigger: null, // Send immediately
  });
}

/**
 * Background task handler for shop updates
 */
async function handleShopUpdateTask(): Promise<number> {
  try {
    console.log('[ShopUpdateTask] Task running at', new Date().toISOString());

    // Check if shop updates are enabled
    const shopUpdatesEnabled = getItem<boolean>(
      STORAGE_KEYS.NOTIFICATIONS.SHOP_UPDATES_ENABLED
    );

    if (!shopUpdatesEnabled) {
      console.log('[ShopUpdateTask] Shop updates not enabled, skipping');
      return BackgroundTask.BackgroundTaskResult.Success;
    }

    // Fetch shop data
    const shopData = await fetchShopData();

    if (!shopData) {
      console.log('[ShopUpdateTask] Failed to fetch shop data');
      return BackgroundTask.BackgroundTaskResult.Failed;
    }

    // Process the shop data and send notifications
    await processShopDataAndNotify(shopData);

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error('[ShopUpdateTask] Background fetch failed:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
}

/**
 * Registers the background fetch task for shop updates
 */
export async function registerShopUpdateTask(): Promise<void> {
  // Define the task
  TaskManager.defineTask(SHOP_UPDATE_TASK, handleShopUpdateTask);

  try {
    // Check if the task is already registered
    const isRegistered =
      await TaskManager.isTaskRegisteredAsync(SHOP_UPDATE_TASK);

    if (isRegistered) {
      console.log('Shop update task already registered');
      return;
    }

    // Register the background fetch task
    await BackgroundTask.registerTaskAsync(SHOP_UPDATE_TASK, {
      minimumInterval: 60, // 1 hour in minutes
    });

    console.log('Shop update task registered');
  } catch (error) {
    console.error('Failed to register shop update task:', error);
  }
}

/**
 * Unregisters the background fetch task for shop updates
 */
export async function unregisterShopUpdateTask(): Promise<void> {
  try {
    await BackgroundTask.unregisterTaskAsync(SHOP_UPDATE_TASK);
    console.log('Shop update task unregistered');
  } catch (error) {
    console.error('Failed to unregister shop update task:', error);
  }
}

/**
 * Schedules a shop update notification for daily 00:00 GMT delivery
 */
export async function scheduleDailyShopNotification(): Promise<string | null> {
  try {
    // Cancel any existing scheduled notification
    await cancelDailyShopNotification();

    const next00GMT = getNext00GMT();
    console.log(
      '[DailyNotification] Scheduling daily notification for:',
      next00GMT.toISOString()
    );

    // Schedule the silent trigger for the next 00:00 GMT
    // This won't show a notification, but will trigger our background check
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '', // Empty title - no visible notification
        body: '', // Empty body - no visible notification
        data: {
          type: 'daily_shop_check',
          scheduledFor: next00GMT.toISOString(),
          silent: true,
        },
      },
      trigger: {
        channelId: 'shop-updates',
        seconds: Math.floor((next00GMT.getTime() - Date.now()) / 1000),
      },
      identifier: DAILY_SHOP_NOTIFICATION_ID,
    });

    console.log('[DailyNotification] Scheduled with ID:', notificationId);
    return notificationId;
  } catch (error) {
    console.error(
      '[DailyNotification] Failed to schedule daily notification:',
      error
    );
    return null;
  }
}

/**
 * Cancels the daily shop update notification
 */
export async function cancelDailyShopNotification(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(
      DAILY_SHOP_NOTIFICATION_ID
    );
    console.log('[DailyNotification] Cancelled daily shop notification');
  } catch (error) {
    console.error(
      '[DailyNotification] Failed to cancel daily notification:',
      error
    );
  }
}

/**
 * Manages shop notifications based on user preferences
 * @param enabled Whether shop notifications are enabled
 */
export async function manageShopNotifications(enabled: boolean): Promise<void> {
  if (enabled) {
    // Schedule daily notification
    await scheduleDailyShopNotification();

    // Register background task
    await registerShopUpdateTask();
  } else {
    // Cancel daily notification
    await cancelDailyShopNotification();

    // Unregister background task
    await unregisterShopUpdateTask();
  }
}
