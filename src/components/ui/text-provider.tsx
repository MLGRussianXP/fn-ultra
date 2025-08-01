import React from 'react';
import {
  StyleSheet,
  Text as RNText,
  type TextProps as RNTextProps,
} from 'react-native';

/**
 * Global text provider that ensures all text uses the correct font
 * This is a direct override of the React Native Text component
 */
export function TextProvider({ children }: { children: React.ReactNode }) {
  // Override the default Text component
  const DefaultText = RNText as any;
  const OriginalRender = DefaultText.render;

  DefaultText.render = function (props: RNTextProps, ref: any) {
    const originalOutput = OriginalRender.apply(this, [props, ref]);

    if (!originalOutput) return originalOutput;

    // Get the existing style from the original output
    const existingStyle = originalOutput.props.style || {};

    // Apply the FORTNITE BATTLEFEST font to all text
    // This ensures consistent font usage across the app
    const newStyle = [styles.defaultText, existingStyle];

    return React.cloneElement(originalOutput, {
      style: newStyle,
    });
  };

  return <>{children}</>;
}

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
});
