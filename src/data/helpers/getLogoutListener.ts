import { authStore } from '../../stores';
import { LogoutListener } from './tryFetch';

export const getLogoutListener = (): LogoutListener => authStore;
