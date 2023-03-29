import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { AppNavigator } from "../../navigation";

import { Button } from "../../components";

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

export const TermsAndConditionsScreen: React.FC<Props> = ({ navigation }) => {
  const onAccept = () => {
    // TODO accept request
    navigation.reset({
      index: 0,
      routes: [{ name: AppNavigator.HomeScreen }],
    });
  };

  return (
    <View style={styles.container}>
      <Text>Term of condition screen</Text>

      <Button buttonStyle={styles.button} title="Accept" onPress={onAccept} />
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
