import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { Button } from '../../components';
import { onGetRoleManager } from '../../data/getRoleManager';
import { authStore } from '../../stores';
import { AppNavigator } from '../../navigation';
interface Props {
  navigation: NavigationProp<ParamListBase>;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const onGetRoleManagerPress = async () => {
    const error = await onGetRoleManager('token');
  };

  const onRemoveProducts = () => {
    navigation.navigate(AppNavigator.RemoveProductsStack);
  };

  const onLogout = () => {
    authStore.logOut();
  };

  return (
    <View style={styles.container}>
      <Button
        buttonStyle={styles.button}
        title="Remove Products"
        onPress={onRemoveProducts}
      />
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
    justifyContent: 'center',
  },
  button: {
    margin: 16,
  },
});
