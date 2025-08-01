import { SplashScreen, Stack } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import { BoldTextFix } from '@/components/ui';
import { translate } from '@/lib/i18n';

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
    <>
      <BoldTextFix />
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitleStyle: {
            fontFamily: 'FORTNITE BATTLEFEST',
          },
          animation: 'none', // Disable default animations since we're using custom ones
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: translate('navigation.shop'),
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="item/[id]"
          options={{
            title: translate('navigation.item_details'),
            headerShown: true,
          }}
        />
      </Stack>
    </>
  );
}
