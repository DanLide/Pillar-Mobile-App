import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { Button } from '../../components';
import { onGetRoleManager } from '../../data/getRoleManager';
import { authStore, ssoStore } from '../../stores';
import { AppNavigator } from '../../navigation/types';
import { permissionProvider } from '../../data/providers';
import { colors, fonts, SVGs } from '../../theme';

import ListItem from './components/ListItem';

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

  const ArrowTopIcon = useMemo(() => <SVGs.ArrowTopIcon />, []);
  const ArrowBottomIcon = useMemo(() => <SVGs.ArrowTopIcon style={styles.arrowStyle} />, []);
  const ManageProductIcon = useMemo(() => <SVGs.ManageProductIcon />, []);
  const ManageOrderIcon = useMemo(() => <SVGs.ManageOrderIcon />, []);


  const renderBorderBetweenTheItems = canRemoveProduct && canReturnProduct;
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <SVGs.CabinetIcon />
        <Text style={styles.infoText}>
          {ssoStore.getCurrentSSO?.name}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <SVGs.ProfileIcon />
        <Text style={styles.infoText}>
          {authStore.getName}
        </Text>
      </View>
      <View style={styles.shadowWrapper}>
        {canRemoveProduct && (
          <ListItem
            title='Remove Products'
            subtitle='Check products out of inventory'
            leftIcon={ArrowTopIcon}
            onPress={onRemoveProducts}
          />
        )}
        {
          renderBorderBetweenTheItems && (
            <View style={styles.separator} />
          )
        }
        <ListItem
          title='Return Products'
          subtitle='Check products back into inventory'
          leftIcon={ArrowBottomIcon}
          onPress={onReturnProducts}
        />
      </View>

      <View style={styles.shadowWrapper}>
        <ListItem
          title='Manage Products'
          subtitle='View and edit product details'
          disabled
          leftIcon={ManageProductIcon}
          onPress={onRemoveProducts}
        />
      </View>

      <View style={styles.shadowWrapper}>
        <ListItem
          title='Manage Orders'
          subtitle='Create, edit and receive product orders '
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
  arrowStyle: {
    transform: [{ rotate: '180deg' }],
  },
  separator: {
    height: 0.5,
    width: '100%',
    backgroundColor: colors.gray,
  }
});
