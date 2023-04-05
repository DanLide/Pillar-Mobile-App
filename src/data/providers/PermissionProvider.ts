import { Permissions, permissions } from '../helpers';
import { Permission } from '../../constants';

const ENUM_BASE = 64; // .NET ULong base

export class PermissionProvider {
  permissions: Permissions;

  constructor(_permissions = permissions()) {
    this.permissions = _permissions;
  }

  hasPermission(permission: Permission): boolean {
    const permissionSet = this.permissions.getPermissionSet;

    if (!permissionSet) return false;

    const permissionMask = permissionSet[(permission / ENUM_BASE) >> 0];
    const permissionValue = BigInt(1) << BigInt(permission % ENUM_BASE);

    return BigInt(permissionMask & permissionValue) == permissionValue;
  }
}
