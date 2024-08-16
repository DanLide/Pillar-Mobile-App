import { SSOModel } from 'src/stores/SSOStore';
import { MMKWStorageService } from 'src/services';

interface RNTokenValue {
  rnToken: string;
  sso: SSOModel;
}

interface AlphaAlerts {
  usernames?: string[];
}

export const setSSORNToken = (rnToken: string, sso: SSOModel) => {
  const value = JSON.stringify({ rnToken, sso });
  MMKWStorageService.setRecord('rnToken', value);
};

export const getSSORNToken = () => {
  const rnTokenJSON = MMKWStorageService.getRecord('rnToken');
  if (rnTokenJSON) {
    return JSON.parse(rnTokenJSON) as RNTokenValue;
  }
  return false;
};

export const getUsernames = () => {
  const usernames = MMKWStorageService.getRecord('usernames');
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
  MMKWStorageService.setRecord('usernames', value);
};

export const cleanKeychain = () => {
  MMKWStorageService.removeRecord('usernames');
  MMKWStorageService.removeRecord('rnToken');
};
