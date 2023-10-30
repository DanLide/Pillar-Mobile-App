import { getDeviceNameSync } from 'react-native-device-info';
import { Config } from 'react-native-config';

// TODO remove when fix problem with iOS 16 getDeviceName api
const deviceId = Config.ENV === 'QA' ? '233D592K' : '03717261';

export const get3MDeviceName = () => `123-123-${deviceId}`.split('-')[2];
