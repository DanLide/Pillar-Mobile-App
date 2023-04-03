import { authStore } from '../../stores';

export interface GetAuthToken {
  getToken: string | undefined;
}

export const getAuthToken = (): GetAuthToken => authStore;
