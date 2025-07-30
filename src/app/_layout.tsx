// Import  global CSS file
import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { APIProvider } from '@/api';
import { TextProvider, ThemeTransition } from '@/components/ui';
import { NotificationsProvider } from '@/features/notifications/provider/notifications-provider';
import {
  registerShopUpdateTask,
  setupNotificationChannels,
} from '@/features/notifications/services';
import { loadSelectedTheme } from '@/hooks/use-selected-theme';
import { useThemeConfig } from '@/hooks/use-theme-config';
import { overrideFontStyles, useFonts } from '@/lib';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from 'expo-router';

// Remove initialization from global scope
// Initialize notification channels and background tasks will be done in the Providers component

export const unstable_settings = {
  initialRouteName: '(app)',
};

// Initialize app services
loadSelectedTheme();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

export default function RootLayout() {
  const { fontsLoaded, onLayoutRootView } = useFonts();

  // Apply font override when fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      // Override font styles to ensure bold text uses our font
      overrideFontStyles();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Providers onLayout={onLayoutRootView}>
      <Stack
        screenOptions={{
          headerTitleStyle: {
            fontFamily: 'FORTNITE BATTLEFEST',
          },
        }}
      >
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}

function Providers({
  children,
  onLayout,
}: {
  children: React.ReactNode;
  onLayout: () => void;
}) {
  const theme = useThemeConfig();

  // Initialize notifications only once when the app is fully loaded
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await setupNotificationChannels();
        await registerShopUpdateTask();
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
      onLayout={onLayout}
    >
      <KeyboardProvider>
        <ThemeProvider value={theme}>
          <APIProvider>
            <NotificationsProvider>
              <TextProvider>
                <BottomSheetModalProvider>
                  <ThemeTransition>{children}</ThemeTransition>
                  <FlashMessage position="top" />
                </BottomSheetModalProvider>
              </TextProvider>
            </NotificationsProvider>
          </APIProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
