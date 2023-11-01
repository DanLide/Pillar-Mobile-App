import { AuthStore } from './AuthStore';
import { SSOStore } from './SSOStore';
import {DeviceInfoStore} from './DeviceInfoStore';

const authStore = new AuthStore();
const ssoStore = new SSOStore();
const deviceInfoStore = new DeviceInfoStore();
export { authStore, ssoStore, deviceInfoStore };
