import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../components';
import { onGetRoleManager } from '../../data/getRoleManager';
import { authStore } from '../../stores';
import { hasAllPermissions } from '../../data/helpers';
import { Permission } from '../../constants';

const MANAGE_ORDERS_PERMISSIONS: Permission[] = [
  Permission.InventoryManagement_OrderMobile_View,
  Permission.InventoryManagement_OrderMobile_Create,
  Permission.InventoryManagement_OrderMobile_Edit,
];

export const HomeScreen: React.FC = () => {
  const userHasOrderPermission = hasAllPermissions(MANAGE_ORDERS_PERMISSIONS);

  const onGetRoleManagerPress = async () => {
    const error = await onGetRoleManager('token');
    console.log(error, 'error');
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

      {userHasOrderPermission && (
        <Button buttonStyle={styles.button} title="Manage orders" />
      )}

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
