import { authStore } from '../../stores';

export interface Permissions {
  getPermissionSet?: bigint[];
}

export const permissions = (): Permissions => authStore;
