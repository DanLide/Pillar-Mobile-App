import { onGetRoleManager, GetRoleManagerTask } from '../getRoleManager';

import { getRoleManagerAPI } from '../api/getRoleManager';

jest.mock('../api/getRoleManager');

const mockToken = 'mockToken';

describe('getRoleManager', () => {
  it('should execute GetRoleManagerTask task', async () => {
    (getRoleManagerAPI as jest.Mock).mockReturnValue(undefined);
    const getRoleManagerTask = new GetRoleManagerTask({}, mockToken);
    await expect(getRoleManagerTask.run()).resolves.not.toThrow();
    expect(getRoleManagerAPI).toHaveBeenCalledWith(mockToken);
  });

  it('should throw Error GetRoleManagerTask task', async () => {
    (getRoleManagerAPI as jest.Mock).mockImplementation(() => {
      throw Error();
    });
    const getRoleManagerTask = new GetRoleManagerTask({}, mockToken);
    await expect(getRoleManagerTask.run()).rejects.toThrow();
    expect(getRoleManagerAPI).toHaveBeenCalledWith(mockToken);
  });

  it('should call onGetRoleManager', async () => {
    await onGetRoleManager(mockToken);
    expect(getRoleManagerAPI).toHaveBeenCalledWith(mockToken);
  });

});
