import { renderHook } from '@testing-library/react-native';

import { useIsFirstTime } from './use-is-first-time';

describe('useIsFirstTime', () => {
  it('returns a boolean value', () => {
    const { result } = renderHook(() => useIsFirstTime());
    expect(typeof result.current[0]).toBe('boolean');
  });
});
