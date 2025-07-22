import { renderHook } from '@testing-library/react-native';

import { useThemeConfig } from './use-theme-config';

describe('useThemeConfig', () => {
  it('returns a theme config', () => {
    const { result } = renderHook(() => useThemeConfig());
    expect(result.current).toBeDefined();
  });
});
