import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';

import { ScreenTransition } from '@/components/ui';
import { ItemDetailsScreen } from '@/features/fortnite/screens';

export default function ItemDetails() {
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
    <ScreenTransition isFocused={isFocused} animationType="slide">
      <ItemDetailsScreen />
    </ScreenTransition>
  );
}
