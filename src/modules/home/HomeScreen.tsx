import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { onGetRoleManager } from '../../data/getRoleManager';

import { authStore, ssoStore } from '../../stores';
import { AppNavigator, HomeStackParamList } from '../../navigation/types';
import { permissionProvider } from '../../data/providers';
import { colors, fonts, SVGs } from '../../theme';

import ListItem from './components/ListItem';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '../../components';

interface Props {
  navigation: StackNavigationProp<HomeStackParamList, AppNavigator.HomeScreen>;
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

  const onManageProducts = () =>
    navigation.navigate(AppNavigator.ManageProductsStack);

  const ArrowTopIcon = useMemo(() => <SVGs.ArrowTopIcon />, []);
  const ArrowBottomIcon = useMemo(() => <SVGs.ReturnProductIcon />, []);
  const ManageProductIcon = useMemo(() => <SVGs.ManageProductIcon />, []);
  const ManageOrderIcon = useMemo(() => <SVGs.ManageOrderIcon />, []);
  const InvoiceIcon = useMemo(() => <SVGs.InvoiceIcon />, []);

  const renderBorderBetweenTheItems = canRemoveProduct && canReturnProduct;
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <SVGs.CabinetIcon />
        <Text style={styles.infoText}>{ssoStore.getCurrentSSO?.name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <SVGs.ProfileIcon />
        <Text style={styles.infoText}>{authStore.getName}</Text>
      </View>
      <View style={styles.shadowWrapper}>
        {canRemoveProduct && (
          <ListItem
            title="Remove Products"
            subtitle="Check products out of inventory"
            leftIcon={ArrowTopIcon}
            onPress={onRemoveProducts}
          />
        )}
        {renderBorderBetweenTheItems && <View style={styles.separator} />}
        <ListItem
          title="Return Products"
          subtitle="Check products back into inventory"
          leftIcon={ArrowBottomIcon}
          onPress={onReturnProducts}
        />
      </View>

      <View style={styles.shadowWrapper}>
        <ListItem
          title="Create Invoice"
          subtitle="Add materials to a repair order"
          disabled
          leftIcon={InvoiceIcon}
          onPress={onRemoveProducts}
        />
      </View>

      <View style={styles.shadowWrapper}>
        <ListItem
          title="Manage Products"
          subtitle="View and edit product details"
          disabled
          leftIcon={ManageProductIcon}
          onPress={onManageProducts}
        />
      </View>

      <View style={styles.shadowWrapper}>
        <ListItem
          title="Manage Orders"
          subtitle="Create, edit and receive product orders "
          disabled
          leftIcon={ManageOrderIcon}
          onPress={onRemoveProducts}
        />
      </View>

      {/* <Button
        buttonStyle={styles.button}
        title="Try broken getRoleManager"
        onPress={onGetRoleManagerPress}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    backgroundColor: colors.white,
  },
  infoText: {
    marginLeft: 16,
    fontSize: 15,
    fontFamily: fonts.TT_Regular,
    color: colors.blackLight,
  },
  button: {
    margin: 16,
  },
  shadowWrapper: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  separator: {
    height: 0.5,
    width: '100%',
    backgroundColor: colors.gray,
  },
});
