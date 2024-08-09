import Tealium from 'tealium-react-native';
import {
  TealiumConfig,
  Dispatchers,
  Collectors,
  ConsentPolicy,
  TealiumEnvironment,
} from 'tealium-react-native/common';

import { environment } from 'src/data/helpers/environment';

const config: TealiumConfig = {
  account: environment.tealium.account,
  profile: environment.tealium.profile,
  environment: TealiumEnvironment.prod,
  dispatchers: [
    Dispatchers.Collect,
    Dispatchers.RemoteCommands,
    Dispatchers.TagManagement,
  ],
  collectors: [
    Collectors.AppData,
    Collectors.DeviceData,
    Collectors.Lifecycle,
    Collectors.Connectivity,
  ],
  consentPolicy: ConsentPolicy.gdpr,
  visitorServiceEnabled: true,
};

export const initTealium = () => {
  if (environment.env != 'PROD') return;

  Tealium.initialize(config, success => {
    if (!success) {
      console.error('Tealium not initialized');
      return;
    }
    console.log('Tealium initialized');
  });
};
