import React, { forwardRef, useCallback } from 'react';
import { Pressable, type PressableProps, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type AnimatedPressableProps = PressableProps & {
  /**
   * Scale factor when pressed (default: 0.95)
   */
  scaleFactor?: number;
  /**
   * Animation duration in milliseconds (default: 100)
   */
  duration?: number;
  /**
   * Whether to use spring animation (default: false)
   */
  useSpring?: boolean;
  /**
   * Children components
   */
  children: React.ReactNode;
};

const AnimatedPressableComponent = Animated.createAnimatedComponent(Pressable);

export const AnimatedPressable = forwardRef<any, AnimatedPressableProps>(
  (
    {
      children,
      scaleFactor = 0.95,
      duration = 100,
      useSpring = false,
      style,
      onPressIn,
      onPressOut,
      ...rest
    },
    ref
  ) => {
    const scale = useSharedValue(1);

    const handlePressIn = useCallback(
      (e: any) => {
        if (useSpring) {
          scale.value = withSpring(scaleFactor);
        } else {
          scale.value = withTiming(scaleFactor, { duration });
        }
        onPressIn?.(e);
      },
      [scale, scaleFactor, duration, useSpring, onPressIn]
    );

    const handlePressOut = useCallback(
      (e: any) => {
        if (useSpring) {
          scale.value = withSpring(1);
        } else {
          scale.value = withTiming(1, { duration });
        }
        onPressOut?.(e);
      },
      [scale, duration, useSpring, onPressOut]
    );

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    // Handle style properly to avoid type errors
    const flattenedStyle =
      typeof style === 'function'
        ? {} // Skip function styles as they're not compatible
        : StyleSheet.flatten(style || {});

    return (
      <AnimatedPressableComponent
        style={[animatedStyle, flattenedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        ref={ref}
        {...rest}
      >
        {children}
      </AnimatedPressableComponent>
    );
  }
);
