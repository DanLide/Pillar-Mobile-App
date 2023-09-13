import { authStore } from '../../stores';

export interface GetAuthToken {
  getToken: string | undefined;
  getRefreshToken: string | undefined;
  isTokenExpired: boolean;
}

export const getAuthToken = (): GetAuthToken => authStore;
