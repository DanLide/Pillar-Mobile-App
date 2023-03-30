import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "../../components";
import { onGetRoleManager } from "../../data/getRoleManager";
import { authStore } from "../../stores";

export const HomeScreen = () => {
  const onGetRoleManagerPress = async () => {
    const error = await onGetRoleManager("token");
    console.log(error, "error");
  };

  const onLogout = () => {
    authStore.logOut();
  };

  return (
    <View style={styles.container}>
      <Button
        buttonStyle={styles.button}
        title="Try broken getRoleManager"
        onPress={onGetRoleManagerPress}
      />

      <Button buttonStyle={styles.button} title="Logout" onPress={onLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    margin: 16,
  },
});
