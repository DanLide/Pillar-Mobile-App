import React, { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react';

import SecretCodeForm from 'src/components/SecretCodeForm';
import { colors, fonts } from 'src/theme';
import { InfoTitleBar, InfoTitleBarType } from 'src/components';
import { AppNavigator, UnauthStackParamsList } from 'src/navigation/types';
import { onSetPin } from 'src/data/setPin';
import { loginLinkStore } from 'src/modules/login/stores';
import TokenParser from 'src/modules/login/components/TokenParser';
import { onLoginWithToken } from 'src/data/login';
import { authStore } from 'src/stores';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from 'src/contexts';
import { useSingleToast } from 'src/hooks';
import { ToastType } from 'src/contexts/types';

type Props = StackScreenProps<
  UnauthStackParamsList,
  AppNavigator.CreatePinScreen
>;

const errorMessages = {
  validationError: "PIN Codes doesn't match",
  submitError: 'Something went wrong. Please, retry',
};

export const CreatePinScreenBase: React.FC<Props> = observer(
  ({ navigation, route }) => {
    const authStoreRef = useRef(authStore).current;
    const loginLinkStoreRef = useRef(loginLinkStore).current;

    const [validationError, setValidationError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { showToast } = useSingleToast();

    const { username, b2cUserId, prevPin } = route.params;

    const loginLink = loginLinkStoreRef.getLoginLink;

    const handlePinChange = useCallback(() => {
      setValidationError(false);
    }, []);

    const showSubmitErrorToast = useCallback(() => {
      showToast(errorMessages.submitError, { type: ToastType.Error });
      setIsLoading(false);
    }, [showToast]);

    const handleConfirm = useCallback(
      async (pin: string) => {
        if (!prevPin) {
          return navigation.push(AppNavigator.CreatePinScreen, {
            username,
            b2cUserId,
            prevPin: pin,
          });
        }

        if (pin !== prevPin) return setValidationError(true);

        setIsLoading(true);
        const error = await onSetPin(b2cUserId, pin, loginLinkStoreRef);

        if (error) showSubmitErrorToast();
      },
      [
        b2cUserId,
        loginLinkStoreRef,
        navigation,
        prevPin,
        showSubmitErrorToast,
        username,
      ],
    );

    const handleTokenReceived = useCallback(
      async (token: string) => {
        const error = await onLoginWithToken(token, authStoreRef);

        setIsLoading(false);
        loginLinkStoreRef.clear();

        if (error) showSubmitErrorToast();
      },
      [authStoreRef, loginLinkStoreRef, showSubmitErrorToast],
    );

    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={85}
        behavior="padding"
        style={styles.container}
      >
        <InfoTitleBar
          type={InfoTitleBarType.Secondary}
          title="Create a PIN Code"
        />
        <Text style={styles.username}>{username}</Text>
        <SecretCodeForm
          autoFocus
          cellCount={4}
          keyboardType="number-pad"
          errorMessage={validationError ? errorMessages.validationError : null}
          confirmDisabled={validationError}
          isLoading={isLoading}
          style={styles.codeForm}
          onChangeText={handlePinChange}
          handleConfirm={handleConfirm}
        />
        <TokenParser
          magicLink={loginLink}
          onTokenReceived={handleTokenReceived}
          onError={showSubmitErrorToast}
          onHttpError={showSubmitErrorToast}
          onRequestTimeout={showSubmitErrorToast}
        />
      </KeyboardAvoidingView>
    );
  },
);

export const CreatePinScreen: React.FC<Props> = props => (
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <CreatePinScreenBase {...props} />
  </ToastContextProvider>
);

const styles = StyleSheet.create({
  codeForm: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  username: {
    alignSelf: 'center',
    fontFamily: fonts.TT_Regular,
    fontSize: 19.2,
    lineHeight: 24,
    marginBottom: 12,
    marginTop: 42,
  },
});
