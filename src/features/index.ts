/**
 * Features module exports
 * @module features
 */

// Export Fortnite feature components and screens
export {
  ItemDetailsContent,
  ShopItem,
  ShopItemCard,
  ShopItemContent,
  ShopItemPrice,
  ShopScreen,
} from './fortnite/components';
export { ItemDetailsScreen } from './fortnite/screens';

// Export Settings feature components
export {
  LanguageItem,
  Item as SettingsItem,
  ThemeItem,
} from './settings/components';

// Export Notifications feature components
export { ShopUpdatesToggle } from './notifications/components';
export { useNotifications } from './notifications/hooks';
export {
  requestNotificationPermissions,
  scheduleLocalNotification,
  sendTestNotification,
} from './notifications/services';

// Export Search feature components and screens
export * from './search';
