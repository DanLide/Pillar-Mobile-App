import { environment } from 'src/data/helpers/environment';

export const storageKeys = {
  HIDE_SCANNER_TOOLTIP: 'HIDE_SCANNER_TOOLTIP',
  RN_TOKEN: 'RN_TOKEN',
  USER_NAMES: 'USER_NAMES',
  SETTINGS: 'SETTINGS',
  DEVICE_NAME: `DEVICE_NAME-${environment.env}`,
};
