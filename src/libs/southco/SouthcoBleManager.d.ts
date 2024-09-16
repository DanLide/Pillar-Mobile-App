import { EmitterSubscription } from 'react-native';
import { SouthcoBleDevice } from './SouthcoBleDevice';
export declare class SouthcoBleManager {
  private static instance;
  private static _lockStateChangeEventEmitter;
  private static _keyChangeStateNotificationEventEmitter;
  private static _deviceFoundEmitter;
  private static _deviceDisconnectedEventEmitter;
  private static _sensorStatusChangedEventEmitter;
  private _bleManager;
  private _connectedDevice;
  private _scannedDevices;
  private static _advertisedServices;
  private constructor();
  static getInstance(): SouthcoBleManager;
  static addLockStateChangedListener(
    listener: (eventData: unknown) => void,
  ): EmitterSubscription;
  static removeListener(subscription: EmitterSubscription): void;
  static lockStateChange(state: string): void;
  static addChangeKeyStateNotificationListener(
    listener: (eventData: unknown) => void,
  ): EmitterSubscription;
  static changeKeyState(state: string): void;
  static addDeviceFoundListener(
    listener: (eventData: unknown) => void,
  ): EmitterSubscription;
  static addDeviceDisconnectedListener(
    listener: (eventData: unknown) => void,
  ): EmitterSubscription;
  static deviceDisconnected(deviceId: string): void;
  static addSensorStatusChangedListener(
    listener: (eventData: unknown) => void,
  ): EmitterSubscription;
  get scannedDevices(): SouthcoBleDevice[];
  private isDuplicateDevice;
  private sensorStatusChanged;
  startDeviceScan(): void;
  startDeviceScan(callback: (newDevice: SouthcoBleDevice) => void): void;
  stopDeviceScan(): void;
  connectToDevice(device: SouthcoBleDevice): Promise<SouthcoBleDevice>;
  cancelDeviceConnection(deviceId: string): Promise<void>;
  isDeviceConnected(deviceId: string): Promise<boolean>;
}
