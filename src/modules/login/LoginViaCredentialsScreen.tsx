import { observer } from 'mobx-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack';
import { NativeStackNavigationEventMap } from 'react-native-screens/lib/typescript/native-stack/types';
import { ssoLogin } from 'src/data/ssoLogin';
import { getScreenOptions } from 'src/navigation/helpers';
import {
  AppNavigator,
  LeftBarType,
  LoginType,
  UnauthStackParamsList,
} from 'src/navigation/types';
import {
  Button,
  ButtonType,
  InfoTitleBar,
  InfoTitleBarType,
  Input,
  TextButton,
} from '../../components';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from '../../contexts';
import { ToastType } from '../../contexts/types';
import { isBadRequestError } from '../../data/helpers/utils';
import { onLogin } from '../../data/login';
import { useSingleToast } from '../../hooks';
import { authStore } from '../../stores';
import { SVGs, colors, fonts } from '../../theme';
import { LoginFormStore } from './stores/LoginFormStore';
import { URLProvider } from 'src/data/helpers';

type Props = NativeStackScreenProps<
  UnauthStackParamsList,
  AppNavigator.LoginViaCredentialsScreen
>;

const LoginViaCredentialsScreenContent = observer(
  ({ route, navigation }: Props) => {
    const { t } = useTranslation();
    const { showToast } = useSingleToast();
    const loginFormRef = useRef(new LoginFormStore()).current;
    const authStoreRef = useRef(authStore).current;
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = useCallback(async () => {
      setIsLoading(true);
      const error = await onLogin(
        { username: loginFormRef.username, password: loginFormRef.password },
        authStoreRef,
        route.params?.type,
      );
      if (
        isBadRequestError(error) &&
        error.error_description?.includes('AADB2C90225')
      ) {
        showToast(t('incorrectUsernameAndPassword'), {
          type: ToastType.Error,
          duration: 0,
        });
        // } else if (error.code === 'no_permission') {
        //   showToast(error.message, {
        //     type: ToastType.ProfileError,
        //     duration: 0,
        //   });
      } else {
        showToast(t('weAreNotAbleToLogin'), {
          type: ToastType.Retry,
          duration: 0,
          onPress: onSubmit,
        });
      }

      setIsLoading(false);
    }, [
      authStoreRef,
      loginFormRef.password,
      loginFormRef.username,
      route.params?.type,
      showToast,
      t,
    ]);

    const onChangeUsername = (value: string) => {
      loginFormRef.setUsername(value);
    };

    const onChangePassword = (value: string) => {
      loginFormRef.setPassword(value);
    };

    const isDisabled =
      loginFormRef.password.length === 0 || loginFormRef.username.length === 0;

    const onRightIconPress = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    const onPressSSOLogin = async () => {
      await ssoLogin();
    };

    const onPressForgotUsernamePassword = () => {
      const url = new URLProvider().webURL();
      Linking.openURL(url);
    };

    useEffect(() => {
      switch (route.params?.type) {
        case LoginType.ConfigureShopDevice:
          {
            navigation.setOptions(
              getScreenOptions({
                title: t('configureShopDevice'),
                leftBarButtonType: LeftBarType.Back,
              }) as Partial<NativeStackNavigationEventMap>,
            );
          }
          break;
        default:
          break;
      }
    }, [navigation, route.params?.type, t]);

    return (
      <View style={styles.container}>
        <InfoTitleBar
          title={t('loginWithYourUsernameAndPassword')}
          type={InfoTitleBarType.Secondary}
        />
        <Text style={styles.title}>{t('accountLogin')}</Text>
        <Input
          label={t('username')}
          containerStyle={styles.input}
          value={loginFormRef.getUsername}
          editable={!isLoading}
          selectTextOnFocus={!isLoading}
          onChangeText={onChangeUsername}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Username"
        />
        <Input
          label={t('password')}
          containerStyle={[styles.input, styles.inputTopMargin]}
          value={loginFormRef.getPassword}
          editable={!isLoading}
          selectTextOnFocus={!isLoading}
          onChangeText={onChangePassword}
          rightIcon={isPasswordVisible ? SVGs.OpenEyeIcon : SVGs.CloseEyeIcon}
          onRightIconPress={onRightIconPress}
          secureTextEntry={!isPasswordVisible}
          rightLabel={t('required')}
          accessibilityLabel="Password"
        />
        <View style={styles.secondaryButtonsContainer}>
          <TextButton
            title={t('forgotUsername')}
            onPress={onPressForgotUsernamePassword}
            style={styles.bottomButton}
            fontFamily="TT_Regular"
          />
          <View style={styles.separator} />
          <TextButton
            title={t('forgotPassword')}
            onPress={onPressForgotUsernamePassword}
            style={styles.bottomButton}
            fontFamily="TT_Regular"
          />
        </View>
        <View style={styles.ssoLoginContainer}>
          <Text style={styles.text}>{t('mmmEmployee')} ?</Text>
          <TextButton
            leftIconName="worker"
            title={t('loginWithSso')}
            onPress={onPressSSOLogin}
            color="purpleDark3"
            style={styles.bottomButton}
          />
        </View>
        <Button
          type={ButtonType.primary}
          title={t('login')}
          disabled={isDisabled}
          buttonStyle={styles.buttonStyle}
          onPress={onSubmit}
          isLoading={isLoading}
          accessibilityLabel="Login button"
        />
      </View>
    );
  },
);

export const LoginViaCredentialsScreen = (props: Props) => (
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <LoginViaCredentialsScreenContent {...props} />
  </ToastContextProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 19,
    lineHeight: 24,
    color: colors.black,
    fontFamily: fonts.TT_Regular,
    textAlign: 'center',
    paddingVertical: 24,
  },
  inputTopMargin: {
    marginTop: 24,
  },
  input: {
    marginHorizontal: 24,
  },
  buttonStyle: {
    backgroundColor: colors.purple,
    marginTop: 'auto',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  secondaryButtonsContainer: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    width: 1,
    height: 14,
    backgroundColor: colors.grayDark3,
    marginHorizontal: 24,
  },
  ssoLoginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bottomButton: {
    marginVertical: 12,
  },
  text: {
    paddingTop: 4,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Bold,
    color: colors.black,
  },
});
