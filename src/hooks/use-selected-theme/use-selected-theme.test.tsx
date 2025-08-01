import { renderHook } from '@testing-library/react-native';

import { useSelectedTheme } from './use-selected-theme';

describe('useSelectedTheme', () => {
  it('returns a theme and a setter', () => {
    const { result } = renderHook(() => useSelectedTheme());
    expect(result.current.selectedTheme).toBe('system');
    expect(result.current.setSelectedTheme).toBeDefined();
  });
});
