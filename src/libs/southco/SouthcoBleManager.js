'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
//import packageJson from '../package.json';
import { DeviceEventEmitter, Platform } from 'react-native';
import { SouthcoBleDevice } from './SouthcoBleDevice';
import { ScanCallbackType } from 'react-native-ble-plx';
export class SouthcoBleManager {
  constructor() {
    this._matchLostTimeout = 10000; // Time in milliseconds after which a device is considered "lost"
    this._checkInterval = 5000; // Interval to check for lost devices
    this._deviceTimers = {};
    this._connectToDeviceTimerId = null;
    this._intervalTimerId = null;
    if (!(this instanceof SouthcoBleManager)) {
      throw Error('SouthcoBleManager must be instantiated with `new`');
    }
    console.log('Southco BLE - SDK Version: 0.12.0'); //${packageJson.version}
    this._deviceTimers = {};
    this._connectedDevice = null;
    // this._bleManager = new BleManager();
    // this._bleManager.setLogLevel(LogLevel.Verbose);
  }
  static getInstance() {
    if (!SouthcoBleManager.instance) {
      SouthcoBleManager.instance = new SouthcoBleManager();
    }
    return SouthcoBleManager.instance;
  }
  static addLockStateChangedListener(listener) {
    console.log('SouthcoBleManager.addLockStateChangedListener: Enter');
    return SouthcoBleManager._lockStateChangeEventEmitter.addListener(
      'SouthcoBleLockStateChange',
      listener,
    );
  }
  static removeListener(subscription) {
    console.log('SouthcoBleManager.removeListener: Enter');
    subscription.remove();
  }
  static lockStateChange(state) {
    console.log(`SouthcoBleManager.deviceStateChange: state: ${state}`);
    SouthcoBleManager._lockStateChangeEventEmitter.emit(
      'SouthcoBleLockStateChange',
      { state: state },
    );
  }
  static addChangeKeyStateNotificationListener(listener) {
    console.log(
      'SouthcoBleManager.addChangeKeyStateNotificationListener: Enter',
    );
    return SouthcoBleManager._keyChangeStateNotificationEventEmitter.addListener(
      'SouthcoBleChangeKeyStateNotification',
      listener,
    );
  }
  static changeKeyState(state) {
    console.log(`SouthcoBleManager.changeKeyState: state: ${state}`);
    SouthcoBleManager._lockStateChangeEventEmitter.emit(
      'SouthcoBleChangeKeyStateNotification',
      { state: state },
    );
  }
  static addDeviceFoundListener(listener) {
    console.log('SouthcoBleManager.addDeviceFoundListener: Enter');
    return SouthcoBleManager._deviceFoundEmitter.addListener(
      'SouthcoBleDeviceDiscovered',
      listener,
    );
  }
  static addDeviceDisconnectedListener(listener) {
    console.log('SouthcoBleManager.addDeviceDisconnectedListener: Enter');
    return SouthcoBleManager._deviceDisconnectedEventEmitter.addListener(
      'SouthcoBleDeviceDisconnected',
      listener,
    );
  }
  static deviceDisconnected(deviceId) {
    console.log(`SouthcoBleManager.deviceDisconnected: deviceId: ${deviceId}`);
    SouthcoBleManager._deviceDisconnectedEventEmitter.emit(
      'SouthcoBleDeviceDisconnected',
      { deviceId: deviceId },
    );
  }
  static addDeviceLostListener(listener) {
    console.log('SouthcoBleManager.addDeviceLostListener: Enter');
    return SouthcoBleManager._deviceLostEventEmitter.addListener(
      'SouthcoBleDeviceLost',
      listener,
    );
  }
  startDeviceScan(callback) {
    console.log(
      `SouthcoBleManager.startDeviceScan: Enter: callback: ${
        callback ? 'Provided' : 'Null'
      }`,
    );
    const scanOptions = {
      allowDuplicates: Platform.OS === 'ios', // Allow duplicates on iOS only
      callbackType:
        Platform.OS === 'android' ? ScanCallbackType.AllMatches : undefined, // Handle all matches on Android
    };
    const scanDevices = () => {
      this._bleManager.startDeviceScan(
        SouthcoBleManager._advertisedServices,
        scanOptions,
        (error, device) => {
          if (error) {
            console.log(`SouthcoBleManager: startDeviceScan: ${error}`);
            return;
          }
          if (device) {
            const currentTime = Date.now();
            // console.log(`Found device: ${device.id} at ${new Date().toISOString()}`);
            if (!this._deviceTimers[device.id]) {
              const southcoBleDevice = new SouthcoBleDevice(device);
              if (callback) {
                callback(southcoBleDevice);
              } else {
                SouthcoBleManager._deviceFoundEmitter.emit(
                  'SouthcoBleDeviceDiscovered',
                  { message: southcoBleDevice },
                );
              }
            }
            this._deviceTimers[device.id] = currentTime;
          }
        },
      );
    };
    scanDevices();
    // Set up an interval to periodically check for lost devices
    this._intervalTimerId = setInterval(() => {
      const currentTime = Date.now();
      for (const deviceId in this._deviceTimers) {
        // eslint-disable-next-line no-prototype-builtins
        if (this._deviceTimers.hasOwnProperty(deviceId)) {
          const timeSinceLastSeen = currentTime - this._deviceTimers[deviceId];
          if (timeSinceLastSeen > this._matchLostTimeout) {
            console.log(
              `Device lost: ${deviceId} at ${new Date().toISOString()}`,
            );
            SouthcoBleManager._deviceLostEventEmitter.emit(
              'SouthcoBleDeviceLost',
              { deviceId: deviceId },
            );
            delete this._deviceTimers[deviceId];
          }
        }
      }
    }, this._checkInterval);
  }
  stopDeviceScan() {
    if (this._intervalTimerId) {
      clearTimeout(this._intervalTimerId);
    }
    this._bleManager.stopDeviceScan();
    this._deviceTimers = {};
    this._connectedDevice = null;
  }
  connectToDevice(device) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(`SouthcoBleManager.connectToDevice: ${device.id}`);
      try {
        this._deviceTimers = {};
        this._connectToDeviceTimerId = setTimeout(
          () =>
            __awaiter(this, void 0, void 0, function* () {
              console.log(
                'SouthcoBleManager.connectToDevice: unresponsive device',
              );
              yield this._bleManager.cancelDeviceConnection(device.id);
              throw new Error();
            }),
          5000,
        );
        const bleDevice = yield this._bleManager.connectToDevice(device.id, {
          autoConnect: true,
        });
        if (bleDevice === null) {
          throw new Error(
            'SouthcoBleManager.connectToDevice: Failed to connect to device',
          );
        }
        if (this._connectToDeviceTimerId) {
          clearTimeout(this._connectToDeviceTimerId);
          this._connectToDeviceTimerId = null;
          console.log('SouthcoBleManager.connectToDevice: Timer cleared out');
        }
        this._connectedDevice = new SouthcoBleDevice(
          bleDevice,
          device.advertisingPayload,
        );
        const isConnected = yield this._bleManager.isDeviceConnected(
          this._connectedDevice.id,
        );
        if (isConnected) {
          console.log(
            `SouthcoBleManager.connectToDevice: advertisingPayload: ${device.advertisingPayload}`,
          );
          yield this._connectedDevice.discoverAllServicesAndCharacteristics();
        }
        console.log(
          `Device ${this._connectedDevice.id} connected and services discovered.`,
        );
        return this._connectedDevice;
      } catch (error) {
        console.error(`SouthcoBleManager.connectToDevice: ${error}`);
        throw error;
      }
    });
  }
  cancelDeviceConnection(deviceId) {
    return __awaiter(this, void 0, void 0, function* () {
      this._connectedDevice = null;
      yield this._bleManager.cancelDeviceConnection(deviceId);
    });
  }
  isDeviceConnected(deviceId) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this._bleManager.isDeviceConnected(deviceId);
    });
  }
}
SouthcoBleManager._lockStateChangeEventEmitter = DeviceEventEmitter;
SouthcoBleManager._keyChangeStateNotificationEventEmitter = DeviceEventEmitter;
SouthcoBleManager._deviceFoundEmitter = DeviceEventEmitter;
SouthcoBleManager._deviceDisconnectedEventEmitter = DeviceEventEmitter;
SouthcoBleManager._deviceLostEventEmitter = DeviceEventEmitter;
SouthcoBleManager._advertisedServices = [
  '0000be9e-0000-1000-8000-00805f9b34fb',
];
