import React, { useRef } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react';

import { Input, Button } from '../../../components';
import { LoginFormStore } from '../stores/LoginFormStore';

interface Props {
  isLoading: boolean;

  onPress: (login: string, password: string) => void;
}

export const LoginForm: React.FC<Props> = observer(({ isLoading, onPress }) => {
  const store = useRef(new LoginFormStore()).current;

  const onSubmit = () => {
    onPress(store.username, store.password);
  };

  const onChangeUsername = (value: string) => {
    store.setUsername(value);
  };

  const onChangePassword = (value: string) => {
    store.setPassword(value);
  };

  const isDisabled = store.password.length === 0 && store.username.length === 0;

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        placeholder={'username'}
        value={store.username}
        editable={!isLoading}
        selectTextOnFocus={!isLoading}
        onChangeText={onChangeUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Input
        style={styles.input}
        placeholder={'password'}
        value={store.password}
        editable={!isLoading}
        selectTextOnFocus={!isLoading}
        secureTextEntry={true}
        onChangeText={onChangePassword}
      />
      <Button
        title="Submit"
        disabled={isDisabled}
        buttonStyle={styles.buttonStyle}
        onPress={onSubmit}
        isLoading={isLoading}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    margin: 15,
  },
  container: {
    justifyContent: 'center',
  },
  buttonStyle: {
    marginTop: 20,
    marginHorizontal: 20,
  },
});
