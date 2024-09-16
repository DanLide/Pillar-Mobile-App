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
import { DeviceEventEmitter } from 'react-native';
import { SouthcoBleDevice } from './SouthcoBleDevice';
// import { BleManager, LogLevel } from 'react-native-ble-plx';
export class SouthcoBleManager {
  constructor() {
    if (!(this instanceof SouthcoBleManager)) {
      throw Error('SouthcoBleManager must be instantiated with `new`');
    }
    console.log('Southco BLE - SDK Version: 0.11.0'); //${packageJson.version}
    this._scannedDevices = [];
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
  static addSensorStatusChangedListener(listener) {
    console.log('SouthcoBleManager.addSensorStatusChangedListener: Enter');
    return SouthcoBleManager._sensorStatusChangedEventEmitter.addListener(
      'SouthcoBleDeviceSensorStatusChanged',
      listener,
    );
  }
  get scannedDevices() {
    return this._scannedDevices;
  }
  isDuplicateDevice(nextDevice) {
    return (
      this._scannedDevices.findIndex(device => nextDevice.id === device.id) > -1
    );
  }
  sensorStatusChanged(nextDevice) {
    const index = this._scannedDevices.findIndex(
      device => nextDevice.id === device.id,
    );
    const sensorStatus = Buffer.from(nextDevice.manufacturerData, 'base64')
      .toString('hex')
      .substring(16, 18);
    if (sensorStatus !== this._scannedDevices[index].sensorStatus) return true;
    else return false;
  }
  startDeviceScan(callback) {
    console.log(
      `SouthcoBleManager.startDeviceScan: Enter: callback: ${
        callback ? 'Provided' : 'Null'
      }`,
    );
    this._bleManager.startDeviceScan(
      SouthcoBleManager._advertisedServices,
      null,
      (error, device) => {
        if (error) {
          console.log(`SouthcoBleManager: startDeviceScan: ${error}`);
        }
        if (device !== null) {
          if (!this.isDuplicateDevice(device)) {
            const southcoBleDevice = new SouthcoBleDevice(device);
            this._scannedDevices.push(southcoBleDevice);
            if (callback) {
              callback(southcoBleDevice);
            } else {
              SouthcoBleManager._deviceFoundEmitter.emit(
                'SouthcoBleDeviceDiscovered',
                { message: southcoBleDevice },
              );
            }
          } else {
            if (this.sensorStatusChanged(device)) {
              const sensorStatus = Buffer.from(
                device.manufacturerData,
                'base64',
              )
                .toString('hex')
                .substring(16, 18);
              const macAddress = Buffer.from(device.manufacturerData, 'base64')
                .toString('hex')
                .substring(0, 12);
              SouthcoBleManager._sensorStatusChangedEventEmitter.emit(
                'SouthcoBleDeviceSensorStatusChanged',
                {
                  macAddress: macAddress,
                  sensorStatus: sensorStatus,
                },
              );
            }
          }
        }
      },
    );
  }
  stopDeviceScan() {
    this._bleManager.stopDeviceScan();
    this._scannedDevices = [];
    this._connectedDevice = null;
  }
  connectToDevice(device) {
    return __awaiter(this, void 0, void 0, function* () {
      console.log(`SouthcoBleManager.connectToDevice: ${device.id}`);
      try {
        this._scannedDevices = [];
        const bleDevice = yield this._bleManager.connectToDevice(device.id, {
          autoConnect: true,
        });
        if (bleDevice === null) {
          throw new Error(
            'SouthcoBleManager.connectToDevice: Failed to connect to device',
          );
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
SouthcoBleManager._sensorStatusChangedEventEmitter = DeviceEventEmitter;
SouthcoBleManager._advertisedServices = [
  '0000be9e-0000-1000-8000-00805f9b34fb',
];
