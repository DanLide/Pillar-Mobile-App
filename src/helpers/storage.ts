import { SSOModel } from 'src/stores/SSOStore';
import { MMKWStorageService, RNKeychainStorage } from 'src/services';
import { storageKeys } from 'src/constants';

interface RNTokenValue {
  rnToken: string;
  sso: SSOModel;
}

interface AlphaAlerts {
  usernames?: string[];
}

interface Settings {
  isEnabledFlashlight?: boolean;
}

export const setSSORNToken = (rnToken: string, sso: SSOModel) => {
  const value = JSON.stringify({ rnToken, sso });
  MMKWStorageService.setRecord(storageKeys.RN_TOKEN, value);
  RNKeychainStorage.setRecord(storageKeys.RN_TOKEN, value);
};

export const getSSORNToken = () => {
  const rnTokenJSON = MMKWStorageService.getRecord(storageKeys.RN_TOKEN);
  if (rnTokenJSON) {
    return JSON.parse(rnTokenJSON) as RNTokenValue;
  }
  return false;
};

export const getUsernames = () => {
  const usernames = MMKWStorageService.getRecord(storageKeys.USER_NAMES);
  if (usernames) {
    return JSON.parse(usernames) as AlphaAlerts;
  }
  return false;
};

export const setUsernames = (username: string) => {
  const usernames = getUsernames();
  const mergedUsernames =
    usernames && usernames.usernames
      ? [...usernames.usernames, username]
      : [username];
  const value = JSON.stringify({
    usernames: mergedUsernames,
  });
  MMKWStorageService.setRecord(storageKeys.USER_NAMES, value);
  RNKeychainStorage.setRecord(storageKeys.USER_NAMES, value);
};

export const setSettings = (settings: Settings) => {
  const value = JSON.stringify(settings);
  MMKWStorageService.setRecord(storageKeys.SETTINGS, value);
  RNKeychainStorage.setRecord(storageKeys.SETTINGS, value);
};

export const getSettings = () => {
  const settings = MMKWStorageService.getRecord(storageKeys.SETTINGS);
  if (settings) {
    return JSON.parse(settings) as Settings;
  }
  return {};
};

export const cleanKeychain = () => {
  MMKWStorageService.removeRecord(storageKeys.USER_NAMES);
  MMKWStorageService.removeRecord(storageKeys.RN_TOKEN);
  RNKeychainStorage.removeRecord(storageKeys.USER_NAMES);
  RNKeychainStorage.removeRecord(storageKeys.RN_TOKEN);
  RNKeychainStorage.removeRecord(storageKeys.DEVICE_NAME);
};

export const syncKeychainToMMKWStorage = async () => {
  const ssoRNToken = getSSORNToken();

  // Check if no local ssoRNToken (device is not configured) then sync with Keychain Storage
  if (!ssoRNToken) {
    const usernames = await RNKeychainStorage.getRecord(storageKeys.USER_NAMES);
    const rnToken = await RNKeychainStorage.getRecord(storageKeys.RN_TOKEN);
    const settings = await RNKeychainStorage.getRecord(storageKeys.SETTINGS);
    if (usernames) {
      MMKWStorageService.setRecord(storageKeys.USER_NAMES, usernames);
    }
    if (rnToken) {
      MMKWStorageService.setRecord(storageKeys.RN_TOKEN, rnToken);
    }
    if (settings) {
      MMKWStorageService.setRecord(storageKeys.SETTINGS, settings);
    }
  }
};
