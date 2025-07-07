import { FlatList, Pressable, View } from 'react-native';

export const useAnimatedScrollHandler = jest.fn(() => jest.fn());
export const useSharedValue = jest.fn(() => ({ value: 0 }));
export const withTiming = jest.fn();
export const createAnimatedComponent = jest.fn((component) => component);
export const useAnimatedStyle = jest.fn(() => ({}));
export const useDerivedValue = jest.fn(() => ({ value: 0 }));
export const interpolate = jest.fn();
export const Extrapolate = { CLAMP: 'clamp' };
export const runOnJS = jest.fn((fn) => fn);
export const withSpring = jest.fn();
export const withDelay = jest.fn();
export const withSequence = jest.fn();
export const withRepeat = jest.fn();
export const cancelAnimation = jest.fn();
export const measure = jest.fn();
export const scrollTo = jest.fn();
export const useAnimatedGestureHandler = jest.fn();
export const useAnimatedRef = jest.fn();
export const useAnimatedReaction = jest.fn();
export const useAnimatedProps = jest.fn();
export const useFrameCallback = jest.fn();

// Create animated components that work in tests
const AnimatedFlatList = FlatList;
const AnimatedPressable = Pressable;
const AnimatedView = View;

export default {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
  createAnimatedComponent,
  useAnimatedStyle,
  useDerivedValue,
  interpolate,
  Extrapolate,
  runOnJS,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  cancelAnimation,
  measure,
  scrollTo,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedReaction,
  useAnimatedProps,
  useFrameCallback,
  FlatList: AnimatedFlatList,
  Pressable: AnimatedPressable,
  View: AnimatedView,
};
