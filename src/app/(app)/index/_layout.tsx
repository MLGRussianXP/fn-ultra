import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { Home, Search, Settings } from '@/components/ui/icons';
import { translate } from '@/lib/i18n';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 0,
            elevation: 0,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingHorizontal: 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#999',
          tabBarLabelStyle: {
            fontFamily: 'FORTNITE BATTLEFEST',
            fontSize: 10,
          },
          tabBarShowLabel: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => <Home color={color} />,
            tabBarLabel: ({ color }) => (
              <Text style={[styles.tabLabel, { color }]}>
                {translate('navigation.home').toUpperCase()}
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ color }) => <Search color={color} />,
            tabBarLabel: ({ color }) => (
              <Text style={[styles.tabLabel, { color }]}>
                {translate('navigation.search').toUpperCase()}
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color }) => <Settings color={color} />,
            tabBarLabel: ({ color }) => (
              <Text style={[styles.tabLabel, { color }]}>
                {translate('navigation.settings').toUpperCase()}
              </Text>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabLabel: {
    fontFamily: 'FORTNITE BATTLEFEST',
    fontSize: 10,
    marginTop: -5,
  },
});
