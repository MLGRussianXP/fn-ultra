import * as React from 'react';
import { StyleSheet } from 'react-native';

import { AnimatedPressable, Text, View } from '@/components/ui';
import { ArrowRight } from '@/components/ui/icons';
import type { TxKeyPath } from '@/lib/i18n';

// Explicit styles for item elements
const styles = StyleSheet.create({
  itemText: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
  itemValue: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
});

type ItemProps = {
  text: TxKeyPath;
  value?: string;
  onPress?: () => void;
  icon?: React.ReactNode;
};

export const Item = ({ text, value, icon, onPress }: ItemProps) => {
  const isPressable = onPress !== undefined;
  return (
    <AnimatedPressable
      onPress={onPress}
      pointerEvents={isPressable ? 'auto' : 'none'}
      className="flex-1 flex-row items-center justify-between px-4 py-2"
      scaleFactor={0.98}
      useSpring={true}
      disabled={!isPressable}
    >
      <View className="flex-row items-center">
        {icon && <View className="pr-2">{icon}</View>}
        <Text tx={text} style={styles.itemText} />
      </View>
      <View className="flex-row items-center">
        <Text
          className="text-neutral-600 dark:text-white"
          style={styles.itemValue}
        >
          {value}
        </Text>
        {isPressable && (
          <View className="pl-2">
            <ArrowRight />
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
};
