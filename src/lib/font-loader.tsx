import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        console.log('Loading fonts...');
        console.log('Platform:', Platform.OS);

        // Load fonts
        await Font.loadAsync({
          'FORTNITE BATTLEFEST': require('../../assets/fonts/fortnitebattlefest.ttf'),
          Inter: require('../../assets/fonts/Inter.ttf'),
        });

        console.log('Fonts loaded successfully!');

        // Check loaded fonts if the method is available
        if (Font.isLoaded) {
          console.log(
            'FORTNITE BATTLEFEST loaded:',
            Font.isLoaded('FORTNITE BATTLEFEST')
          );
          console.log('Inter loaded:', Font.isLoaded('Inter'));
        }

        // Fonts loaded successfully
        setFontsLoaded(true);
      } catch (e) {
        console.error('Error loading fonts:', e);
      }
    }

    loadFonts();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return { fontsLoaded, onLayoutRootView };
}
