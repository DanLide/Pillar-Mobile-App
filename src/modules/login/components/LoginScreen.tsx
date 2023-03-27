import React, { useRef, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { observer } from "mobx-react";

import { onLogin } from "../../../data/login";
import { authStore } from "../../../stores";

import { LoginForm } from "./LoginForm";

export const LoginScreen = observer(() => {
  const store = useRef(authStore).current;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmitLogin = async (username: string, password: string) => {
    setIsLoading(true);
    const error = await onLogin({ username, password }, store);
    setIsLoading(false);

    if (error) {
      const message = error.error || error.message || "Login Failed!";

      Alert.alert("Error", message);
    }
  };

  return (
    <View style={styles.container}>
      <LoginForm onPress={onSubmitLogin} isLoading={isLoading} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
