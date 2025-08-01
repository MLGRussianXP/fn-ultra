import React from 'react';
import { View } from 'react-native';

import type { DetailedBrItem } from '@/api/fortnite/types';
import { Text } from '@/components/ui';
import { Switch } from '@/components/ui/checkbox';
import { useNotifications } from '@/features/notifications/hooks';
import { handlePermissionRequest } from '@/features/notifications/services';
import { translate } from '@/lib/i18n';

// Extract some functionality to reduce component size for linting
const useToggleState = (isWatched: boolean) => {
  // Local state to track toggle value during permission request
  const [isToggling, setIsToggling] = React.useState(false);
  // Local state to track the desired state of the toggle
  const [localWatched, setLocalWatched] = React.useState(isWatched);

  // Update local state when watch status changes
  React.useEffect(() => {
    setLocalWatched(isWatched);
  }, [isWatched]);

  return { isToggling, setIsToggling, localWatched, setLocalWatched };
};

type Props = {
  brItemData: DetailedBrItem;
};

export function ItemWatchToggle({ brItemData }: Props) {
  const { isItemWatched, toggleItemWatch } = useNotifications();

  // Get the current watch status
  const isWatched = isItemWatched(brItemData.id);

  const { isToggling, setIsToggling, localWatched, setLocalWatched } =
    useToggleState(isWatched);

  const handleToggle = React.useCallback(
    async (checked: boolean) => {
      // Update local state immediately for better UX
      setLocalWatched(checked);

      // If enabling notifications, request permissions
      if (checked) {
        setIsToggling(true);
        try {
          // Use the helper function to handle the permission request
          const granted = await handlePermissionRequest(() => {
            toggleItemWatch(brItemData.id, true);
          });

          // If not granted, revert local state
          if (!granted) {
            setLocalWatched(false);
          }
        } catch (error) {
          console.error('Error handling permission request:', error);
          // Revert local state on error
          setLocalWatched(false);
        } finally {
          setIsToggling(false);
        }
      } else {
        // Disabling notifications doesn't require permission
        toggleItemWatch(brItemData.id, false);
      }
    },
    [toggleItemWatch, brItemData.id, setIsToggling, setLocalWatched]
  );

  return (
    <View className="flex-row items-center justify-between px-4 py-2">
      <View>
        <Text className="text-base font-medium">
          {translate('settings.notifications.watch_item')}
        </Text>
        <Text className="text-sm text-neutral-600 dark:text-neutral-400">
          {translate('settings.notifications.watch_item_description')}{' '}
          You&apos;ll be notified when this item appears in the shop.
        </Text>
      </View>
      <Switch
        accessibilityLabel={translate('settings.notifications.watch_item')}
        checked={isToggling ? true : localWatched}
        onChange={handleToggle}
      />
    </View>
  );
}
