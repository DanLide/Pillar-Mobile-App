import { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  check,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
  request,
  openSettings,
} from 'react-native-permissions';
import { useTranslation } from 'react-i18next';

import { SVGs, colors, fonts } from '../../theme';
import { Button, ButtonType } from '../../components';
import { CameraPermissionScreenProps } from 'src/navigation/types';

export const CameraPermissionScreen = memo(
  ({ navigation, route }: CameraPermissionScreenProps) => {
    const { t } = useTranslation();
    const [cameraPermission, setCameraPermission] = useState<PermissionStatus>(
      RESULTS.DENIED,
    );

    const { nextRoute, modalType } = route.params;

    const buttonTitle =
      cameraPermission === RESULTS.BLOCKED ? 'Settings' : 'Continue';

    const permissionCheck = async () => {
      const result = await check(PERMISSIONS.IOS.CAMERA);

      setCameraPermission(result);
    };

    useEffect(() => {
      permissionCheck();
    }, []);

    const onButtonPress = async () => {
      if (cameraPermission === RESULTS.BLOCKED) return openSettings();

      const result = await request(PERMISSIONS.IOS.CAMERA);

      if (result === RESULTS.GRANTED) {
        navigation.replace(nextRoute, { modalType });
        return;
      }

      setCameraPermission(result);
    };

    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('cameraAccess')}</Text>
          <Text style={styles.subtitle}>
            {t('repairStackWouldLikeToConnectCamera')}
          </Text>
          <SVGs.CameraIcon color={colors.black} style={styles.icon} />
          {cameraPermission === RESULTS.BLOCKED ? (
            <Text style={styles.subtitle}>
              <Text>
                {t('allowCameraAccess')}
                {'\n'}
              </Text>
              <Text style={styles.bold}>{t('settingsRepairStack')}</Text>
            </Text>
          ) : (
            <Text style={styles.subtitle}>{t('withoutCameraAccess')}</Text>
          )}
        </View>
        <Button
          type={ButtonType.primary}
          buttonStyle={styles.button}
          title={buttonTitle}
          onPress={onButtonPress}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 36,
  },
  title: {
    fontSize: 17,
    lineHeight: 25.5,
    fontFamily: fonts.TT_Bold,
    color: colors.black,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    paddingTop: 16,
    color: colors.blackLight,
    textAlign: 'center',
  },
  icon: {
    marginVertical: 60,
  },
  bold: {
    fontFamily: fonts.TT_Bold,
  },
  button: {
    margin: 16,
  },
});
