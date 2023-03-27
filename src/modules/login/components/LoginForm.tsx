import React, { useRef } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { observer } from "mobx-react";

import { Input, Button } from "../../../components";
import { LoginFormStore } from "../stores/LoginFormStore";

interface Props {
  isLoading: boolean;

  onPress: (login: string, password: string) => void;
}

export const LoginForm: React.FC<Props> = observer(({ isLoading, onPress }) => {
  const store = useRef(new LoginFormStore({})).current;

  const onSubmit = () => {
    onPress(store.username, store.password);
  };

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        placeholder={"username"}
        value={store.username}
        onChangeText={(value) => {
          store.setUsername(value);
        }}
      />
      <Input
        style={styles.input}
        placeholder={"password"}
        value={store.password}
        secureTextEntry={true}
        onChangeText={(value) => {
          store.setPassword(value);
        }}
      />
      {isLoading ? (
        <View style={styles.buttonStyle}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <Button
          title="Submit"
          buttonStyle={styles.buttonStyle}
          onPress={onSubmit}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    margin: 15,
  },
  container: {
    justifyContent: "center",
  },
  buttonStyle: {
    marginTop: 20,
    marginHorizontal: 20,
  },
});
