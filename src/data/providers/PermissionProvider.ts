import { GetPermissionSets, getPermissionSets } from '../helpers';
import { Permission } from '../../constants';

const ENUM_BASE = 64; // .NET ULong base

export class PermissionProvider {
  permissionState: GetPermissionSets;

  constructor(permissionState = getPermissionSets()) {
    this.permissionState = permissionState;
  }

  hasPermission(permission: Permission): boolean {
    const permissionsSet =
      this.permissionState.permissionSets[(permission / ENUM_BASE) >> 0];

    if (!permissionsSet) return false;

    const permissionValue = BigInt(1) << BigInt(permission % ENUM_BASE);

    return BigInt(permissionsSet & permissionValue) == permissionValue;
  }
}
