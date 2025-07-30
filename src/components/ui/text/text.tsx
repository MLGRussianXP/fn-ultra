import React from 'react';
import type { TextProps, TextStyle } from 'react-native';
import { I18nManager, StyleSheet, Text as NNText } from 'react-native';
import { twMerge } from 'tailwind-merge';

import type { TxKeyPath } from '@/lib/i18n';
import { translate } from '@/lib/i18n';

// Import typography utilities
import { textStyles } from '../../ui/typography';

type TextVariant =
  | 'default'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'caption'
  | 'fortnite'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'bodyLarge'
  | 'bodySmall'
  | 'label'
  | 'button';

interface Props extends TextProps {
  className?: string;
  tx?: TxKeyPath;
  variant?: TextVariant;
}

// Helper function to get variant classes
function getVariantClasses(variant: TextVariant): string {
  // Check if the variant exists in textStyles
  if (variant in textStyles) {
    return textStyles[variant as keyof typeof textStyles];
  }

  // Fallback to basic variants
  switch (variant) {
    case 'title':
      return 'text-2xl tracking-fortnite';
    case 'heading':
      return 'text-xl tracking-fortnite';
    case 'subheading':
      return 'text-lg tracking-fortnite';
    case 'fortnite':
      return 'text-lg tracking-fortnite uppercase';
    default:
      return 'text-base tracking-fortnite'; // Default to fortnite style
  }
}

// Helper function to get font family
function getFontFamily(): string {
  return 'FORTNITE BATTLEFEST'; // Always use Fortnite font
}

export const Text = ({
  className = '',
  style,
  tx,
  variant = 'default',
  children,
  ...props
}: Props) => {
  const variantClasses = React.useMemo(
    () => getVariantClasses(variant),
    [variant]
  );

  const textStyle = React.useMemo(
    () =>
      twMerge(
        'text-contrast-text-primary dark:text-contrast-high-light',
        variantClasses,
        className
      ),
    [className, variantClasses]
  );

  const fontFamily = React.useMemo(() => getFontFamily(), []);

  const nStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        {
          writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
          fontFamily,
          textTransform: 'uppercase', // Always apply text transform for FORTNITE font
        },
        style,
      ]) as TextStyle,
    [style, fontFamily]
  );

  return (
    <NNText className={textStyle} style={nStyle} {...props}>
      {tx ? translate(tx) : children}
    </NNText>
  );
};
