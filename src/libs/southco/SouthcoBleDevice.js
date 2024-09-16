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

import md5 from 'md5';
import { Aes } from 'data-crypto';

import { Buffer } from 'buffer';
import { DeviceEventEmitter } from 'react-native';
// import { SouthcoBleManager } from './SouthcoBleManager';
var States;
(function (States) {
  States[(States['unlock'] = 0)] = 'unlock';
  States[(States['unlockComplete'] = 1)] = 'unlockComplete';
  States[(States['openComplete'] = 2)] = 'openComplete';
  States[(States['close'] = 3)] = 'close';
  States[(States['closeComplete'] = 4)] = 'closeComplete';
  States[(States['lockComplete'] = 5)] = 'lockComplete';
})(States || (States = {}));
var OperationCodes;
(function (OperationCodes) {
  OperationCodes['unlock'] = '1a';
  OperationCodes['lock'] = '4f';
})(OperationCodes || (OperationCodes = {}));
var SecureMessageModes;
(function (SecureMessageModes) {
  SecureMessageModes[(SecureMessageModes['latchConfiguration'] = 0)] =
    'latchConfiguration';
  SecureMessageModes[(SecureMessageModes['latchOperating'] = 1)] =
    'latchOperating';
})(SecureMessageModes || (SecureMessageModes = {}));
const statesLength = Object.keys(States).filter(key =>
  isNaN(Number(key)),
).length;
export class SouthcoBleDevice {
  constructor(device, advertisingPayload) {
    this._macAddress = '';
    this._advertisingPayload = '';
    this._manufacturerName = null;
    this._firmwareVersion = null;
    this._port = '';
    this._sensorStatus = null;
    this._batteryData = null;
    this._latchType = null;
    this.secureMessageNotificationHandler =
      this.secureMessageNotificationHandler.bind(this);
    this.changePrimaryKey = this.changePrimaryKey.bind(this);
    this.primaryKeyNotificationHandler =
      this.primaryKeyNotificationHandler.bind(this);

    if (!(this instanceof SouthcoBleDevice)) {
      throw Error('SouthcoBleDevice must be instantiated with `new`');
    }
    this._id = device.id;
    this._name = 'Southco' + '\n' + device.id;
    this._bleDevice = device;
    this._advertisingPayload = advertisingPayload || '';
    if (advertisingPayload !== undefined) {
      console.log(
        `SouthcoBleDevice: Constructor: Advertising Payload: ${this._advertisingPayload}`,
      );
      this.parseAdvertisingPayload();
    } else {
      console.log(
        'SouthcoBleDevice: Constructor: Advertising Payload is undefined',
      );
    }
    if (device.manufacturerData !== null) {
      this._advertisingPayload = Buffer.from(
        device.manufacturerData,
        'base64',
      ).toString('hex');
      console.log(
        `SouthcoBleDevice: Constructor: Manufacturer Data: ${this._advertisingPayload}`,
      );
      this.parseAdvertisingPayload();
    }
    this.lockState =
      this.sensorStatus === '03' || this.sensorStatus === '00'
        ? 'LOCKED'
        : 'UNLOCKED';
    DeviceEventEmitter.addListener('changePrimaryKeySecondPart', () =>
      __awaiter(this, void 0, void 0, function* () {
        if (SouthcoBleDevice._primaryKeyState === 2) {
          yield this.changePrimaryKeySecondPart();
        }
      }),
    );
  }
  get id() {
    return this._id;
  }
  set id(value) {
    this._id = value;
  }
  get macAddress() {
    return this._macAddress;
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get serviceUUIDs() {
    return this._bleDevice.serviceUUIDs;
  }
  get advertisingPayload() {
    return this._advertisingPayload;
  }
  set advertisingPayload(value) {
    this._advertisingPayload = value;
  }
  get manufacturerName() {
    return this._manufacturerName;
  }
  get firmwareVersion() {
    return this._firmwareVersion;
  }
  static getSalt() {
    return SouthcoBleDevice._salt.shift();
  }
  isRegistered() {
    return this._registrationValue === 0x0;
  }
  get port() {
    return this._port;
  }
  get sensorStatus() {
    return this._sensorStatus ? this._sensorStatus.toString() : null;
  }
  get batteryData() {
    return this._batteryData ? this._batteryData.toString() : null;
  }
  get latchType() {
    return this._latchType ? this._latchType.toString() : null;
  }
  parseAdvertisingPayload() {
    if (
      this._advertisingPayload !== null &&
      this._advertisingPayload.length > 0
    ) {
      this._macAddress = this._advertisingPayload.substring(0, 12);
      this._registrationValue = parseInt(
        this._advertisingPayload.substring(12, 14),
        16,
      );
      this._port = this._advertisingPayload.substring(14, 16);
      this._sensorStatus = Buffer.from(
        this._advertisingPayload.substring(16, 18),
      );
      this._batteryData = Buffer.from(
        this._advertisingPayload.substring(18, 20),
      );
      this._latchType = Buffer.from(this._advertisingPayload.substring(20, 22));
      console.log(
        `SouthcoBleDevice: parseAdvertisingPayload: advertisingPayload: ${this._advertisingPayload}`,
      );
      console.log(
        `SouthcoBleDevice: parseAdvertisingPayload: macAddress: ${
          this.macAddress
        }; registered?: ${this.isRegistered() ? 'Y' : 'N'}; port: ${this.port}`,
      );
      console.log(
        `SouthcoBleDevice: parseAdvertisingPayload: sensorStatus: ${this.sensorStatus}; batteryData: ${this.batteryData}; latchType: ${this.latchType}`,
      );
    } else {
      console.log(
        'SouthcoBleDevice: parseAdvertisingPayload: _advertisingPayload undefined',
      );
    }
  }
  computeUnregisteredDefaultKey() {
    const gapAddress = [];
    for (let i = 0; i < this._advertisingPayload.length; i += 2) {
      gapAddress.push(this._advertisingPayload.substring(i, i + 2));
    }
    const unregisteredDefaultKey =
      gapAddress[2] +
      gapAddress[3] +
      gapAddress[0] +
      gapAddress[4] +
      gapAddress[1] +
      gapAddress[5] +
      gapAddress[2] +
      gapAddress[4] +
      gapAddress[4] +
      gapAddress[5] +
      gapAddress[4] +
      gapAddress[5] +
      gapAddress[0] +
      gapAddress[1] +
      gapAddress[2] +
      gapAddress[0];
    return unregisteredDefaultKey;
  }
  setLatchStatus() {
    if (this.latchType === SouthcoBleDevice._latches.C1.type) {
      SouthcoBleDevice._latchStatus = SouthcoBleDevice._latches.C1.status;
    } else {
      SouthcoBleDevice._latchStatus = SouthcoBleDevice._latches.A1.status;
    }
    console.log(
      `SouthcoBleDevice: setLatchStatus: Latch: ${this.latchType}; Status: ${SouthcoBleDevice._latchStatus}`,
    );
  }
  saltNotificationHandler(error, c) {
    if (c != null) {
      //  TODO: Embed the conversion inside the push
      const salt = Buffer.from(c.value, 'base64').toString('hex');
      SouthcoBleDevice._salt.push(salt);
      console.log(
        `SouthcoBleDevice: saltNotificationHandler: salt: ${SouthcoBleDevice._salt}; primaryKeyState: ${SouthcoBleDevice._primaryKeyState}`,
      );
      if (SouthcoBleDevice._primaryKeyState === 1) {
        SouthcoBleDevice._primaryKeyState = 2;
        console.log(
          'SouthcoBleDevice: saltNotificationHandler: Emitting: changePrimaryKeySecondPart',
        );
        DeviceEventEmitter.emit('changePrimaryKeySecondPart', {
          message: 'Calling changePrimaryKeySecondPart',
        });
      }
    } else {
      console.log(`SouthcoBleDevice: saltNotificationHandler: salt is null`);
      SouthcoBleDevice._salt = [];
    }
  }
  secureMessageNotificationHandler(error, c) {
    if (c != null) {
      const salt = SouthcoBleDevice.getSalt();
      console.log(
        `SouthcoBleDevice: securedMessageNotificationHandler: Salt retrieved: ${salt}`,
      );
      SouthcoBleDevice._secureMessage = Buffer.from(c.value, 'base64').toString(
        'hex',
      );
      console.log(
        `SouthcoBleDevice: securedMessageNotificationHandler: secureMessage: ${SouthcoBleDevice._secureMessage}`,
      );
      console.log(
        `SouthcoBleDevice: securedMessageNotificationHandler: Port=0x${SouthcoBleDevice._secureMessage.substring(
          0,
          2,
        )}; Index=0x${SouthcoBleDevice._secureMessage.substring(
          2,
          6,
        )}; EncryptedData = 0x${SouthcoBleDevice._secureMessage.substring(
          6,
          38,
        )}`,
      );
      const secondaryKey = md5(
        Buffer.from(SouthcoBleDevice._primaryKey, 'hex'),
      );
      const aesEcb = new Aes.ModeOfOperation.ecb(
        Buffer.from(secondaryKey, 'hex'),
      );
      const decryptedBytes = aesEcb.decrypt(
        Buffer.from(SouthcoBleDevice._secureMessage.substring(6, 38), 'hex'),
      );
      const message = Buffer.from(decryptedBytes).toString('hex');
      console.log(
        `SouthcoBleDevice: securedMessageNotificationHandler: Message: ${message}`,
      );
      const saltFromMessage = message.substring(0, 8);
      const operation = message.substring(8, 10);
      const unlockTime = message.substring(10, 12);
      const latchType = message.substring(12, 14);
      const sensorStatus = message.substring(14, 16);
      const portNumber = message.substring(16, 18);
      const battery = message.substring(18, 20);
      const blacklistIndex = message.substring(20, 24);
      const actuations = message.substring(28, 32);
      if (
        SouthcoBleDevice._secureMessageMode ===
        SecureMessageModes.latchOperating
      ) {
        if (SouthcoBleDevice._invalidPrimaryKeyTimerId) {
          clearTimeout(SouthcoBleDevice._invalidPrimaryKeyTimerId);
          SouthcoBleDevice._invalidPrimaryKeyTimerId = null;
          console.log(
            'SouthcoBleDevice: secureMessageNotificationHandler: Timer cleared out',
          );
        }
        if (
          operation !== OperationCodes.unlock &&
          operation != OperationCodes.lock &&
          sensorStatus === SouthcoBleDevice._latchStatus[States.unlock] &&
          SouthcoBleDevice._lockState === States.unlock
        ) {
          console.log(
            'SouthcoBleDevice: secureMessageNotificationHandler: unlock',
          );
          //   SouthcoBleManager.lockStateChange('unlock');
        } else if (
          operation === OperationCodes.unlock &&
          sensorStatus === SouthcoBleDevice._latchStatus[States.unlockComplete]
        ) {
          console.log(
            'SouthcoBleDevice: secureMessageNotificationHandler: unlockComplete',
          );
          //   SouthcoBleManager.lockStateChange('unlockComplete');
        } else if (
          operation === OperationCodes.unlock &&
          sensorStatus === SouthcoBleDevice._latchStatus[States.openComplete]
        ) {
          console.log(
            'SouthcoBleDevice: secureMessageNotificationHandler: openComplete',
          );
          //   SouthcoBleManager.lockStateChange('openComplete');
          DeviceEventEmitter.emit('SCLStateUpdate', {
            id: this.macAddress,
            state: 'UNLOCKED',
          });
        } else if (
          operation === OperationCodes.lock &&
          sensorStatus === SouthcoBleDevice._latchStatus[States.close]
        ) {
          console.log(
            'SouthcoBleDevice: secureMessageNotificationHandler: close',
          );
          //   SouthcoBleManager.lockStateChange('close');
          DeviceEventEmitter.emit('SCLStateUpdate', {
            id: this.macAddress,
            state: 'OPEN_LOCKED',
          });
        } else if (
          operation === OperationCodes.lock &&
          sensorStatus === SouthcoBleDevice._latchStatus[States.closeComplete]
        ) {
          console.log(
            'SouthcoBleDevice: secureMessageNotificationHandler: closeComplete',
          );
          //   SouthcoBleManager.lockStateChange('closeComplete');
        } else if (
          operation !== OperationCodes.unlock &&
          operation != OperationCodes.lock &&
          sensorStatus === SouthcoBleDevice._latchStatus[States.lockComplete]
        ) {
          console.log(
            'SouthcoBleDevice: secureMessageNotificationHandler: lockComplete',
          );
          //   SouthcoBleManager.lockStateChange('lockComplete');
          DeviceEventEmitter.emit('SCLStateUpdate', {
            id: this.macAddress,
            state: 'LOCKED',
          });
        }
        SouthcoBleDevice._lockState =
          ++SouthcoBleDevice._lockState % statesLength;
        console.log(
          `SouthcoBleDevice: securedMessageNotificationHandler: LockState: ${SouthcoBleDevice._lockState}`,
        );
      }
      console.log(
        `SouthcoBleDevice: securedMessageNotificationHandler: SaltFromMessage: ${saltFromMessage}`,
      );
      console.log(
        `SouthcoBleDevice: securedMessageNotificationHandler: Operation=${operation}; UnlockTime=${unlockTime}; latchType=${latchType}; sensorStatus=${sensorStatus}; portNumber=${portNumber}; battery=${battery}; blacklistIndex=${blacklistIndex}; actuations=${actuations}`,
      );
      console.log('\n');
    } else {
      console.log(
        `SouthcoBleDevice: securedMessageNotificationHandler: secureMessage: ${c}`,
      );
    }
  }
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  primaryKeyNotificationHandler(error, c) {
    return __awaiter(this, void 0, void 0, function* () {
      // console.log('SouthcoBleDevice: primaryKeyNotificationHandler: Enter');
      if (SouthcoBleDevice._primaryKeyState <= 2) {
        console.log(
          `SouthcoBleDevice: primaryKeyNotificationHandler: Incorrect Sequence: PK State: ${SouthcoBleDevice._primaryKeyState}`,
        );
        return;
      }
      if (c != null) {
        if (SouthcoBleDevice._changingKeyTimerId) {
          clearTimeout(SouthcoBleDevice._changingKeyTimerId);
        }
        const message = Buffer.from(c.value, 'base64').toString('hex');
        const newMessage = Buffer.from(message, 'hex');
        const decryptionKey = Buffer.from(
          md5(Buffer.from(SouthcoBleDevice._newKey, 'hex')),
          'hex',
        );
        const aesEcb = new Aes.ModeOfOperation.ecb(decryptionKey);
        const decryptedNewMessage = Buffer.from(
          aesEcb.decrypt(newMessage),
          'hex',
        ).toString('hex');
        const saltFromMessage = decryptedNewMessage.substring(0, 8);
        const ack = decryptedNewMessage.substring(16, 18);
        console.log(
          `SouthcoBleDevice: primaryKeyNotificationHandler: NewKey = ${SouthcoBleDevice._newKey}`,
        );
        console.log(
          `SouthcoBleDevice: primaryKeyNotificationHandler: newMessage = ${newMessage.toString(
            'hex',
          )}`,
        );
        console.log(
          `SouthcoBleDevice: primaryKeyNotificationHandler: decryptionKey = ${decryptionKey.toString(
            'hex',
          )}`,
        );
        console.log(
          `SouthcoBleDevice: primaryKeyNotificationHandler: decryptedNewMessage = ${decryptedNewMessage}`,
        );
        console.log(
          `SouthcoBleDevice: primaryKeyNotificationHandler: saltFromMessage = ${saltFromMessage}`,
        );
        console.log(
          `SouthcoBleDevice: primaryKeyNotificationHandler: ack = ${ack}`,
        );
        yield SouthcoBleDevice.sleep(200);
        const salt = SouthcoBleDevice.getSalt();
        console.log(
          `SouthcoBleDevice: primaryKeyNotificationHandler: Salt retrieved: ${salt}`,
        );
        const status =
          salt === saltFromMessage && ack.toUpperCase() === 'AC'
            ? 'Successful'
            : 'Failed';
        if (status === 'Successful') {
          this._registrationValue = 0x0;
        }
        // SouthcoBleManager.changeKeyState(status);
        DeviceEventEmitter.emit('SCLChangeKeyState', {
          id: this.macAddress,
          state: status,
        });
        console.log(
          `SouthcoBleDevice: primaryKeyNotificationHandler: ${status}`,
        );
        SouthcoBleDevice._primaryKeyState = 0;
      } else {
        console.log(
          'SouthcoBleDevice: primaryKeyNotificationHandler: characteristic was NULL!',
        );
      }
    });
  }
  discoverAllServicesAndCharacteristics() {
    return __awaiter(this, void 0, void 0, function* () {
      SouthcoBleDevice._unregisteredDefaultKey =
        this.computeUnregisteredDefaultKey();
      console.log(
        `SouthcoBleDevice: discoverAllServicesAndCharacteristics: Unregistered Default Key: ${SouthcoBleDevice._unregisteredDefaultKey}`,
      );
      yield this._bleDevice.discoverAllServicesAndCharacteristics();
      const manufacturerName =
        yield this._bleDevice.readCharacteristicForService(
          SouthcoBleDevice._services.deviceInformation.uuid,
          SouthcoBleDevice._services.deviceInformation.characteristics
            .manufacturerName,
        );
      this._manufacturerName = Buffer.from(
        manufacturerName.value,
        'base64',
      ).toString();
      const firmwareVersion =
        yield this._bleDevice.readCharacteristicForService(
          SouthcoBleDevice._services.deviceInformation.uuid,
          SouthcoBleDevice._services.deviceInformation.characteristics
            .firmwareVersion,
        );
      this._firmwareVersion = Buffer.from(
        firmwareVersion.value,
        'base64',
      ).toString();
      this._bleDevice.monitorCharacteristicForService(
        SouthcoBleDevice._services.latch.uuid,
        SouthcoBleDevice._services.latch.characteristics.salt.uuid,
        this.saltNotificationHandler,
      );
      this._bleDevice.monitorCharacteristicForService(
        SouthcoBleDevice._services.latch.uuid,
        SouthcoBleDevice._services.latch.characteristics.secureMessage.uuid,
        this.secureMessageNotificationHandler,
      );
      this._bleDevice.monitorCharacteristicForService(
        SouthcoBleDevice._services.latch.uuid,
        SouthcoBleDevice._services.latch.characteristics.primaryKey.uuid,
        this.primaryKeyNotificationHandler,
      );
      this._bleDevice.onDisconnected((error, disconnectedDevice) => {
        if (error) {
          console.warn('Device disconnected due to error', error);
        } else {
          console.log(`Device disconnected ${disconnectedDevice.id}`);
        }
      });
      this.setLatchStatus();
      console.log(
        `SouthcoBleDevice: discoverAllServicesAndCharacteristics: manufacturerName: ${this._manufacturerName}; firmwareVer: ${this._firmwareVersion}`,
      );
    });
  }
  performOperation(port, index, plainText) {
    return __awaiter(this, void 0, void 0, function* () {
      const maxRetries = 3;
      let attempts = 0;
      let characteristic = null;
      const secondaryKey = md5(
        Buffer.from(SouthcoBleDevice._primaryKey, 'hex'),
      );
      console.log(
        `SouthcoBleDevice: performOperation: key: ${SouthcoBleDevice._primaryKey}`,
      );
      console.log(
        `SouthcoBleDevice: performOperation: Secondary key: ${secondaryKey}`,
      );
      console.log(
        `SouthcoBleDevice: performOperation: plainText: ${plainText}`,
      );
      const aesEcb = new Aes.ModeOfOperation.ecb(
        Buffer.from(secondaryKey, 'hex'),
      );
      const encryptedBytes = aesEcb.encrypt(Buffer.from(plainText, 'hex'));
      console.log(
        'SouthcoBleDevice: performOperation: Encrypted:',
        Buffer.from(encryptedBytes).toString('hex'),
      );
      const arr = [port, index, encryptedBytes];
      const message = Buffer.concat(arr);
      while (attempts < maxRetries) {
        try {
          SouthcoBleDevice._secureMessageMode =
            SecureMessageModes.latchOperating;
          characteristic =
            yield this._bleDevice.writeCharacteristicWithResponseForService(
              SouthcoBleDevice._services.latch.uuid,
              SouthcoBleDevice._services.latch.characteristics.secureMessage
                .uuid,
              Buffer.from(message).toString('base64'),
            );
          if (characteristic.value) {
            SouthcoBleDevice._invalidPrimaryKeyTimerId = setTimeout(() => {
              console.log(
                'SouthcoBleDevice: performOperation: InvalidPrimaryKey',
              );
              //   SouthcoBleManager.lockStateChange('InvalidPrimaryKey');
            }, 2000);
            break;
          }
        } catch (error) {
          console.error(
            `SouthcoBleDevice: performOperation: Attempt ${
              attempts + 1
            } failed:`,
            error,
          );
        }
        attempts++;
      }
      return characteristic;
    });
  }
  purgeSaltArray() {
    while (SouthcoBleDevice._salt.length > 1) {
      SouthcoBleDevice._salt.shift();
      console.log('SouthcoBleDevice: purgeSaltArray: Unwanted salt removed');
    }
  }
  validateKey(primaryKey = null) {
    if (this.isRegistered()) {
      if (primaryKey === null) {
        console.log(
          'SouthcoBleDevice: validateKey: Key is needed for a registered device',
        );
        throw new Error('Primary Key is null or undefined');
      } else if (primaryKey.length !== 32) {
        console.log('SouthcoBleDevice: validateKey: Invalid key length');
        throw new Error('Invalid Primary Key length');
      } else {
        SouthcoBleDevice._primaryKey = primaryKey;
        console.log('SouthcoBleDevice: validateKey: Using key provided');
      }
    } else {
      SouthcoBleDevice._primaryKey = SouthcoBleDevice._unregisteredDefaultKey;
      console.log('SouthcoBleDevice: validateKey: Using default key');
    }
  }
  openWithAutoLock(requestedUnlockTime, primaryKey = null) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        this.validateKey(primaryKey);
        this.purgeSaltArray();
        let unlockTime = 15;
        const port = Buffer.from(this._port, 'hex');
        const index = Buffer.from('0000', 'hex');
        const salt = SouthcoBleDevice.getSalt();
        if (requestedUnlockTime > 0 && requestedUnlockTime <= 15) {
          unlockTime = requestedUnlockTime;
        }
        const plainText =
          salt +
          '1A' + // Command
          unlockTime.toString().padStart(2, '0') + // Unlock Time
          '00' + // Latch Type
          '00' + // Sensor Status
          this._port + // Port Number
          '00' + // Battery Data
          '0000' + // Blacklist Index
          salt;
        console.log(`SouthcoBleDevice: openWithAutoLock: salt: ${salt}`);
        SouthcoBleDevice._lockState = States.unlock;
        const characteristic = yield this.performOperation(
          port,
          index,
          plainText,
        );
        if (!characteristic || !characteristic.value) {
          throw new Error(
            'SouthcoBleDevice: openWithAutoLock: Failed to write characteristic with response after multiple attempts',
          );
        }
        return Buffer.from(characteristic.value, 'base64').toString('hex');
      } catch (error) {
        console.log(
          'Caught an error in validateKey:',
          error instanceof Error ? error.message : String(error),
        );
        throw error;
      }
    });
  }
  unlock(primaryKey = null) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        this.validateKey(primaryKey);
        this.purgeSaltArray();
        const port = Buffer.from(this._port, 'hex');
        const index = Buffer.from('0000', 'hex');
        const salt = SouthcoBleDevice.getSalt();
        const plainText =
          salt +
          '1A' + // Unlock Command
          '00' + // Unlock Time - N/A
          '00' + // Latch Type
          '00' + // Sensor Status
          this._port + // Port Number
          '00' + // Battery Data
          '0000' + // Blacklist Index
          salt;
        console.log(`SouthcoBleDevice: unlock: salt: ${salt}`);
        SouthcoBleDevice._lockState = States.unlock;
        const characteristic = yield this.performOperation(
          port,
          index,
          plainText,
        );
        if (!characteristic || !characteristic.value) {
          throw new Error(
            'SouthcoBleDevice: unlock: Failed to write characteristic with response after multiple attempts',
          );
        }
        return Buffer.from(characteristic.value, 'base64').toString('hex');
      } catch (error) {
        console.log(
          'Caught an error in validateKey:',
          error instanceof Error ? error.message : String(error),
        );
        throw error;
      }
    });
  }
  lock(primaryKey = null) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        this.validateKey(primaryKey);
        this.purgeSaltArray();
        const port = Buffer.from(this._port, 'hex');
        const index = Buffer.from('0000', 'hex');
        const salt = SouthcoBleDevice.getSalt();
        const plainText =
          salt +
          '4F' + // lock command
          '00' + // Unlock Time - N/A
          '00' + // Latch Type
          '00' + // Sensor Status
          this._port + // Port Number
          '00' + // Battery Data
          '0000' + // Blacklist Index
          salt;
        console.log(`SouthcoBleDevice: lock: salt: ${salt}`);
        SouthcoBleDevice._lockState = States.close;
        const characteristic = yield this.performOperation(
          port,
          index,
          plainText,
        );
        if (!characteristic || !characteristic.value) {
          throw new Error(
            'SouthcoBleDevice: lock: Failed to write characteristic with response after multiple attempts',
          );
        }
        return Buffer.from(characteristic.value, 'base64').toString('hex');
      } catch (error) {
        console.log(
          'Caught an error in validateKey:',
          error instanceof Error ? error.message : String(error),
        );
        throw error;
      }
    });
  }
  setLatchConfiguration(latchType, primaryKey = null) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let latchTypeHex;
        if (latchType === 'A1') latchTypeHex = '10';
        else if (latchType === 'A2') latchTypeHex = '11';
        else if (latchType === 'A3') latchTypeHex = '12';
        else if (latchType === 'B1') latchTypeHex = '20';
        else if (latchType === 'C1') latchTypeHex = '30';
        else if (latchType === 'D1') latchTypeHex = '40';
        else if (latchType === 'E1') latchTypeHex = '50';
        else if (latchType === 'F1') latchTypeHex = '60';
        else if (latchType === 'F2') latchTypeHex = '61';
        else throw new Error('Invalid Latch Type');
        this.validateKey(primaryKey);
        this.purgeSaltArray();
        const port = Buffer.from(this._port, 'hex');
        const index = Buffer.from('0000', 'hex');
        const salt = SouthcoBleDevice.getSalt();
        const plainText =
          salt +
          'AA' + // lock command - N/A
          '00' + // Unlock Time - N/A
          latchTypeHex + // Latch Type
          '00' + // Sensor Status
          this._port + // Port Number
          '00' + // Battery Data
          '0000' + // Blacklist Index
          salt;
        const secondaryKey = md5(
          Buffer.from(SouthcoBleDevice._primaryKey, 'hex'),
        );
        console.log(
          `SouthcoBleDevice: setLatchConfiguration: key: ${SouthcoBleDevice._primaryKey}`,
        );
        console.log(`SouthcoBleDevice: setLatchConfiguration: salt: ${salt}`);
        console.log(
          `SouthcoBleDevice: setLatchConfiguration: Secondary key: ${secondaryKey}`,
        );
        console.log(
          `SouthcoBleDevice: setLatchConfiguration: plainText: ${plainText}`,
        );
        const aesEcb = new Aes.ModeOfOperation.ecb(
          Buffer.from(secondaryKey, 'hex'),
        );
        const encryptedBytes = aesEcb.encrypt(Buffer.from(plainText, 'hex'));
        console.log(
          'SouthcoBleDevice: setLatchConfiguration: Encrypted:',
          Buffer.from(encryptedBytes).toString('hex'),
        );
        //console.log('Encrypted:', encryptedBytes.toString('hex'));
        const arr = [port, index, encryptedBytes];
        const message = Buffer.concat(arr);
        SouthcoBleDevice._secureMessageMode =
          SecureMessageModes.latchConfiguration;
        const characteristic =
          yield this._bleDevice.writeCharacteristicWithResponseForService(
            SouthcoBleDevice._services.latch.uuid,
            SouthcoBleDevice._services.latch.characteristics.secureMessage.uuid,
            Buffer.from(message).toString('base64'),
          );
        return Buffer.from(characteristic.value, 'base64').toString('hex');
      } catch (error) {
        console.log(
          'Caught an error in validateKey:',
          error instanceof Error ? error.message : String(error),
        );
        throw error;
      }
    });
  }
  changePrimaryKey(newKey, primaryKey = null) {
    return __awaiter(this, void 0, void 0, function* () {
      this.purgeSaltArray();
      if (this.isRegistered()) {
        if (primaryKey === null) throw new Error('Invalid Primary Key');
        else if (primaryKey.length !== 32)
          throw new Error('Invalid Primary Key length');
        else if (newKey.length !== 32)
          throw new Error('Invalid New Primary Key length');
        else SouthcoBleDevice._processingKey = primaryKey;
      } else {
        console.log(
          'SouthcoBleDevice: changePrimaryKey: Using unregisteredDefaultKey',
        );
        SouthcoBleDevice._processingKey =
          SouthcoBleDevice._unregisteredDefaultKey;
      }
      SouthcoBleDevice._newKey = newKey;
      const padding = Buffer.from('AAAAAAAA', 'hex');
      const salt = SouthcoBleDevice.getSalt();
      const arr = [
        Buffer.from(salt, 'hex'),
        padding,
        Buffer.from(SouthcoBleDevice._newKey, 'hex').subarray(0, 8),
      ];
      const plainText = Buffer.concat(arr);
      console.log(
        `SouthcoBleDevice: changePrimaryKey: Key: ${SouthcoBleDevice._processingKey}`,
      );
      console.log(
        `SouthcoBleDevice: changePrimaryKey: newKey: ${SouthcoBleDevice._newKey}`,
      );
      console.log(`SouthcoBleDevice: changePrimaryKey: Salt: ${salt}`);
      console.log(
        `SouthcoBleDevice: changePrimaryKey: plainText: ${plainText.toString(
          'hex',
        )}`,
      );
      //  Encrypt the plaintext:
      const encryptionKey = Buffer.from(
        md5(Buffer.from(SouthcoBleDevice._processingKey, 'hex')),
        'hex',
      );
      const aesEcb = new Aes.ModeOfOperation.ecb(encryptionKey);
      const encryptedMessage = Buffer.from(aesEcb.encrypt(plainText), 'hex');
      console.log(
        `SouthcoBleDevice: changePrimaryKey: EncryptionKey = ${encryptionKey.toString(
          'hex',
        )}`,
      );
      console.log(
        `SouthcoBleDevice: changePrimaryKey: EncryptedMessage = ${encryptedMessage.toString(
          'hex',
        )}`,
      );
      const characteristic =
        yield this._bleDevice.writeCharacteristicWithResponseForService(
          SouthcoBleDevice._services.latch.uuid,
          SouthcoBleDevice._services.latch.characteristics.primaryKey.uuid,
          Buffer.from(encryptedMessage).toString('base64'),
        );
      SouthcoBleDevice._changingKeyTimerId = setTimeout(() => {
        console.log(
          'SouthcoBleDevice: changePrimaryKey: PrimaryKeyChangeFailed-Step1',
        );
        // SouthcoBleManager.changeKeyState('Failed');
        DeviceEventEmitter.emit('SCLChangeKeyState', {
          id: this.macAddress,
          state: 'Failed',
        });
      }, 2000);
      SouthcoBleDevice._primaryKeyState = 1;
      if (
        characteristic === undefined ||
        !characteristic ||
        !characteristic.value
      ) {
        console.log(
          'SouthcoBleDevice: changePrimaryKeySecondPart: Failed to write characteristic with response',
        );
        return 'no characteristic returned';
      } else {
        console.log(
          `SouthcoBleDevice: changePrimaryKeySecondPart: ${Buffer.from(
            characteristic.value,
            'base64',
          ).toString('hex')}`,
        );
        return Buffer.from(characteristic.value, 'base64').toString('hex');
      }
    });
  }
  changePrimaryKeySecondPart() {
    return __awaiter(this, void 0, void 0, function* () {
      SouthcoBleDevice._primaryKeyState++;
      this.purgeSaltArray();
      const salt = SouthcoBleDevice.getSalt();
      const padding = Buffer.from('BBBBBBBB', 'hex');
      const arr = [
        Buffer.from(salt, 'hex'),
        padding,
        Buffer.from(SouthcoBleDevice._newKey, 'hex').subarray(8, 16),
      ];
      const plainText = Buffer.concat(arr);
      const encryptionKey = Buffer.from(
        md5(Buffer.from(SouthcoBleDevice._processingKey, 'hex')),
        'hex',
      );
      const aesEcb = new Aes.ModeOfOperation.ecb(encryptionKey);
      const encryptedMessage = Buffer.from(aesEcb.encrypt(plainText), 'hex');
      console.log(
        `SouthcoBleDevice: changePrimaryKeySecondPart: newSalt = ${salt}`,
      );
      console.log(
        `SouthcoBleDevice: changePrimaryKeySecondPart: plainText = ${plainText.toString(
          'hex',
        )}`,
      );
      console.log(
        `SouthcoBleDevice: changePrimaryKeySecondPart: EncryptedMessage = ${encryptedMessage.toString(
          'hex',
        )}`,
      );
      try {
        console.log(
          `SouthcoBleDevice: changePrimaryKeySecondPart: Writing to the characteristic of: ${this._bleDevice.id}`,
        );
        const characteristic =
          yield this._bleDevice.writeCharacteristicWithResponseForService(
            SouthcoBleDevice._services.latch.uuid,
            SouthcoBleDevice._services.latch.characteristics.primaryKey.uuid,
            Buffer.from(encryptedMessage).toString('base64'),
          );
        if (
          characteristic === undefined ||
          !characteristic ||
          !characteristic.value
        ) {
          console.log(
            'SouthcoBleDevice: changePrimaryKeySecondPart: Failed to write characteristic with response',
          );
          return 'no characteristic returned';
        } else {
          console.log(
            `SouthcoBleDevice: changePrimaryKeySecondPart: ${Buffer.from(
              characteristic.value,
              'base64',
            ).toString('hex')}`,
          );
          return Buffer.from(characteristic.value, 'base64').toString('hex');
        }
      } catch (error) {
        console.log('SouthcoBleDevice: changePrimaryKeySecondPart:', error);
        throw 'SouthcoBleDevice: changePrimaryKeySecondPart: Write Characteristic failed';
      }
    });
  }
}
SouthcoBleDevice._registrationValue = 0x0;
SouthcoBleDevice._unregisteredDefaultKey = '';
SouthcoBleDevice._salt = [];
SouthcoBleDevice._newKey = '';
SouthcoBleDevice._processingKey = ''; //  Use when changing primary key
SouthcoBleDevice._primaryKey = ''; //  Use when interacting with the lock
SouthcoBleDevice._primaryKeyState = 0;
SouthcoBleDevice._invalidPrimaryKeyTimerId = null;
SouthcoBleDevice._changingKeyTimerId = null;
SouthcoBleDevice._latchStatus = [];
SouthcoBleDevice._latches = {
  A1: {
    type: '10',
    status: ['01', '01', '03', '03', '01', '01'], // lock, unlock, lock
  },
  C1: {
    type: '30',
    status: ['03', '03', '01', '01', '03', '03'],
  },
};
SouthcoBleDevice._services = {
  deviceInformation: {
    uuid: '0000180a-0000-1000-8000-00805f9b34fb',
    characteristics: {
      manufacturerName: '00002a29-0000-1000-8000-00805f9b34fb',
      firmwareVersion: '00002a26-0000-1000-8000-00805f9b34fb',
    },
  },
  latch: {
    uuid: '35f0be9e-b533-4b17-b9d9-7514dd2a8f15',
    characteristics: {
      salt: {
        uuid: '35f0be90-b533-4b17-b9d9-7514dd2a8f15',
      },
      secureMessage: {
        uuid: '35f0be91-b533-4b17-b9d9-7514dd2a8f15',
      },
      primaryKey: {
        uuid: '35f0be92-b533-4b17-b9d9-7514dd2a8f15',
      },
    },
  },
};
