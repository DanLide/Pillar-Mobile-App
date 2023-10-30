import AsyncStorage from '@react-native-async-storage/async-storage';
import { SSOModel } from 'src/stores/SSOStore';

interface RNTokenValue {
  rnToken: string;
  sso: SSOModel;
}

export const setSSORNToken = async (rnToken: string, sso: SSOModel) => {
  const value = JSON.stringify({ rnToken, sso });
  return await AsyncStorage.setItem('rnToken', value);
};

export const getSSORNToken = async () => {
  const rnTokenJSON = await AsyncStorage.getItem('rnToken');
  if (rnTokenJSON) {
    return JSON.parse(rnTokenJSON) as RNTokenValue;
  }
  return false;
};

export const cleanKeychain = async () => {
  return await AsyncStorage.removeItem('rnToken');
};
