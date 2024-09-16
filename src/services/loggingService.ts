import {
  ApplicationInsights,
  ICustomProperties,
} from '@microsoft/applicationinsights-web';
import { ReactNativePlugin } from '@microsoft/applicationinsights-react-native';
import { clone } from 'ramda';

import { environment } from 'src/data/helpers/environment';
import { deviceInfoStore } from 'src/stores';

type TParams = {
  [key: string]: string | number | object | undefined;
};

type TEvents = 'Unlock SC lock';

type TApiParams = {
  statusCode: number | undefined;
  url: string | URL;
  method: string | undefined;
  request: RequestInit & {
    headers?: {
      authorization?: string;
      rn_token?: string;
    };
  };
  response: {
    [key: string]: string | object | undefined;
  };
};

const RNPlugin = new ReactNativePlugin();
const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: environment.appInsights.instrumentationKey,
    extensions: [RNPlugin],
    disableAjaxTracking: true,
    disableFetchTracking: true,
  },
});

if (!__DEV__) {
  appInsights.loadAppInsights();
}

export const LoggingService = {
  setInitializer(
    authenticatedUserId: string | undefined,
    name: string | undefined,
    pisaId: number | undefined,
  ) {
    appInsights.addTelemetryInitializer(envelope => {
      if (envelope.baseData) {
        envelope.baseData.properties['ApplicationPlatform'] = 'MobileApp';
        envelope.baseData.properties['ApplicationName'] = 'Pillar RepairStack';
        envelope.baseData.properties['username'] = authenticatedUserId;
        envelope.baseData.properties['SSOName'] = name;
        envelope.baseData.properties['SSOId'] = pisaId;
        envelope.baseData.properties['appVersion'] =
          deviceInfoStore.version ?? 'unknown';
      }
    });
  },

  logException(error: unknown, params?: TParams) {
    if (__DEV__) {
      console.error(
        error,
        `${error instanceof Error ? error?.message : ''}\n${
          params ? JSON.stringify(params, null, 4) : ''
        }`,
      );
    } else {
      appInsights.trackException(
        {
          exception: error as TypeError,
          severityLevel: 3,
        },
        { ...params },
      );
    }
  },

  logAPIException(error: unknown, params: TApiParams) {
    const apiParams = clone(params);

    if (apiParams.request?.headers?.authorization) {
      delete apiParams.request.headers.authorization;
    }

    if (apiParams.request?.headers?.rn_token) {
      delete apiParams.request.headers.rn_token;
    }

    this.logException(error, apiParams);
  },

  logEvent(name: TEvents, params: ICustomProperties) {
    if (!__DEV__) {
      appInsights.trackEvent({ name }, params);
    }
  },
};
