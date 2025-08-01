import { cssInterop } from 'nativewind';
import Svg from 'react-native-svg';

export * from './animated-pressable';
export * from './bold-text-fix';
export * from './button';
export * from './checkbox';
export { default as colors } from './colors';
export * from './focus-aware-status-bar';
export * from './font-styles';
export * from './image';
export * from './input';
export * from './list';
export * from './modal';
export * from './navigation-font';
export * from './progress-bar';
export * from './screen-transition';
export * from './select';
export { default as spacing } from './spacing';
export * from './text';
export * from './text-provider';
export * from './theme-transition';
export { textSpacing, textStyles } from './typography';
export * from './utils';

// export base components from react-native
export {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
export { SafeAreaView } from 'react-native-safe-area-context';

//Apply cssInterop to Svg to resolve className string into style
cssInterop(Svg, {
  className: {
    target: 'style',
  },
});
