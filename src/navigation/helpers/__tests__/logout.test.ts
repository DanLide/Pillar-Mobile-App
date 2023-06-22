import { logout } from '../logout';
import { authStore } from '../../../stores';

jest.mock('../../../stores');

describe('logout', () => {
  it('should call authStore.logOut on logout', () => {
    logout();
    expect(authStore.logOut).toHaveBeenCalled();
  });
});
