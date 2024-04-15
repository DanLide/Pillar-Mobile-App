import { NativeEventEmitter, NativeModules } from 'react-native';

const { MasterLockModule } = NativeModules;
export const MasterLockStateListener = new NativeEventEmitter(MasterLockModule);

interface MasterLockInterface {
  configure(license: string): Promise<string>;
  deinit(): Promise<string>;
  initLock(
    deviceId: string,
    accessProfile: string,
    firmwareVersion: number,
  ): Promise<string>;
  readRelockTime(deviceId: string): Promise<string>;
  writeRelockTime(deviceId: string, time: number): Promise<string>; // time range is 4..60
  unlock(deviceId: string): Promise<string>;
}
export default MasterLockModule as MasterLockInterface;

export enum LockVisibility {
  VISIBLE = 'VISIBLE',
  UNKNOWN = 'UNKNOWN',
}

export enum LockStatus {
  UNKNOWN = 'UNKNOWN',
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  OPEN = 'OPEN',
  OPEN_LOCKED = 'OPEN_LOCKED',
  PENDING_UNLOCK = 'PENDING_UNLOCK',
  PENDING_RELOCK = 'PENDING_RELOCK',
}
