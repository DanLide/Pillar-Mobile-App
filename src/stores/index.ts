import { AuthStore } from './AuthStore';
import { SSOStore } from './SSOStore';
import { DeviceInfoStore } from './DeviceInfoStore';
import { MasterLockStore } from './MasterLockStore';
import permissionStoreInstance from 'src/modules/permissions/stores/PermissionStore';

const authStore = new AuthStore();
const ssoStore = new SSOStore();
const deviceInfoStore = new DeviceInfoStore();
const masterLockStore = new MasterLockStore(permissionStoreInstance)

export { authStore, ssoStore, deviceInfoStore, masterLockStore };
