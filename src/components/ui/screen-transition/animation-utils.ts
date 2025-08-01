import { Easing } from 'react-native-reanimated';

export type AnimationType = 'fade' | 'slide' | 'none';

/**
 * Get animation configuration based on animation type
 */
export function getAnimationConfig(
  animationType: AnimationType,
  isFocused: boolean
) {
  const initialOpacity = isFocused ? 0 : 1;
  const initialTranslateY =
    animationType === 'slide' ? (isFocused ? 20 : 0) : 0;

  return {
    initialOpacity,
    initialTranslateY,
    targetOpacity: isFocused ? 1 : 0,
    targetTranslateY: animationType === 'slide' ? (isFocused ? 0 : -20) : 0,
    easingIn: Easing.out(Easing.cubic),
    easingOut: Easing.in(Easing.cubic),
  };
}
