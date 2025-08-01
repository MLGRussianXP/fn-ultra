import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

/**
 * Utility component to ensure all navigation elements use our font
 * This applies the FORTNITE BATTLEFEST font to tab bar labels and headers
 */
export function NavigationFontProvider() {
  const navigation = useNavigation();

  useEffect(() => {
    // Apply global navigation styling
    if (navigation) {
      // Apply to tab bar
      navigation.setOptions({
        tabBarLabelStyle: styles.tabBarLabel,
      });

      // Apply to header
      navigation.setOptions({
        headerTitleStyle: styles.headerTitle,
        headerBackTitleStyle: styles.headerBackTitle,
      });
    }
  }, [navigation]);

  return null;
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
  headerBackTitle: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
});
