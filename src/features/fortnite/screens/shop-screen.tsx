import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';

import { ScreenTransition } from '@/components/ui';

import { ShopScreen as ShopScreenComponent } from '../components/shop-screen';

export function ShopScreen() {
  const [isFocused, setIsFocused] = React.useState(false);

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
      <ShopScreenComponent />
    </ScreenTransition>
  );
}
