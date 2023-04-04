import { authStore } from '../../stores';

export interface PermissionSets {
  permissionSets: bigint[];
}

export const getPermissionSets = (): PermissionSets => authStore;
