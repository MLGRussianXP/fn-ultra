import React from 'react';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { DetailedBrItem } from '@/api/fortnite/types';
import { AnimatedPressable } from '@/components/ui';
import { Bell } from '@/components/ui/icons';
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

// Handle the toggle logic separately to reduce component size
type ToggleHandlerParams = {
  brItemId: string;
  toggleItemWatch: (id: string, watched: boolean) => void;
  setIsToggling: (value: boolean) => void;
  setLocalWatched: (value: boolean) => void;
  localWatched: boolean;
  animateToggle: () => void;
};

const useToggleHandler = (params: ToggleHandlerParams) => {
  const {
    brItemId,
    toggleItemWatch,
    setIsToggling,
    setLocalWatched,
    localWatched,
    animateToggle,
  } = params;

  return React.useCallback(async () => {
    // Toggle to the opposite state
    const newWatchState = !localWatched;

    // Update local state immediately for better UX
    setLocalWatched(newWatchState);

    // Trigger animation
    animateToggle();

    // If enabling notifications, request permissions
    if (newWatchState) {
      setIsToggling(true);
      try {
        // Use the helper function to handle the permission request
        const granted = await handlePermissionRequest(() => {
          toggleItemWatch(brItemId, true);
          // No test notification needed
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
      toggleItemWatch(brItemId, false);
    }
  }, [
    toggleItemWatch,
    brItemId,
    setIsToggling,
    setLocalWatched,
    localWatched,
    animateToggle,
  ]);
};

type Props = {
  brItemData: DetailedBrItem;
};

export function ItemWatchButton({ brItemData }: Props) {
  const { isItemWatched, toggleItemWatch } = useNotifications();

  // Get the current watch status
  const isWatched = isItemWatched(brItemData.id);

  const { isToggling, setIsToggling, localWatched, setLocalWatched } =
    useToggleState(isWatched);

  // Animation values
  const scale = useSharedValue(1);

  // Animation function
  const animateToggle = React.useCallback(() => {
    scale.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withSpring(1)
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleToggle = useToggleHandler({
    brItemId: brItemData.id,
    toggleItemWatch,
    setIsToggling,
    setLocalWatched,
    localWatched,
    animateToggle,
  });

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className="absolute right-4 top-4 z-10"
    >
      <Animated.View style={animatedStyle}>
        <AnimatedPressable
          onPress={handleToggle}
          disabled={isToggling}
          className="size-12 items-center justify-center rounded-full bg-neutral-800/80 shadow-xl backdrop-blur-sm"
          accessibilityLabel={translate('settings.notifications.watch_item')}
          accessibilityRole="button"
          testID="item-watch-button"
          scaleFactor={0.9}
          useSpring={true}
        >
          <Bell
            color={localWatched ? '#9D4EDD' : 'white'}
            filled={localWatched}
            width={20}
            height={20}
          />
        </AnimatedPressable>
      </Animated.View>
    </Animated.View>
  );
}
