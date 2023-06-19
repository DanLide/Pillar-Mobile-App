import { renderHook } from '@testing-library/react-hooks';

import { useTimeout } from '..';

describe('useTimeout', () => {
  it('should call callback after delay', async () => {
    const mockCallback = jest.fn();
    const delay = 100;
    const { waitFor } = renderHook(() => useTimeout(mockCallback, delay));
    await waitFor(() => expect(mockCallback).toHaveBeenCalled());
  });
});
