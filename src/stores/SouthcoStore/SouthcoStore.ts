import { SCLockStatusEnum, SouthcoBleDevice, getSCLockParams } from 'src/libs';
import { BleManager } from 'react-native-ble-plx';

import { observable, action, makeObservable, computed } from 'mobx';
import { delay } from 'src/helpers';
import { SCLockModel } from './SCLockModel';
import { DeviceEventEmitter } from 'react-native';
import { LoggingService } from 'src/services';

const ADVERTISED_SERVICES = ['0000be9e-0000-1000-8000-00805f9b34fb'];

const generateKey = (id: string) => {
  const mid = id.split('').reverse().join('');
  const first = id.substring(4);
  return `${first}${mid}${id}`;
};

const creteException = ({
  error,
  type,
  macAddress,
}: {
  error?: unknown;
  type: string;
  macAddress: string;
}) => {
  const err = error as Error;
  return `${type}\nMacAddress: ${macAddress}\n${
    err?.message ?? 'Unknown error'
  }`;
};

const CONNECTION_ERROR = 'Failed to connect to device';
const REGISTRATION_ERROR = 'Failed to register the lock';
const UNLOCKING_ERROR = 'Failed to open the lock';

export class SouthcoStore {
  private _bleManager: BleManager;
  private _scannedDevices: Map<string, SouthcoBleDevice> = new Map();
  private _connectedDevice: SouthcoBleDevice | null = null;

  @observable
  locks: Map<string, SCLockModel> = new Map();
  @observable
  isUnlocking = false;

  constructor() {
    makeObservable(this);
    this._bleManager = new BleManager();

    DeviceEventEmitter.addListener(
      'SCLStateUpdate',
      (data: { id: string; state: SCLockStatusEnum }) => {
        const lock = this.locks.get(data.id);
        if (lock) {
          lock.updateStatus(data.state);
          if (data.state === 'LOCKED') {
            this.disconnectDevice();
          }
        }
      },
    );

    DeviceEventEmitter.addListener(
      'SCLChangeKeyState',
      (data: { id: string; state: 'Successful' | 'Failed' }) => {
        const lock = this.locks.get(data.id);
        if (lock) {
          if (data.state === 'Failed') {
            lock.updateStatus(SCLockStatusEnum.UNKNOWN);
            this.setIsUnlocking(false);
          } else {
            lock.setIsRegistered(true);
            this.startUnlockProcess(lock.id);
          }
        }
      },
    );
  }

  @computed
  get deviceArray() {
    return Array.from(this.locks.values());
  }

  @computed
  get openedLockId() {
    return this.deviceArray.find(i => i.status === SCLockStatusEnum.UNLOCKED)
      ?.id;
  }

  get isUnlockInProgress() {
    return this.isUnlocking || this.openedLockId;
  }

  @action
  setIsUnlocking(val: boolean) {
    this.isUnlocking = val;
  }

  @action
  setDevice(device: SouthcoBleDevice) {
    this._scannedDevices.set(device.macAddress, device);
    this.locks.set(
      device.macAddress,
      new SCLockModel({
        id: device.macAddress,
        status: device.lockState,
        isRegistered: device.isRegistered(),
      }),
    );
  }

  async disconnectDevice() {
    if (this._connectedDevice) {
      await this._bleManager.cancelDeviceConnection(this._connectedDevice?.id);
      this._connectedDevice = null;
    }
  }

  isDuplicatedDevice(manufacturerData?: string | null) {
    if (!manufacturerData) return false;
    const { macAddress } = getSCLockParams(manufacturerData);
    return this._scannedDevices.has(macAddress);
  }

  isLockStatusChanged(manufacturerData?: string | null) {
    if (!manufacturerData) return false;
    const { macAddress, sensorStatus, isRegister } =
      getSCLockParams(manufacturerData);
    const device = this._scannedDevices.get(macAddress);
    return (
      sensorStatus !== device?.sensorStatus ||
      isRegister !== device?.isRegistered()
    );
  }

