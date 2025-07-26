import { Tabs } from 'expo-router';
import React from 'react';
import { type TextStyle } from 'react-native';

import {
  Home as HomeIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from '@/components/ui/icons';

const tabBarLabelStyle: TextStyle = {
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
        } as TextStyle,
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
        name="search"
        options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ color }) => <SearchIcon color={color} />,
          tabBarButtonTestID: 'search-tab',
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
