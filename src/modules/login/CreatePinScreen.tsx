import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import SecretCodeForm from 'src/components/SecretCodeForm';
import { colors, fonts } from 'src/theme';
import { InfoTitleBar, InfoTitleBarType } from 'src/components';
import { AppNavigator, UnauthStackParamsList } from 'src/navigation/types';
import { onSetPin } from 'src/data/setPin';

type Props = StackScreenProps<
  UnauthStackParamsList,
  AppNavigator.CreatePinScreen
>;

const errorMessages = {
  validationError: "PIN Codes doesn't match",
  submitError: 'Something went wrong. Please, retry',
};

export const CreatePinScreen: React.FC<Props> = ({ navigation, route }) => {
  const [validationError, setValidationError] = useState(false);

  const { username, b2cUserId, prevPin } = route.params;

  const handlePinChange = useCallback(() => {
    setValidationError(false);
  }, []);

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

      const error = await onSetPin(b2cUserId, pin);

      if (error) console.log(error);
    },
    [b2cUserId, navigation, prevPin, username],
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
        style={styles.codeForm}
        onChangeText={handlePinChange}
        handleConfirm={handleConfirm}
      />
    </KeyboardAvoidingView>
  );
};

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
