import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  Button,
  ButtonType,
  InfoTitleBar,
  InfoTitleBarType,
  Input,
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
import {
  AppNavigator,
  LeftBarType,
  LoginType,
  UnauthStackParamsList,
} from 'src/navigation/types';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack';
import { getScreenOptions } from 'src/navigation/helpers';
import { NativeStackNavigationEventMap } from 'react-native-screens/lib/typescript/native-stack/types';

type Props = NativeStackScreenProps<
  UnauthStackParamsList,
  AppNavigator.LoginViaCredentialsScreen
>;

const LoginViaCredentialsScreenContent = observer(
  ({ route, navigation }: Props) => {
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
        showToast(
          'Sorry, your username and password are incorrect. Please try again.',
          {
            type: ToastType.Error,
            duration: 0,
          },
        );
      } else if (error.code === 'no_permission') {
        showToast(error.message, {
          type: ToastType.Error,
          duration: 0,
        });
      } else {
        showToast('Sorry, we are not able to login.', {
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

    useEffect(() => {
      switch (route.params?.type) {
        case LoginType.ConfigureShopDevice:
          {
            navigation.setOptions(
              getScreenOptions({
                title: 'Configure Shop Device',
                leftBarButtonType: LeftBarType.Back,
              }) as Partial<NativeStackNavigationEventMap>,
            );
          }
          break;
        default:
          break;
      }
    }, [navigation, route.params?.type]);

    return (
      <View style={styles.container}>
        <InfoTitleBar
          title="Login with your username and password"
          type={InfoTitleBarType.Secondary}
        />
        <Text style={styles.title}>Account Login</Text>
        <Input
          label="Username"
          containerStyle={styles.input}
          value={loginFormRef.getUsername}
          editable={!isLoading}
          selectTextOnFocus={!isLoading}
          onChangeText={onChangeUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          label="Password"
          containerStyle={[styles.input, styles.inputTopMargin]}
          value={loginFormRef.getPassword}
          editable={!isLoading}
          selectTextOnFocus={!isLoading}
          onChangeText={onChangePassword}
          rightIcon={isPasswordVisible ? SVGs.OpenEyeIcon : SVGs.CloseEyeIcon}
          onRightIconPress={onRightIconPress}
          secureTextEntry={!isPasswordVisible}
          rightLabel="Required"
        />
        <View style={styles.secondaryButtonsContainer}>
          <Text style={styles.secondaryButton}>Forgot Username</Text>
          <View style={styles.separator} />
          <Text style={styles.secondaryButton}>Forgot Password</Text>
        </View>
        <Button
          type={ButtonType.primary}
          title="Login"
          disabled={isDisabled}
          buttonStyle={styles.buttonStyle}
          onPress={onSubmit}
          isLoading={isLoading}
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
  secondaryButton: {
    fontSize: 14,
    lineHeight: 14,
    fontFamily: fonts.TT_Regular,
    color: colors.purpleDark,
  },
});
