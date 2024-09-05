import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';

export const RNKeychainStorage = {
  setRecord(key: string, record: string) {
    RNSecureStorage.setItem(key, record, {
      accessible: ACCESSIBLE.WHEN_UNLOCKED,
    }).catch(() => {
      return null;
    });
  },

  getRecord(key: string) {
    return RNSecureStorage.getItem(key).catch(() => {
      return null;
    });
  },

  removeRecord(key: string) {
    RNSecureStorage.removeItem(key).catch(() => {
      return null;
    });
  },
};
