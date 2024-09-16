import { AuthStore } from './AuthStore';
import { SSOStore } from './SSOStore';
import { DeviceInfoStore } from './DeviceInfoStore';
import { MasterLockStore } from './MasterLockStore';
import permissionStoreInstance from 'src/modules/permissions/stores/PermissionStore';
import { SouthcoStore } from './SouthcoStore/SouthcoStore';

const authStore = new AuthStore();
const ssoStore = new SSOStore();
const deviceInfoStore = new DeviceInfoStore();
const masterLockStore = new MasterLockStore(permissionStoreInstance);
const southcoStore = new SouthcoStore();

export { authStore, ssoStore, deviceInfoStore, masterLockStore, southcoStore };
