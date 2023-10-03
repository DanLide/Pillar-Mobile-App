import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SvgProps } from 'react-native-svg';
import { ssoLogin } from 'src/data/ssoLogin';

import { Button, ButtonType } from '../../components';
import Logo from '../../../assets/images/logo.png';
import { colors, fonts, SVGs } from '../../theme';
import { AppNavigator, UnauthStackParamsList } from '../../navigation/types';

interface Props {
  navigation: StackNavigationProp<
    UnauthStackParamsList,
    AppNavigator.WelcomeScreen
  >;
}

const LOGIN_ICON_PROPS: SvgProps = { color: colors.purpleDark };
const isDeviceConfigured = false;

export const WelcomeScreen = ({ navigation }: Props) => {
  const onPressContinue = () => {
    navigation.navigate(AppNavigator.LoginViaCredentialsScreen);
  };

  const onPressSSOLogin = async () => {
    await ssoLogin();
  };

  return (
    <View style={styles.container}>
      <View style={styles.continueContainer}>
        <Image source={Logo} style={styles.image} resizeMode="contain" />
        <Text style={styles.text}>Welcome to RepairStack!</Text>
        {isDeviceConfigured ? (
          <View>
            <Text style={styles.locationText}>Location</Text>
            <TouchableOpacity onPress={() => console.log('Update Location')}>
              <Text style={styles.updateLocationBtn}>Update Location</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.locationText}>(Location not set)</Text>
        )}
        {isDeviceConfigured ? (
          <>
            <Button
              type={ButtonType.primary}
              buttonStyle={styles.continueButton}
              title="Continue"
              onPress={onPressContinue}
            />
            <Button
              type={ButtonType.secondary}
              buttonStyle={styles.secondaryBtn}
              title="Login with Username"
              onPress={() => console.log('Login with Username')}
            />
          </>
        ) : (
          <>
            <Button
              type={ButtonType.primary}
              buttonStyle={styles.continueButton}
              title="Configure shop device"
              onPress={() => console.log('Configure shop device')}
            />
            <Button
              type={ButtonType.secondary}
              buttonStyle={styles.secondaryBtn}
              title="Admin device login"
              onPress={() => console.log('Admin device login')}
            />
          </>
        )}
      </View>
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
    paddingTop: 4,
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
