import { Tabs } from 'expo-router';
import React from 'react';

import {
  Home as HomeIcon,
  Settings as SettingsIcon,
} from '@/components/ui/icons';

const tabBarLabelStyle = {
  fontFamily: 'FORTNITE BATTLEFEST',
  textTransform: 'uppercase',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle,
        headerTitleStyle: {
          fontFamily: 'FORTNITE BATTLEFEST',
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shop',
          headerShown: false,
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          tabBarButtonTestID: 'shop-tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}
