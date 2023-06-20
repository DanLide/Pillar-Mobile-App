import { AuthStore } from './AuthStore';
import { BaseProductsStore } from './BaseProductsStore';
import { SSOStore } from './SSOStore';

const authStore = new AuthStore();
const ssoStore = new SSOStore();

export { BaseProductsStore, authStore, ssoStore };
