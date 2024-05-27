import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const MMKWStorageService = {
  setRecord(key: string, record: string) {
    storage.set(key, record);
  },

  getRecord(key: string) {
    const record = storage.getString(key);
    if (typeof record === 'string') {
      return record;
    }
  },

  removeRecord(key: string) {
    storage.delete(key);
  },

  removeAllRecords() {
    storage.clearAll();
  },

  getAllRecordKeys() {
    return storage.getAllKeys();
  },
};
