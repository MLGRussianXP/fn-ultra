import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { type AnimationType, getAnimationConfig } from './animation-utils';

type ScreenTransitionProps = {
  /**
   * Children components
   */
  children: React.ReactNode;
  /**
   * Whether the screen is currently focused
   */
  isFocused?: boolean;
  /**
   * Animation duration in milliseconds (default: 300)
   */
  duration?: number;
  /**
   * Initial animation type (default: 'fade')
   */
  animationType?: AnimationType;
  /**
   * Callback when animation completes
   */
  onAnimationComplete?: () => void;
};

export function ScreenTransition({
  children,
  isFocused = true,
  duration = 300,
  animationType = 'fade',
  onAnimationComplete,
}: ScreenTransitionProps) {
  // Get animation configuration
  const config = getAnimationConfig(animationType, isFocused);

  // Animation values
  const opacity = useSharedValue(config.initialOpacity);
  const translateY = useSharedValue(config.initialTranslateY);

  const handleAnimationComplete = () => {
    onAnimationComplete?.();
  };

  // Handle animations when focus changes
  useEffect(() => {
    if (animationType === 'none') return;

    // Set opacity animation
    opacity.value = withTiming(
      config.targetOpacity,
      {
        duration,
        easing: isFocused ? config.easingIn : config.easingOut,
      },
      () => {
        runOnJS(handleAnimationComplete)();
      }
    );

    // Set translation animation if needed
    if (animationType === 'slide') {
      translateY.value = withTiming(config.targetTranslateY, {
        duration,
        easing: isFocused ? config.easingIn : config.easingOut,
      });
    }
  }, [isFocused, duration, animationType]);

  // Create animated style
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform:
      animationType === 'slide' ? [{ translateY: translateY.value }] : [],
  }));

  // Skip animation wrapper for 'none' type
  if (animationType === 'none') {
    return <>{children}</>;
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
