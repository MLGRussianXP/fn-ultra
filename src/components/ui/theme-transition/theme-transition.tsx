import { useColorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type ThemeTransitionProps = {
  /**
   * Children components
   */
  children: React.ReactNode;
  /**
   * Animation duration in milliseconds (default: 400)
   */
  duration?: number;
};

export function ThemeTransition({
  children,
  duration = 400,
}: ThemeTransitionProps) {
  const { colorScheme } = useColorScheme();
  const opacity = useSharedValue(1);

  // Track previous theme to detect changes
  const prevThemeRef = React.useRef(colorScheme);

  useEffect(() => {
    // Only animate if theme actually changed
    if (prevThemeRef.current !== colorScheme) {
      // Fade out
      opacity.value = withTiming(0.6, { duration: duration / 2 }, () => {
        // Fade back in
        opacity.value = withTiming(1, { duration: duration / 2 });
      });

      // Update previous theme reference
      prevThemeRef.current = colorScheme;
    }
  }, [colorScheme, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

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
