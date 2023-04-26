import React, { useRef, useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { observer } from 'mobx-react';

import { onLogin } from '../../../data/login';
import { authStore } from '../../../stores';

import { LoginForm } from './LoginForm';
import LoginWithPIN, { LoginWithPINProps } from './LoginWithPIN';

export const LoginScreen = observer(() => {
  const store = useRef(authStore).current;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPIN, setIsPIN] = useState(false);

  const { top } = useSafeAreaInsets();

  const switchContainerStyle = useMemo(
    () => [styles.switchContainer, { top }],
    [top],
  );

  const onSubmitLogin = useCallback(
    async (username: string, password: string) => {
      setIsLoading(true);
      const error = await onLogin({ username, password }, store);
      setIsLoading(false);

      if (error) {
        const message =
          ('error_description' in error && error.error_description) ||
          error.message ||
          'Login Failed!';

        Alert.alert('Error', message);
      }
    },
    [store],
  );

  const handleLoginWithPIN = useCallback<LoginWithPINProps['onTokenReceived']>(
    token => console.log('TOKEN', token),
    [],
  );

  const onPressPIN = () => setIsPIN(true);
  const onPressForm = () => setIsPIN(false);

  return (
    <View style={styles.container}>
      <View style={switchContainerStyle}>
        <TouchableOpacity onPress={onPressForm}>
          <Text style={styles.switchText}>Form</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={onPressPIN}>
          <Text style={styles.switchText}>PIN</Text>
        </TouchableOpacity>
      </View>
      {isPIN ? (
        <LoginWithPIN onTokenReceived={handleLoginWithPIN} />
      ) : (
        <LoginForm onPress={onSubmitLogin} isLoading={isLoading} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  switchText: {
    justifyContent: 'center',
    paddingVertical: 20,
    fontSize: 15,
    width: 90,
    textAlign: 'center',
  },
  separator: {
    width: 1,
    backgroundColor: 'black',
  },
  switchContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'gray',
    borderRadius: 20,
  },
});