  startDeviceScan() {
    if (!this.isUnlockInProgress) {
      this.disconnectDevice();
    }
    this._bleManager.startDeviceScan(
      ADVERTISED_SERVICES,
      { allowDuplicates: true },
      (error, device) => {
        if (error) {
          LoggingService.logException(
            `SC Locks scanning error - ${error?.iosErrorCode} ${error?.reason}`,
          );
        }
        if (device !== null) {
          if (!this.isDuplicatedDevice(device.manufacturerData)) {
            const southcoBleDevice = new SouthcoBleDevice(device);
            this.setDevice(southcoBleDevice);
          } else if (this.isLockStatusChanged(device.manufacturerData)) {
            const southcoBleDevice = new SouthcoBleDevice(device);
            this.setDevice(southcoBleDevice);
          }
        }
      },
    );
  }

  @action
  stopDeviceScan() {
    if (!this.isUnlockInProgress) {
      this._scannedDevices = new Map();
      this.locks = new Map();
      this._bleManager.stopDeviceScan();
    }
  }

  @action
  async connectToDevice(device: SouthcoBleDevice) {
    const preConnected = this._connectedDevice?.id === device.id;
    try {
      if (preConnected) {
        const isConnected = await this._bleManager.isDeviceConnected(device.id);
        if (isConnected) {
          return;
        }
        await this.disconnectDevice();
      } else {
        await this.disconnectDevice();
      }

      const bleDevice = await this._bleManager.connectToDevice(device.id, {
        autoConnect: true,
      });

      if (bleDevice === null) {
        throw new Error(
          creteException({
            type: CONNECTION_ERROR,
            macAddress: device?.macAddress ?? 'Unknown id',
          }),
        );
      }
      const newDevice = new SouthcoBleDevice(
        bleDevice,
        device.advertisingPayload,
      );
      this._connectedDevice = newDevice;

      const isConnected = await this._bleManager.isDeviceConnected(
        newDevice.id,
      );
      if (isConnected) {
        console.log(
          `SouthcoBleManager: connectToDevice: advertisingPayload: ${device.advertisingPayload}`,
        );
        await newDevice.discoverAllServicesAndCharacteristics();
      }
      console.log(`Device ${newDevice.id} connected and services discovered.`);
    } catch (error) {
      this._scannedDevices.delete(device.macAddress);
      this._connectedDevice = null;
      throw new Error(
        creteException({
          type: CONNECTION_ERROR,
          macAddress: device?.macAddress ?? 'Unknown id',
          error,
        }),
      );
    }
  }

  async registerLock(id: string) {
    const key = generateKey(id);
    const lock = this.locks.get(id);
    try {
      await this._connectedDevice?.changePrimaryKey(key);
    } catch (error) {
      LoggingService.logException(
        creteException({
          type: REGISTRATION_ERROR,
          error,
          macAddress: lock?.id ?? 'Unknown id',
        }),
      );
    }
  }

  async openLock(id: string) {
    const key = generateKey(id);
    try {
      await this._connectedDevice?.openWithAutoLock(10, key);
    } catch (error) {
      throw new Error(
        creteException({
          type: UNLOCKING_ERROR,
          error,
          macAddress: id ?? 'Unknown id',
        }),
      );
    }
  }

  async startUnlockProcess(id: string) {
    const device = this._scannedDevices.get(id);
    const lock = this.locks.get(id);
    if (device && lock) {
      this.setIsUnlocking(true);
      try {
        LoggingService.logEvent('Unlock SC lock', {
          macAddress: device.macAddress,
          isRegistered: device.isRegistered() ? 'Y' : 'N',
          port: device.port,
          sensorStatus: device.sensorStatus,
          batteryData: device.batteryData,
          latchType: device.latchType,
        });
      } catch (error) {
        LoggingService.logException(error);
      }
      try {
        await this.connectToDevice(device);
        await delay(200);
        if (this._connectedDevice) {
          if (!lock.isRegistered && !this._connectedDevice.isRegistered()) {
            this.registerLock(id);
            return;
          }
          await this.openLock(id);
        }
        await delay(2000);
      } catch (err) {
        LoggingService.logException(err);
        lock?.updateStatus(SCLockStatusEnum.UNKNOWN);
      } finally {
        this.setIsUnlocking(false);
      }
    }
  }
}