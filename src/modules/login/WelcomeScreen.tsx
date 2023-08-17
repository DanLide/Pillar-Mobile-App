import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Button, ButtonType } from '../../components';
import Logo from '../../../assets/images/Logo.png';
import { colors, fonts, SVGs } from '../../theme';
import { AppNavigator, UnauthStackParamsList } from '../../navigation/types';
import { ssoLogin } from '../../data/ssoLogin';
import { SvgProps } from 'react-native-svg';

interface Props {
  navigation: StackNavigationProp<
    UnauthStackParamsList,
    AppNavigator.WelcomeScreen
  >;
}

const LOGIN_ICON_PROPS: SvgProps = { color: colors.purpleDark };

export const WelcomeScreen = ({ navigation }: Props) => {
  const onPressContinue = () => {
    navigation.navigate(AppNavigator.LoginScreen);
  };

  const onPressSSOLogin = async () => {
    await ssoLogin();
  };
  return (
    <View style={styles.container}>
      <View style={styles.continueContainer}>
        <Image source={Logo} style={styles.image} resizeMode="contain" />
        <Text style={styles.text}>Welcome to RepairStack!</Text>
        <Button
          type={ButtonType.primary}
          buttonStyle={styles.continueButton}
          title="Continue"
          onPress={onPressContinue}
        />
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
});
