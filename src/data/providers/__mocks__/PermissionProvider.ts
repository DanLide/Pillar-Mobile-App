import { Permissions } from '../../helpers';
import { PermissionProvider } from 'src/data/providers/PermissionProvider';

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

export const getRolePermissionProviders = () => {
  const technicianPermissions = new PermissionProvider(
    getPermissionsMock(mockedPermissionSets.technician)
  ).userPermissions

  const adminPermissions = new PermissionProvider(
    getPermissionsMock(mockedPermissionSets.admin)
  ).userPermissions

  const distributorPermissions = new PermissionProvider(
    getPermissionsMock(mockedPermissionSets.distributor)
  ).userPermissions

  const emptyPermissions = new PermissionProvider(
    getPermissionsMock(mockedPermissionSets.empty)
  ).userPermissions

  const msoPermissions = new PermissionProvider(
    getPermissionsMock(mockedPermissionSets.mso)
  ).userPermissions

  return {
    technicianPermissions,
    adminPermissions,
    distributorPermissions,
    emptyPermissions,
    msoPermissions
  }
}