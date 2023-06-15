import { renderHook, act } from '@testing-library/react-native';

import { useSwitchState } from '..';

describe('useSwitchState', () => {
  it('should change isEnabled', () => {
    const { result } = renderHook(() => useSwitchState());
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toEqual(true);
  });
});
