/// <reference types="node" />
import { Buffer } from 'buffer';
import { Characteristic, Device } from 'react-native-ble-plx';
import { SCLockStatusEnum } from '.';

export declare class SouthcoBleDevice {
  private _id;
  private _macAddress;
  private _name;
  private _bleDevice;
  private _advertisingPayload;
  private _manufacturerName;
  private _firmwareVersion;
  private _port;
  private _sensorStatus;
  private _batteryData;
  private _latchType;
  private static _registrationValue;
  private static _unregisteredDefaultKey;
  private static _salt;
  private static _secureMessage;
  private static _newKey;
  private static _processingKey;
  private static _primaryKey;
  private static _primaryKeyState;
  private static _lockState;
  private static _invalidPrimaryKeyTimerId;
  private static _changingKeyTimerId;
  private static _secureMessageMode;
  private static _latchStatus;
  private static _latches;
  private static _services;
  constructor(device: Device, advertisingPayload?: string);
  get id(): string;
  set id(value: string);
  get macAddress(): string;
  get name(): string;
  set name(value: string);
  get serviceUUIDs(): string[] | null;
  get advertisingPayload(): string;
  set advertisingPayload(value: string);
  get manufacturerName(): string | null;
  get firmwareVersion(): string | null;
  static getSalt(): string | undefined;
  isRegistered(): boolean;
  get port(): string;
  get sensorStatus(): string | null;
  get batteryData(): string | null;
  get latchType(): string | null;
  lockState: SCLockStatusEnum;
  private parseAdvertisingPayload;
  private computeUnregisteredDefaultKey;
  private setLatchStatus;
  private saltNotificationHandler;
  private secureMessageNotificationHandler;
  private static sleep;
  private primaryKeyNotificationHandler;
  discoverAllServicesAndCharacteristics(): Promise<void>;
  performOperation(
    port: Buffer,
    index: Buffer,
    plainText: string,
  ): Promise<Characteristic>;
  private purgeSaltArray;
  private validateKey;
  openWithAutoLock(
    requestedUnlockTime: number,
    primaryKey?: string | null,
  ): Promise<string>;
  unlock(primaryKey?: string | null): Promise<string>;
  lock(primaryKey?: string | null): Promise<string>;
  setLatchConfiguration(
    latchType: string,
    primaryKey?: string | null,
  ): Promise<string>;
  changePrimaryKey(newKey: string, primaryKey?: string | null): Promise<string>;
  private changePrimaryKeySecondPart;
}
