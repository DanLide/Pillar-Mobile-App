import { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react';

import SecretCodeForm from 'src/components/SecretCodeForm';
import { colors, fonts } from 'src/theme';
import { InfoTitleBar, InfoTitleBarType } from 'src/components';
import { AppNavigator, UnauthStackParamsList } from 'src/navigation/types';
import { onLoginWithPin } from 'src/data/loginViaPin';
import { loginLinkStore } from 'src/modules/login/stores';
import TokenParser from 'src/modules/login/components/TokenParser';
import { onLoginWithToken } from 'src/data/login';
import { authStore } from 'src/stores';
import { ToastContextProvider } from 'src/contexts';
import { useSingleToast } from 'src/hooks';
import { ToastType } from 'src/contexts/types';
import { isBadRequestError } from 'src/data/helpers/utils';

type Props = StackScreenProps<
  UnauthStackParamsList,
  AppNavigator.LoginWithPinScreen
>;

enum ErrorCodes {
  PinNotValid = 4,
}

const errorMessages = {
  validationError: 'Incorrect PIN code',
  submitError: 'Something went wrong. Please, retry',
};

const LoginWithPinScreenBase: React.FC<Props> = observer(({ route }) => {
  const authStoreRef = useRef(authStore).current;
  const loginLinkStoreRef = useRef(loginLinkStore).current;

  const [validationError, setValidationError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useSingleToast();

  const { username, b2cUserId } = route.params;

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
      setIsLoading(true);
      const error = await onLoginWithPin(b2cUserId, pin, loginLinkStoreRef);

      if (!error) return;

      setIsLoading(false);

      if (
        isBadRequestError(error) &&
        error.errorCode === ErrorCodes.PinNotValid
      ) {
        return setValidationError(true);
      }

      showSubmitErrorToast();
    },
    [b2cUserId, loginLinkStoreRef, showSubmitErrorToast],
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
        title="Please enter your PIN code"
      />
      <Text style={styles.username}>{username}</Text>
      <SecretCodeForm
        autoFocus
        autoSubmit
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
});

export const LoginWithPinScreen: React.FC<Props> = props => (
  <ToastContextProvider>
    <LoginWithPinScreenBase {...props} />
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
