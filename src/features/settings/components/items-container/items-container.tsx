import React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/ui';
import type { TxKeyPath } from '@/lib/i18n';

// Explicit styles for container elements
const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: 'FORTNITE BATTLEFEST',
    textTransform: 'uppercase',
  },
});

type Props = {
  children: React.ReactNode;
  title?: TxKeyPath;
};

export const ItemsContainer = ({ children, title }: Props) => {
  return (
    <>
      {title && (
        <Text
          className="pb-2 pt-4 text-lg"
          tx={title}
          style={styles.sectionTitle}
        />
      )}
      {
        <View className="rounded-md border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
          {children}
        </View>
      }
    </>
  );
};
