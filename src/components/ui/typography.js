/**
 * Typography utilities for consistent text styling throughout the app
 * Copyright notice for FORTNITE BATTLEFEST font:
 * Copyright (c) SpideRaYsfoNtS. All rights reserved.
 */

// Text styles for different purposes
const textStyles = {
  // Default text style (using Fortnite font)
  default: 'tracking-fortnite',

  // Headings
  h1: 'text-4xl tracking-fortnite text-contrast-text-primary dark:text-contrast-high-light',
  h2: 'text-3xl tracking-fortnite text-contrast-text-primary dark:text-contrast-high-light',
  h3: 'text-2xl tracking-fortnite text-contrast-text-primary dark:text-contrast-high-light',
  h4: 'text-xl tracking-fortnite text-contrast-text-primary dark:text-contrast-high-light',

  // Body text (now using Fortnite font)
  body: 'tracking-fortnite text-base leading-normal text-contrast-text-primary dark:text-contrast-high-light',
  bodyLarge:
    'tracking-fortnite text-lg leading-relaxed text-contrast-text-primary dark:text-contrast-high-light',
  bodySmall:
    'tracking-fortnite text-sm leading-normal text-contrast-text-secondary dark:text-contrast-high-light',

  // Special text
  caption:
    'tracking-fortnite text-xs leading-tight text-contrast-text-tertiary dark:text-neutral-300',
  label:
    'tracking-fortnite text-sm text-contrast-text-secondary dark:text-neutral-200',
  button: 'text-base tracking-fortnite',

  // Accent text
  accent: 'text-contrast-text-accent tracking-fortnite',

  // Utility text styles - removed font weights since Fortnite font doesn't have weight variants
  bold: 'tracking-fortnite',
  semibold: 'tracking-fortnite',
  medium: 'tracking-fortnite',
  normal: 'tracking-fortnite',

  // Special Fortnite styles
  fortniteTitle:
    'text-3xl tracking-fortnite text-fortnite-blue dark:text-fortnite-blue',
  fortniteHeading:
    'text-2xl tracking-fortnite text-fortnite-orange dark:text-fortnite-orange',
  fortniteSubheading:
    'text-xl tracking-fortnite text-fortnite-purple dark:text-fortnite-purple',
};

// Spacing utilities for text
const textSpacing = {
  tight: 'tracking-tight',
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-wider',
  widest: 'tracking-widest',
  fortnite: 'tracking-fortnite',
};

module.exports = {
  textStyles,
  textSpacing,
};
