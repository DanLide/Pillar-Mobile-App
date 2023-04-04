import { authStore } from '../../stores';

export interface GetPermissionSets {
  getPermissionSets?: bigint[];
}

export const getPermissionSets = (): GetPermissionSets => authStore;
