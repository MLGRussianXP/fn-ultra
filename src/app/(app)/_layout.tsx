import { SplashScreen, Stack } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

export default function AppLayout() {
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      hideSplash();
    }, 1000);
  }, [hideSplash]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Shop',
        }}
      />
      <Stack.Screen
        name="item/[id]"
        options={{
          presentation: 'modal',
          headerShown: true,
          headerBackTitle: 'Back',
          title: 'Item Details',
        }}
      />
    </Stack>
  );
}
