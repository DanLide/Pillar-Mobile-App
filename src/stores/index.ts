import { AuthStore } from './AuthStore';
import { SSOStore, SSOModel } from './SSOStore';
import { StockStore } from './StockStore';

const authStore = new AuthStore();
const ssoStore = new SSOStore();
const stockStore = new StockStore();

export { authStore, ssoStore, stockStore };
