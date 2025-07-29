import type { ConfigContext, ExpoConfig } from '@expo/config';
import type { AppIconBadgeConfig } from 'app-icon-badge/types';

import { ClientEnv, Env } from './env';

const appIconBadgeConfig: AppIconBadgeConfig = {
  enabled: Env.APP_ENV !== 'production',
  badges: [
    {
      text: Env.APP_ENV,
      type: 'banner',
      color: 'white',
    },
    {
      text: Env.VERSION.toString(),
      type: 'ribbon',
      color: 'white',
    },
  ],
};

const iosConfig = {
  supportsTablet: true,
  bundleIdentifier: Env.BUNDLE_ID,
  infoPlist: {
    ITSAppUsesNonExemptEncryption: false,
    UIBackgroundModes: [
      'remote-notification',
      'background-fetch',
      'background-processing',
    ],
    NSPhotoLibraryUsageDescription:
      'Allow access to save Fortnite item images to your photo library',
    NSPhotoLibraryAddUsageDescription:
      'Allow access to save Fortnite item images to your photo library',
  },
};

// Define plugins with proper typing
const plugins: (string | [string, Record<string, any>] | [string])[] = [
  [
    'expo-splash-screen',
    {
      backgroundColor: '#2E3C4B',
      image: './assets/splash-icon.png',
      imageWidth: 150,
    },
  ],
  [
    'expo-font',
    {
      fonts: [
        './assets/fonts/fortnitebattlefest.ttf',
        './assets/fonts/Inter.ttf',
      ],
    },
  ],
  'expo-localization',
  'expo-router',
  ['app-icon-badge', appIconBadgeConfig],
  ['react-native-edge-to-edge'],
  'expo-notifications',
  [
    'expo-media-library',
    {
      photosPermission:
        'Allow $(PRODUCT_NAME) to access your photos to save Fortnite item images',
      savePhotosPermission:
        'Allow $(PRODUCT_NAME) to save Fortnite item images to your photo library',
    },
  ],
];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.NAME,
  description: `${Env.NAME} Mobile App`,
  owner: Env.EXPO_ACCOUNT_OWNER,
  scheme: Env.SCHEME,
  slug: 'fn-ultra',
  version: Env.VERSION.toString(),
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: iosConfig,
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#2E3C4B',
    },
    package: Env.PACKAGE,
    permissions: [
      'NOTIFICATIONS',
      'VIBRATE',
      'RECEIVE_BOOT_COMPLETED',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.ACCESS_MEDIA_LOCATION',
    ],
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins,
  extra: {
    ...ClientEnv,
    eas: {
      projectId: Env.EAS_PROJECT_ID,
    },
  },
});
