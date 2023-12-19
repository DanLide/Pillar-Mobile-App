import React, { useCallback } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import SecretCodeForm from 'src/components/SecretCodeForm';
import { colors, fonts } from 'src/theme';
import { InfoTitleBar, InfoTitleBarType } from 'src/components';
import { AppNavigator, UnauthStackParamsList } from 'src/navigation/types';

type Props = StackScreenProps<
  UnauthStackParamsList,
  AppNavigator.CreatePinScreen
>;

export const CreatePinScreen: React.FC<Props> = ({ route }) => {
  const { username } = route.params;

  const handleConfirm = useCallback((code: string) => {
    console.log('PIN', code);
  }, []);

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
        cellCount={4}
        handleConfirm={handleConfirm}
        keyboardType="number-pad"
        style={styles.codeForm}
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
