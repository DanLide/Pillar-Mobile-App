import { GetPermissionSets, getPermissionSets } from '../helpers';
import { Permission } from '../../constants';

const ENUM_BASE = 64; // .NET ULong base

export class PermissionProvider {
  permissionState: GetPermissionSets;

  constructor(permissionState = getPermissionSets()) {
    this.permissionState = permissionState;
  }

  hasPermission(permission: Permission): boolean {
    const permissionSets = this.permissionState.getPermissionSets;

    if (!permissionSets) return false;

    const permissionSet = permissionSets[(permission / ENUM_BASE) >> 0];
    const permissionValue = BigInt(1) << BigInt(permission % ENUM_BASE);

    return BigInt(permissionSet & permissionValue) == permissionValue;
  }
}
