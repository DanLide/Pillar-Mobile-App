import { observer } from 'mobx-react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ssoLogin } from 'src/data/ssoLogin';
import Logo from '../../../assets/images/logo.png';
import {
  Button,
  ButtonType,
  FocusAwareStatusBar,
  Spacer,
  TextButton,
} from '../../components';
import {
  AppNavigator,
  LoginType,
  UnauthStackParamsList,
} from '../../navigation/types';
import { colors, fonts } from '../../theme';
import { DeviceName } from './components/DeviceName';
import { ssoStore } from 'src/stores';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isIPod } from 'src/constants';

interface Props {
  navigation: StackNavigationProp<
    UnauthStackParamsList,
    AppNavigator.WelcomeScreen
  >;
}

export const WelcomeScreen = observer(({ navigation }: Props) => {
  const { t } = useTranslation();

  const onPressLoginWithUsername = () => {
    navigation.navigate(AppNavigator.LoginViaCredentialsScreen, {
      type: LoginType.LoginShopDevice,
    });
  };

  const handleConfigureDevice = () => {
    navigation.navigate(AppNavigator.ConfigureDeviceStack);
  };

  const onLoginViaCredentials = () => {
    navigation.navigate(AppNavigator.LoginViaCredentialsScreen);
  };

  const onLoginViaPin = () => {
    navigation.navigate(AppNavigator.LoginViaPinScreen);
  };

  const onPressSSOLogin = async () => {
    await ssoLogin();
  };

  return (
    <SafeAreaView edges={{ bottom: 'maximum' }} style={styles.container}>
      <FocusAwareStatusBar barStyle="dark-content" />
      <View style={styles.continueContainer}>
        <Image source={Logo} style={styles.image} resizeMode="contain" />
        <Text style={styles.text}>{t('welcomeToRepairStack')}</Text>
        <Text style={styles.locationText}>
          {ssoStore.getIsDeviceConfiguredBySSO
            ? ssoStore.getCurrentSSO?.name
            : t('locationNotSet')}
        </Text>
        {ssoStore.getIsDeviceConfiguredBySSO ? (
          <>
            <Button
              type={ButtonType.primary}
              buttonStyle={styles.continueButton}
              title={t('start')}
              onPress={onLoginViaPin}
            />
            <Button
              type={ButtonType.primary}
              buttonStyle={styles.loginWithUserNameButton}
              textStyle={styles.loginWithUserNameText}
              title={t('loginWithUsername')}
              onPress={onPressLoginWithUsername}
            />
          </>
        ) : (
          <>
            <Button
              type={ButtonType.primary}
              buttonStyle={styles.continueButton}
              title={t('configureShopDevice')}
              onPress={handleConfigureDevice}
              accessibilityLabel="Configure shop device"
            />
            <Button
              type={ButtonType.secondary}
              buttonStyle={styles.secondaryBtn}
              title={t('adminDeviceLogin')}
              onPress={onLoginViaCredentials}
              accessibilityLabel="Admin device login"
            />
          </>
        )}
      </View>
      <DeviceName />
      <View style={styles.ssoLoginContainer}>
        <Text style={styles.text}>{t('mmmEmployee')} ?</Text>
        <Spacer h={11} />
        <TextButton
          leftIconName="worker"
          title={t('loginWithSso')}
          onPress={onPressSSOLogin}
          color="purpleDark3"
        />
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 10 },
  continueContainer: {
    marginTop: 150,
    alignItems: 'center',
    textAlign: 'center',
  },
  continueButton: {
    marginTop: isIPod ? 24 : 36,
    width: '90%',
  },
  ssoLoginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  loginWithUserNameButton: {
    backgroundColor: 'transparent',
    marginTop: 24,
  },
  loginWithUserNameText: {
    fontSize: 20,
    fontFamily: fonts.TT_Bold,
    lineHeight: 26,
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
});
