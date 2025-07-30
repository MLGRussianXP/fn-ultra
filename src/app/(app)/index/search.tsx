import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';

import { ScreenTransition } from '@/components/ui';
import { SearchScreen } from '@/features/search/screens';

export default function SearchPage() {
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
      <SearchScreen />
    </ScreenTransition>
  );
}
