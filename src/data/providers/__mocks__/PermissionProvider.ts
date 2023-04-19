import { Permissions } from '../../helpers';

export const mockedPermissionSets = {
  empty: [],
  technician: [11825453766148080n, 35187664896000n],
  distributor: [4055666524160n, 105553187569672n],
  mso: [71635380355465215n, 35235061286904n],
  admin: [18446462598732840959n, 15852741057088323583n],
};

export const getPermissionsMock = (permissionSet: bigint[]): Permissions => ({
  getPermissionSet: permissionSet,
});
