import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { Button } from '../../components';
import { onGetRoleManager } from '../../data/getRoleManager';
import { authStore } from '../../stores';
import { AppNavigator } from '../../navigation';
import { permissionProvider } from '../../data/providers';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const canRemoveProduct = permissionProvider.canRemoveProduct();
  const canReturnProduct = permissionProvider.canReturnProduct();

  const onGetRoleManagerPress = async () => {
    const error = await onGetRoleManager('token');
  };

  const onRemoveProducts = () => {
    navigation.navigate(AppNavigator.RemoveProductsStack);
  };

  const onReturnProducts = () =>
    navigation.navigate(AppNavigator.ReturnProductsStack);

  const onLogout = () => {
    authStore.logOut();
  };

  return (
    <View style={styles.container}>
      {canRemoveProduct && (
        <Button
          buttonStyle={styles.button}
          title="Remove Products"
          onPress={onRemoveProducts}
        />
      )}
      {canReturnProduct && (
        <Button
          buttonStyle={styles.button}
          title="Return Products"
          onPress={onReturnProducts}
        />
      )}
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
