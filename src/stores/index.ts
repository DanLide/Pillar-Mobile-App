import { AuthStore } from './AuthStore';
import { SSOStore, SSOModel } from './SSOStore';
import { CabinetStore } from './CabinetStock';

const authStore = new AuthStore();
const ssoStore = new SSOStore();
const cabinetStore = new CabinetStore();

export { authStore, ssoStore, cabinetStore };
