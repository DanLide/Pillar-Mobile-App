import { EmitterSubscription } from 'react-native';
import { SouthcoBleDevice } from './SouthcoBleDevice';
export declare class SouthcoBleManager {
  private static instance;
  private static _lockStateChangeEventEmitter;
  private static _keyChangeStateNotificationEventEmitter;
  private static _deviceFoundEmitter;
  private static _deviceDisconnectedEventEmitter;
  private static _deviceLostEventEmitter;
  private _bleManager;
  private _connectedDevice;
  private readonly _matchLostTimeout;
  private readonly _checkInterval;
  private _deviceTimers;
  private _connectToDeviceTimerId;
  private _intervalTimerId;
  private static _advertisedServices;
  private constructor();
  static getInstance(): SouthcoBleManager;
  static addLockStateChangedListener(
    listener: (eventData: any) => void,
  ): EmitterSubscription;
  static removeListener(subscription: EmitterSubscription): void;
  static lockStateChange(state: string): void;
  static addChangeKeyStateNotificationListener(
    listener: (eventData: any) => void,
  ): EmitterSubscription;
  static changeKeyState(state: string): void;
  static addDeviceFoundListener(
    listener: (eventData: any) => void,
  ): EmitterSubscription;
  static addDeviceDisconnectedListener(
    listener: (eventData: any) => void,
  ): EmitterSubscription;
  static deviceDisconnected(deviceId: string): void;
  static addDeviceLostListener(
    listener: (eventData: any) => void,
  ): EmitterSubscription;
  startDeviceScan(): void;
  startDeviceScan(callback: (newDevice: SouthcoBleDevice) => void): void;
  stopDeviceScan(): void;
  connectToDevice(device: SouthcoBleDevice): Promise<SouthcoBleDevice>;
  cancelDeviceConnection(deviceId: string): Promise<void>;
  isDeviceConnected(deviceId: string): Promise<boolean>;
}
