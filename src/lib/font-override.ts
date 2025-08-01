import { StyleSheet, Text } from 'react-native';

/**
 * Override React Native's Text component to ensure all text uses our custom font
 * This is especially important for bold text, which would otherwise use the system's bold font
 */
export function overrideFontStyles() {
  // Create a global style that will be applied to all Text components
  const globalTextStyle = StyleSheet.create({
    default: {
      fontFamily: 'FORTNITE BATTLEFEST',
      textTransform: 'uppercase',
    },
  });

  // Store the original render method
  const OriginalText = Text as any;
  const OriginalRender = OriginalText.render;

  // Override the render method to apply our global style
  if (OriginalRender) {
    OriginalText.render = function (...args: any[]) {
      const element = OriginalRender.apply(this, args);

      if (element && element.props) {
        const { style, ...otherProps } = element.props;

        // Always apply our FORTNITE BATTLEFEST font
        // This overrides any other font settings including system bold
        const newStyle = [globalTextStyle.default, style];

        // Create a new element with our global style
        return {
          ...element,
          props: {
            ...otherProps,
            style: newStyle,
          },
        };
      }

      return element;
    };
  }
}
