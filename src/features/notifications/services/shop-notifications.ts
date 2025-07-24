import { Env } from '@env';
import * as BackgroundFetch from 'expo-background-fetch';
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

/**
 * Fetches the latest shop data from the Fortnite API
 */
async function fetchShopData(): Promise<ShopData | null> {
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
function getWatchedItemsInShop(shopData: ShopData): BrItem[] {
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
 * Sends notifications for watched items in the shop
 * @param itemsInShop Array of watched items that are in the shop
 */
async function sendWatchedItemsNotification(
  itemsInShop: BrItem[]
): Promise<void> {
  if (itemsInShop.length === 0) {
    return;
  }

  // Create notification content based on number of items
  let title: string;
  let body: string;

  if (itemsInShop.length === 1) {
    title = 'Watched Item Available!';
    body = `${itemsInShop[0].name} is now available in the shop!`;
  } else {
    title = 'Watched Items Available!';
    body = `${itemsInShop.length} items on your watch list are in the shop today!`;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: {
        type: 'item_watch',
        itemIds: itemsInShop.map((item) => item.id),
      },
    },
    trigger: null, // Send immediately
  });

  // Save the notification timestamp
  await storeItem(LAST_ITEM_WATCH_KEY, new Date().toISOString());
}

/**
 * Sends a shop update notification
 */
async function sendShopUpdateNotification(shopDate: string): Promise<void> {
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
async function handleShopUpdateTask(): Promise<BackgroundFetch.BackgroundFetchResult> {
  try {
    // Check if shop updates are enabled
    const shopUpdatesEnabled = getItem<boolean>(
      STORAGE_KEYS.NOTIFICATIONS.SHOP_UPDATES_ENABLED
    );

    if (!shopUpdatesEnabled) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    // Fetch shop data
    const shopData = await fetchShopData();

    if (!shopData) {
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }

    // Get the last seen shop date
    const lastSeenShopDate = getItem<string>(
      STORAGE_KEYS.NOTIFICATIONS.LAST_SEEN_SHOP_DATE
    );

    // If we've already seen this shop update, don't send notifications
    if (lastSeenShopDate === shopData.date) {
      console.log('Shop already seen, skipping notifications');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    // Store the current shop date
    storeItem(STORAGE_KEYS.NOTIFICATIONS.LAST_SEEN_SHOP_DATE, shopData.date);

    // Send shop update notification only if the shop is new
    await sendShopUpdateNotification(shopData.date);

    // Check for watched items in the shop
    const watchedItemsInShop = getWatchedItemsInShop(shopData);

    // Send watched items notification if needed
    if (
      watchedItemsInShop.length > 0 &&
      (await shouldSendWatchedItemsNotification())
    ) {
      await sendWatchedItemsNotification(watchedItemsInShop);
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background fetch failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
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
    await BackgroundFetch.registerTaskAsync(SHOP_UPDATE_TASK, {
      minimumInterval: 60 * 60, // 1 hour minimum
      stopOnTerminate: false,
      startOnBoot: true,
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
    await BackgroundFetch.unregisterTaskAsync(SHOP_UPDATE_TASK);
    console.log('Shop update task unregistered');
  } catch (error) {
    console.error('Failed to unregister shop update task:', error);
  }
}

/**
 * Schedules a shop update notification (no-op, kept for API compatibility)
 */
export async function scheduleDailyShopNotification(): Promise<string | null> {
  // No longer schedules a repeating notification
  return null;
}

/**
 * Cancels the shop update notification (no-op, kept for API compatibility)
 */
export async function cancelDailyShopNotification(): Promise<void> {
  // No longer cancels a repeating notification
  return;
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
