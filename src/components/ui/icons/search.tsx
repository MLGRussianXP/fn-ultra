import * as React from 'react';
import { Path, Svg } from 'react-native-svg';

export function Search(props: { color?: string; size?: number }) {
  const { color = '#000', size = 24 } = props;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4a7 7 0 1 1 0 14a7 7 0 0 1 0-14zm0 2a5 5 0 1 0 0 10a5 5 0 0 0 0-10zm7.707 13.293a1 1 0 0 1-1.414 0l-3.387-3.387a8 8 0 1 1 1.414-1.414l3.387 3.387a1 1 0 0 1 0 1.414z"
        fill={color}
      />
    </Svg>
  );
}
