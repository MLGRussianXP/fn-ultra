import { Env } from '@env';
import { useColorScheme } from 'nativewind';
import { Linking, StyleSheet } from 'react-native';

import {
  colors,
  FocusAwareStatusBar,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { Github, Star } from '@/components/ui/icons';
import { ShopUpdatesToggle } from '@/features/notifications/components/shop-updates-toggle/shop-updates-toggle';
import { translate } from '@/lib/i18n';

import { Item, ItemsContainer, LanguageItem, ThemeItem } from '../components';

const GITHUB_REPO = 'https://github.com/MLGRussianXP/fn-ultra';

// Explicit styles for settings elements
const styles = StyleSheet.create({
  title: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
});

export function SettingsScreen() {
  const { colorScheme } = useColorScheme();
  const iconColor =
    colorScheme === 'dark' ? colors.neutral[400] : colors.neutral[500];

  const handleOpenGithub = () => {
    Linking.openURL(GITHUB_REPO);
  };

  const handleStarRepo = () => {
    Linking.openURL(`${GITHUB_REPO}/stargazers`);
  };

  return (
    <>
      <FocusAwareStatusBar />

      <ScrollView>
        <View className="flex-1 px-4 pt-6">
          <Text className="text-xl" style={styles.title}>
            {translate('settings.title')}
          </Text>
          <ItemsContainer title="settings.generale">
            <LanguageItem />
            <ThemeItem />
            <ShopUpdatesToggle />
          </ItemsContainer>

          <ItemsContainer title="settings.about">
            <Item text="settings.app_name" value={Env.NAME} />
            <Item text="settings.version" value={Env.VERSION} />
            <Item
              text="settings.github"
              icon={<Github color={iconColor} />}
              onPress={handleOpenGithub}
            />
            <Item
              text="settings.star"
              icon={<Star color={iconColor} />}
              onPress={handleStarRepo}
            />
          </ItemsContainer>
        </View>
      </ScrollView>
    </>
  );
}
