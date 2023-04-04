import { authStore } from '../../stores';

export interface GetPermissionSets {
  permissionSets: bigint[];
}

export const getPermissionSets = (): GetPermissionSets => authStore;
