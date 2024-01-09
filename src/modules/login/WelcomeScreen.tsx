import { StackNavigationProp } from '@react-navigation/stack';
import React, { useRef } from 'react';
import { Image, StyleSheet, Text, View} from 'react-native';
import { SvgProps } from 'react-native-svg';
import { ssoLogin } from 'src/data/ssoLogin';

import Logo from '../../../assets/images/logo.png';
import { Button, ButtonType } from '../../components';
import {
  AppNavigator,
  LoginType,
  UnauthStackParamsList,
} from '../../navigation/types';
import { SVGs, colors, fonts } from '../../theme';
import { DeviceName } from './components/DeviceName';
import { ssoStore } from 'src/stores';

interface Props {
  navigation: StackNavigationProp<
    UnauthStackParamsList,
    AppNavigator.WelcomeScreen
  >;
}

const LOGIN_ICON_PROPS: SvgProps = { color: colors.purpleDark };

export const WelcomeScreen = ({ navigation }: Props) => {
  const ssoStoreRef = useRef(ssoStore).current;

  const onPressLoginWithUsername = () => {
    navigation.navigate(AppNavigator.LoginViaCredentialsScreen, {
      type: LoginType.LoginShopDevice,
    });
  };

  const handleConfigureDevice = () => {
    navigation.navigate(AppNavigator.LoginViaCredentialsScreen, {
      type: LoginType.ConfigureShopDevice,
    });
  };

  const onLoginViaCredentials = () => {
    navigation.navigate(AppNavigator.LoginViaCredentialsScreen);
  };

  const onLoginViaPin = () => {
    navigation.navigate(AppNavigator.LoginViaPinScreen);
  };

  const onUpdateLocation = () => {
    navigation.navigate(AppNavigator.UpdateShopLocationScreen);
  };

  const onPressSSOLogin = async () => {
    await ssoLogin();
  };

  return (
    <View style={styles.container}>
      <View style={styles.continueContainer}>
        <Image source={Logo} style={styles.image} resizeMode="contain" />
        <Text style={styles.text}>Welcome to RepairStack!</Text>
        {ssoStoreRef.getIsDeviceConfiguredBySSO ? (
          <View>
            <Text style={styles.locationText}>
              {ssoStore.getCurrentSSO?.address}
            </Text>
            {/* <TouchableOpacity onPress={onUpdateLocation}>
              <Text style={styles.updateLocationBtn}>Update Location</Text>
            </TouchableOpacity> */}
          </View>
        ) : (
          <Text style={styles.locationText}>(Location not set)</Text>
        )}
        {ssoStoreRef.getIsDeviceConfiguredBySSO ? (
          <>
            <Button
              type={ButtonType.primary}
              buttonStyle={styles.continueButton}
              title="Continue"
              onPress={onLoginViaPin}
            />
            <Button
              type={ButtonType.secondary}
              buttonStyle={styles.secondaryBtn}
              title="Login with Username"
              onPress={onPressLoginWithUsername}
            />
          </>
        ) : (
          <>
            <Button
              type={ButtonType.primary}
              buttonStyle={styles.continueButton}
              title="Configure shop device"
              onPress={handleConfigureDevice}
            />
            <Button
              type={ButtonType.secondary}
              buttonStyle={styles.secondaryBtn}
              title="Admin device login"
              onPress={onLoginViaCredentials}
            />
          </>
        )}
      </View>
      <DeviceName />
      <View style={styles.ssoLoginContainer}>
        <Text style={styles.text}>3M Employee ?</Text>
        <Button
          type={ButtonType.primary}
          icon={SVGs.ConnectedWorker}
          iconProps={LOGIN_ICON_PROPS}
          buttonStyle={styles.ssoLoginButton}
          textStyle={styles.ssoLoginButtonText}
          title="Log In with Single Sign-On (SSO)"
          onPress={onPressSSOLogin}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  continueContainer: {
    marginTop: 150,
    alignItems: 'center',
    textAlign: 'center',
  },
  continueButton: {
    marginTop: 36,
    width: '90%',
  },
  ssoLoginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  ssoLoginButton: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  ssoLoginButtonText: {
    paddingLeft: 8,
    fontSize: 13,
    fontFamily: fonts.TT_Bold,
    lineHeight: 18,
    color: colors.purpleDark,
  },
  image: {
    width: '75%',
    height: undefined,
    aspectRatio: 4,
    marginLeft: 8,
  },
  text: {
    paddingTop: 4,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Bold,
    color: colors.black,
  },
  locationText: {
    paddingVertical: 4,
    paddingHorizontal: 32,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Bold,
    color: colors.grayText,
    textAlign: 'center',
  },
  secondaryBtn: {
    marginTop: 24,
    width: '90%',
  },
  updateLocationBtn: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    color: colors.purpleDark,
  },
});
