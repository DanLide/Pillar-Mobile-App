import { Permission } from '../../constants';
import { getPermissionSets } from './getPermissionSets';
// import { all, any } from 'ramda';

const ENUM_BASE = 64; // .NET ULong base

export const hasPermission = (
  permission: Permission,
  { permissionSets } = getPermissionSets(),
): boolean => {
  const permissionsSet = permissionSets[(permission / ENUM_BASE) >> 0];

  const permissionValue = BigInt(1) << BigInt(permission % ENUM_BASE);

  return BigInt(permissionsSet & permissionValue) == permissionValue;
};

// export const hasAllPermissions = all(hasPermission);
//
// export const hasAnyPermissions = any(hasPermission);
