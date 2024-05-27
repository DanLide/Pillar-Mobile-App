import { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import { authStore, ssoStore } from '../../stores';
import { AppNavigator, HomeStackParamList } from '../../navigation/types';
import { permissionProvider } from '../../data/providers';
import { colors, fonts, SVGs } from '../../theme';

import ListItem from './components/ListItem';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
  navigation: StackNavigationProp<HomeStackParamList, AppNavigator.HomeScreen>;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const isNavigationToShopSelectAvailable =
    (ssoStore.getSSOList?.length || 0) > 1 &&
    !ssoStore.getIsDeviceConfiguredBySSO;

  const { userPermissions } = permissionProvider;

  const onRemoveProducts = () => {
    navigation.navigate(AppNavigator.RemoveProductsStack);
  };

  const onReturnProducts = () =>
    navigation.navigate(AppNavigator.ReturnProductsStack);

  const onManageProducts = () =>
    navigation.navigate(AppNavigator.ManageProductsStack);

  const onOrders = () => navigation.navigate(AppNavigator.OrdersStack);

  const ArrowTopIcon = useMemo(() => <SVGs.ArrowTopIcon />, []);
  const ArrowBottomIcon = useMemo(() => <SVGs.ReturnProductIcon />, []);
  const ManageProductIcon = useMemo(() => <SVGs.ManageProductIcon />, []);
  const ManageOrderIcon = useMemo(() => <SVGs.ManageOrderIcon />, []);
  const InvoiceIcon = useMemo(() => <SVGs.InvoiceIcon />, []);

  const onCreateInvoice = () =>
    navigation.navigate(AppNavigator.CreateInvoiceStack);

  const onNavigateToSelectShopLocation = () => {
    navigation.navigate(AppNavigator.SelectSSOScreen, { isUpdating: true });
  };

  const renderBorderBetweenTheItems =
    userPermissions.removeProduct && userPermissions.returnProduct;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onNavigateToSelectShopLocation}
        style={styles.infoContainer}
        disabled={!isNavigationToShopSelectAvailable}
      >
        <SVGs.CabinetIcon />
        <Text style={styles.infoText}>{ssoStore.getCurrentSSO?.name}</Text>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <SVGs.ProfileIcon />
        <Text style={styles.infoText}>{authStore.getName}</Text>
      </View>
      <View style={styles.shadowWrapper}>
        {userPermissions.removeProduct && (
          <ListItem
            title={t('removeProducts')}
            subtitle={t('checkProductsOutOfInventory')}
            leftIcon={ArrowTopIcon}
            onPress={onRemoveProducts}
          />
        )}
        {renderBorderBetweenTheItems && <View style={styles.separator} />}
        {userPermissions.returnProduct && (
          <ListItem
            title={t('returnProducts')}
            subtitle={t('checkProductsBackIntoInventory')}
            leftIcon={ArrowBottomIcon}
            onPress={onReturnProducts}
          />
        )}
      </View>

      {userPermissions.createInvoice && (
        <View style={styles.shadowWrapper}>
          <ListItem
            title={t('createInvoice')}
            subtitle={t('addMaterialsToOrder')}
            leftIcon={InvoiceIcon}
            onPress={onCreateInvoice}
          />
        </View>
      )}

      <View style={styles.shadowWrapper}>
        <ListItem
          title={t('manageProducts')}
          subtitle={t('viewAndEditProductDetails')}
          leftIcon={ManageProductIcon}
          onPress={onManageProducts}
        />
      </View>

      {userPermissions.viewOrders && (
        <View style={styles.shadowWrapper}>
          <ListItem
            title={t('manageOrders')}
            subtitle={t('createEditReceiveOrders')}
            leftIcon={ManageOrderIcon}
            onPress={onOrders}
          />
        </View>
      )}
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
