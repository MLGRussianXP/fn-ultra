import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';

import { ScreenTransition } from '@/components/ui';
import { ShopScreen } from '@/features/fortnite/screens';

export default function Index() {
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
      <ShopScreen />
    </ScreenTransition>
  );
}
