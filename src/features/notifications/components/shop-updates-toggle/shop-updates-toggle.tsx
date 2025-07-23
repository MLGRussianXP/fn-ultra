import React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui';
import { Switch } from '@/components/ui/checkbox';
import { useNotifications } from '@/features/notifications/hooks';
import {
  handlePermissionRequest,
  sendTestNotification,
} from '@/features/notifications/services';
import { translate } from '@/lib/i18n';

// Helper function to send a test notification with error handling
const sendTestNotificationWithErrorHandling = async () => {
  try {
    await sendTestNotification();
  } catch (error) {
    console.error('Failed to send test notification:', error);
  }
};

// Extract some functionality to reduce component size for linting
const useToggleState = (shopUpdatesEnabled: boolean) => {
  // Local state to track toggle value during permission request
  const [isToggling, setIsToggling] = React.useState(false);
  // Local state to track the desired state of the toggle
  const [localEnabled, setLocalEnabled] = React.useState(shopUpdatesEnabled);

  // Update local state when shopUpdatesEnabled changes
  React.useEffect(() => {
    setLocalEnabled(shopUpdatesEnabled);
  }, [shopUpdatesEnabled]);

  return { isToggling, setIsToggling, localEnabled, setLocalEnabled };
};

export const ShopUpdatesToggle = () => {
  const { shopUpdatesEnabled, toggleShopUpdates } = useNotifications();

  const { isToggling, setIsToggling, localEnabled, setLocalEnabled } =
    useToggleState(shopUpdatesEnabled);

  const handleToggle = React.useCallback(
    async (checked: boolean) => {
      // Update local state immediately for better UX
      setLocalEnabled(checked);

      // If enabling notifications, request permissions
      if (checked) {
        setIsToggling(true);
        try {
          // Use the helper function to handle the permission request
          const granted = await handlePermissionRequest(() => {
            toggleShopUpdates(true);
            // Send a test notification
            setTimeout(() => {
              sendTestNotificationWithErrorHandling();
            }, 500);
          });

          // If not granted, revert local state
          if (!granted) {
            setLocalEnabled(false);
          }
        } catch (error) {
          console.error('Error handling permission request:', error);
          // Revert local state on error
          setLocalEnabled(false);
        } finally {
          setIsToggling(false);
        }
      } else {
        // Disabling notifications doesn't require permission
        toggleShopUpdates(false);
      }
    },
    [toggleShopUpdates, setIsToggling, setLocalEnabled]
  );

  return (
    <View className="flex-row items-center justify-between px-4 py-2">
      <View>
        <Text className="text-base font-medium">
          {translate('settings.notifications.shop_updates')}
        </Text>
        <Text className="text-sm text-neutral-600 dark:text-neutral-400">
          {translate('settings.notifications.shop_updates_description')}
        </Text>
      </View>
      <Switch
        accessibilityLabel={translate('settings.notifications.shop_updates')}
        checked={isToggling ? true : localEnabled}
        onChange={handleToggle}
      />
    </View>
  );
};
