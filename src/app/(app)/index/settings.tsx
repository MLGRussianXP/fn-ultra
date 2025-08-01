import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';

import { ScreenTransition } from '@/components/ui';
import { SettingsScreen } from '@/features/settings/screens';

export default function Settings() {
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, [])
  );

  return (
    <ScreenTransition isFocused={isFocused} animationType="fade">
      <SettingsScreen />
    </ScreenTransition>
  );
}
