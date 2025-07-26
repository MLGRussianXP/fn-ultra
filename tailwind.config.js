const colors = require('./src/components/ui/colors');
const {
  spacing,
  lineHeight,
  letterSpacing,
} = require('./src/components/ui/spacing');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['FORTNITE BATTLEFEST'],
        fortnite: ['FORTNITE BATTLEFEST'],
      },
      colors,
      spacing,
      lineHeight,
      letterSpacing,
    },
  },
  plugins: [],
};
