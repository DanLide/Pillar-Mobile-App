import { NativeEventEmitter } from "react-native";
import { EmitterSubscription, NativeModules } from "react-native";

const {MasterLockModule} = NativeModules;
export const MasterLockStateListener = new NativeEventEmitter(MasterLockModule);
 
interface MasterLockInterface {
    configure(license: string): Promise<string>;
    deinit(): Promise<string>;
    initLock(deviceId: string, accessProfile: string, firmwareVersion: number): Promise<string>;
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

// // temp
// import {
//   observable,
//   runInAction,
//   reaction,
//   action,
//   makeAutoObservable,
// } from 'mobx';



type listenerType = 'visibilityStatus' | 'lockStatus';

export interface MasterLockInterface {
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

  addListener(
    eventType: listenerType,
    listener: (event: any) => void,
    context?: Object,
  ): EmitterSubscription;
  removeAllListeners(eventType: string): void;
}

// temp mock
// function getRandomValueFromArrayAfterDelay<T>(arr: T[]): Promise<T> {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       const randomIndex = Math.floor(Math.random() * arr.length);
//       const randomValue = arr[randomIndex];
//       resolve(randomValue);
//     }, 1000); // 1000 milliseconds = 1 second
//   });
// }

// function compareObjectsAndCallback(
//   obj1,
//   obj2,
//   callback: (changedField: string) => void,
// ) {
//   for (const key in obj1) {
//     if (obj1[key] !== obj2[key]) {
//       callback(`${key}/${obj1[key]}`);
//     }
//   }
// }

// const initRandomVisibility = [
//   LockVisibility.VISIBLE,
//   // LockVisibility.UNKNOWN
// ];

// const initRandomValue = [
//   // LockStatus.UNKNOWN,
//   LockStatus.LOCKED,
//   // LockStatus.UNLOCKED,
//   // LockStatus.OPEN,
//   // LockStatus.OPEN_LOCKED,
//   // LockStatus.PENDING_UNLOCK,
//   // LockStatus.PENDING_RELOCK,
// ];

// const unlockRandomValue = [
//   // LockStatus.UNKNOWN,
//   // LockStatus.UNLOCKED,
//   LockStatus.OPEN,
//   // LockStatus.PENDING_UNLOCK,
//   // LockStatus.PENDING_RELOCK,
// ];

// const afterPendingRandomValue = [
//   LockStatus.UNKNOWN,
//   LockStatus.OPEN,
//   LockStatus.LOCKED,
// ];

// class MasterLockModuleMock implements MasterLockInterface {
//   @observable private isConfigured: boolean;
//   @observable private isInited: boolean;
//   @observable private locksVisibility: Record<string, LockVisibility>;
//   @observable private locksStatus: Record<string, LockStatus>;
//   @observable callbackVisibilityStatus: null | ((event: string) => void);
//   @observable callbackLockStatus: null | ((event: string) => void);

//   constructor() {
//     makeAutoObservable(this);

//     this.isConfigured = false;
//     this.isInited = false;
//     this.locksVisibility = {};
//     this.locksStatus = {};

//     this.callbackVisibilityStatus = null;
//     this.callbackLockStatus = null;

//     reaction(
//       () => this.locksVisibility,
//       (value, prevValue) => {
//         if (this.callbackVisibilityStatus) {
//           compareObjectsAndCallback(
//             value,
//             prevValue,
//             this.callbackVisibilityStatus,
//           );
//         }
//       },
//     );

//     reaction(
//       () => this.locksStatus,
//       (value, prevValue) => {
//         if (this.callbackLockStatus) {
//           compareObjectsAndCallback(value, prevValue, this.callbackLockStatus);
//         }
//       },
//     );
//   }

//   @action configure(license: string) {
//     return new Promise<string>(resolve => {
//       this.isConfigured = !!license;
//       resolve('success');
//     });
//   }

//   @action initLock(
//     lockId: string,
//     accessProfile: string,
//     firmwareVersion: number,
//   ) {
//     return new Promise<string>(resolve => {
//       (async () => {
//         const randVisibility = await getRandomValueFromArrayAfterDelay(
//           initRandomVisibility,
//         );
//         if (randVisibility === LockVisibility.UNKNOWN) {
//           runInAction(() => {
//             this.locksVisibility = {
//               ...this.locksVisibility,
//               [lockId]: LockVisibility.UNKNOWN,
//             };
//             this.locksStatus = {
//               ...this.locksStatus,
//               [lockId]: LockStatus.UNKNOWN,
//             };
//           });
//           return resolve('success');
//         }

//         const randStatus = await getRandomValueFromArrayAfterDelay(
//           initRandomValue,
//         );
//         runInAction(() => {
//           this.locksVisibility = {
//             ...this.locksVisibility,
//             [lockId]: randVisibility,
//           };
//           this.locksStatus = {
//             ...this.locksStatus,
//             [lockId]: randStatus,
//           };
//           resolve('success');
//         });
       
//       })();
//     });
//   }

//   @action deinit() {
//     return new Promise<string>(resolve => {
//       resolve('success');
//     });
//   }

//   @action writeRelockTime(deviceId: string, time) {
//     return new Promise<string>(resolve => {
//       resolve('success');
//     });
//   }

//   @action readRelockTime(deviceId: string) {
//     return new Promise<string>(resolve => {
//       setTimeout(() => {
//         resolve('5');
//       }, 10000);
//     });
//   }

//   @action unlock(lockId: string) {
//     return new Promise<string>(resolve => {
//       (async () => {
//         const randStatus = await getRandomValueFromArrayAfterDelay(
//           unlockRandomValue,
//         );
//         runInAction(() => {
//           this.locksStatus = {
//             ...this.locksStatus,
//             [lockId]: randStatus,
//           };
//         });

//         if (randStatus === LockStatus.PENDING_RELOCK) {
//           setTimeout(async () => {
//             const randStatus = await getRandomValueFromArrayAfterDelay(
//               afterPendingRandomValue,
//             );

//             runInAction(() => {
//               this.locksStatus = {
//                 ...this.locksStatus,
//                 [lockId]: randStatus,
//               };
//             });
//           }, 5000);
//         }
//         resolve('success');
//       })();
//     });
//   }

//   @action addListener(
//     type: listenerType,
//     callback: (value: string) => void,
//   ): EmitterSubscription {
//     if (type === 'lockStatus') {
//       this.callbackLockStatus = callback;
//     } else {
//       this.callbackVisibilityStatus = callback;
//     }
//     return {
//       remove: () => {
//         if (type === 'lockStatus') {
//           this.callbackLockStatus = null;
//         } else {
//           this.callbackVisibilityStatus = null;
//         }
//       },
//       listener: () => {},
//     };
//   }
// }

// export default new MasterLockModuleMock() as MasterLockInterface;