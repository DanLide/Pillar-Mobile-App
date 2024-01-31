import AsyncStorage from '@react-native-async-storage/async-storage';
import { SSOModel } from 'src/stores/SSOStore';

interface RNTokenValue {
  rnToken: string;
  sso: SSOModel;
}

interface AlphaAlerts {
  usernames?: string[];
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

export const getUsernames = async () => {
  const usernames = await AsyncStorage.getItem('usernames');
  if (usernames) {
    return JSON.parse(usernames) as AlphaAlerts;
  }
  return false;
};

export const setUsernames = async (username: string) => {
  const usernames = await getUsernames();
  const mergedUsernames =
    usernames && usernames.usernames
      ? [...usernames.usernames, username]
      : [username];
  const value = JSON.stringify({
    usernames: mergedUsernames,
  });
  return await AsyncStorage.setItem('usernames', value);
};

export const cleanKeychain = async () => {
  await AsyncStorage.removeItem('usernames');
  await AsyncStorage.removeItem('rnToken');
};
