import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  check,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
  request,
  openSettings,
} from 'react-native-permissions';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useRoute,
  StackActions,
} from '@react-navigation/native';

import { SVGs, colors, fonts } from '../../theme';
import { Button, ButtonType } from '../../components';
import { AppNavigator } from '../../navigation';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

type ParamList = {
  CameraPermissionScreen: {
    nextRoute: AppNavigator;
  };
};

export const CameraPermissionScreen = memo(({ navigation }: Props) => {
  const route = useRoute<RouteProp<ParamList, 'CameraPermissionScreen'>>();

  const [cameraPermission, setCameraPermission] = useState<PermissionStatus>(
    RESULTS.DENIED,
  );

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
      navigation.dispatch(
        StackActions.replace(AppNavigator.RemoveProductScannerScreen),
      );
      return;
    }

    setCameraPermission(result);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Camera Access</Text>
        <Text style={styles.subtitle}>
          RepairStack would like to access to your camera, so that you can
          easily scan products.
        </Text>
        <SVGs.CameraIcon color={colors.black} style={styles.icon} />
        {cameraPermission === RESULTS.BLOCKED ? (
          <Text style={styles.subtitle}>
            <Text>Allow camera access in{'\n'}</Text>
            <Text style={styles.bold}>Settings {'>'} RepairStack.</Text>
          </Text>
        ) : (
          <Text style={styles.subtitle}>
            Without camera access, you will not be able to proceed with the app
            features
          </Text>
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
});

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
