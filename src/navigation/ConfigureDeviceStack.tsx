import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { getScreenOptions } from './helpers';
import { AppNavigator, ConfigureDeviceStackParams, LeftBarType } from './types';

import { useNavigation } from '@react-navigation/native';
import { DeviceConfigCompletedScreen } from 'src/modules/configureDevice/DeviceConfigCompletedScreen';
import EnterShopCodeScreen from 'src/modules/configureDevice/EnterShopCodeScreen';
import { ScanShopCodeScreen } from 'src/modules/configureDevice/ScanShopCodeScreen';
import { CameraPermissionScreen } from 'src/modules/permissions';

const Stack = createStackNavigator<ConfigureDeviceStackParams>();

export const ConfigureDeviceStack: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <Stack.Navigator initialRouteName={AppNavigator.ScanShopCodeScreen}>
      <Stack.Screen
        name={AppNavigator.ScanShopCodeScreen}
        component={ScanShopCodeScreen}
        options={getScreenOptions({
          leftBarButtonType: LeftBarType.Back,
          title: t('repairFacilityCode'),
        })}
      />
      <Stack.Screen
        name={AppNavigator.EnterShopCodeScreen}
        component={EnterShopCodeScreen}
        options={getScreenOptions({
          leftBarButtonType: LeftBarType.Back,
          title: t('repairFacilityCode'),
        })}
      />
      <Stack.Screen
        name={AppNavigator.DeviceConfigCompletedScreen}
        component={DeviceConfigCompletedScreen}
        options={getScreenOptions({
          leftBarButtonType: LeftBarType.Back,
          title: t('configureShopDevice'),
        })}
      />
      <Stack.Screen
        name={AppNavigator.CameraPermissionScreen}
        component={CameraPermissionScreen}
        options={getScreenOptions({
          title: t('cameraAccess'),
          leftBarButtonType: LeftBarType.Back,
        })}
      />
    </Stack.Navigator>
  );
};
