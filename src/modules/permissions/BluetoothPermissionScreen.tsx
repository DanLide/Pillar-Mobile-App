import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PERMISSIONS, RESULTS } from 'react-native-permissions';
import { observer } from 'mobx-react';

import { SVGs, colors, fonts } from '../../theme';
import { Button, ButtonType } from '../../components';
import permissionStore from './stores/PermissionStore';
import {
  AppNavigator,
  BluetoothPermissionScreenProps,
} from 'src/navigation/types';

export const BluetoothPermissionScreen = observer(
  ({ navigation, route }: BluetoothPermissionScreenProps) => {
    const [bluetoothPermissionChecked, setBluetoothPermissionChecked] =
      useState<boolean>(false);
    console.warn(permissionStore.bluetoothPermission);

    const params = route.params;

    const onButtonPress = async () => {
      if (permissionStore.bluetoothPermission === RESULTS.DENIED) {
        const result = await permissionStore.requestPermission(
          PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
        );
        if (result === RESULTS.GRANTED && params) {
          navigation.replace(params.nextRoute, {
            orderType: params.orderType,
            succeedBluetooth: true,
          });
        }
        return setBluetoothPermissionChecked(true);
      } else if (
        (permissionStore.bluetoothPermission === RESULTS.BLOCKED ||
          permissionStore.bluetoothPermission === RESULTS.LIMITED) &&
        !bluetoothPermissionChecked
      ) {
        permissionStore.openSetting();
        return setBluetoothPermissionChecked(true);
      }
      navigation.navigate(AppNavigator.SelectStockScreen, {
        orderType: params?.orderType,
        succeedBluetooth: false,
      });
    };

    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Bluetooth Connection</Text>
          <Text style={styles.subtitle}>
            RepairStack would like to connect to your bluetooth, so that you can
            easily unlock cabinets at your shop.
          </Text>
          <SVGs.BluetoothIcon color={colors.black} style={styles.icon} />
          <Text style={styles.subtitle}>
            You may also use your keys to unlock the cabinet.
          </Text>
        </View>
        <Button
          type={ButtonType.primary}
          buttonStyle={styles.button}
          title={'Continue'}
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
