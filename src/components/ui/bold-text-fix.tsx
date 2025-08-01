import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

/**
 * This component applies fixes for specific components that might be using bold text
 * It directly sets styles on navigation components
 */
export function BoldTextFix() {
  const navigation = useNavigation();

  useEffect(() => {
    if (!navigation) return;

    // Apply font to navigation headers
    try {
      // Set default header styles
      navigation.setOptions({
        headerTitleStyle: styles.headerTitle,
        headerBackTitleStyle: styles.headerTitle,
      });
    } catch (error) {
      // Ignore errors, this is just a best-effort fix
      console.log('Font fix error:', error);
    }
  }, [navigation]);

  return null;
}

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: 'FORTNITE BATTLEFEST',
  },
});
