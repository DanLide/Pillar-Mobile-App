import { useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import { LoggingService } from 'src/services';
import { authStore, masterLockStore, ssoStore } from '../../stores';
import { AppNavigator, HomeStackParamList } from '../../navigation/types';
import { permissionProvider } from '../../data/providers';
import { colors, commonStyles, fonts, SVGs } from '../../theme';

import ListItem from './components/ListItem';
import { StackNavigationProp } from '@react-navigation/stack';
import { stocksStore } from '../stocksList/stores';
import PermissionStore from '../permissions/stores/PermissionStore';
import { RESULTS } from 'react-native-permissions';

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

  useEffect(() => {
    LoggingService.setInitializer(
      authStore.getLoginUserName || authStore.getUserName,
      ssoStore.getCurrentSSO?.name,
      ssoStore.getCurrentSSO?.pisaId,
    );
  }, []);

  useEffect(() => {
    (async () => {
      const tasks = [];
      if (!stocksStore.SSOStocks.length) {
        tasks.push(await stocksStore.fetchSSOStocks());
      }
      if (PermissionStore.locationPermission !== RESULTS.GRANTED) {
        tasks.push(
          await PermissionStore.requestPermission(
            'ios.permission.LOCATION_WHEN_IN_USE',
          ),
        );
      }
      await Promise.allSettled(tasks);
      if (PermissionStore.isMasterLockPermissionsGranted) {
        await masterLockStore.initMasterLockForStocks(stocksStore.SSOStocks);
      }
    })();
    return () => {
      masterLockStore.deinit();
    };
  }, []);

  return (
    <View style={commonStyles.flex1}>
      <TouchableOpacity
        onPress={onNavigateToSelectShopLocation}
        style={styles.infoContainer}
        disabled={!isNavigationToShopSelectAvailable}
        accessibilityLabel="onNavigateToSelectShopLocation"
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
            accessibilityLabel="Remove Products"
          />
        )}
        {renderBorderBetweenTheItems && <View style={styles.separator} />}
        {userPermissions.returnProduct && (
          <ListItem
            title={t('returnProducts')}
            subtitle={t('checkProductsBackIntoInventory')}
            leftIcon={ArrowBottomIcon}
            onPress={onReturnProducts}
            accessibilityLabel="Return Products"
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
            accessibilityLabel="Create Invoice"
          />
        </View>
      )}

      <View style={styles.shadowWrapper}>
        <ListItem
          title={t('manageProducts')}
          subtitle={t('viewAndEditProductDetails')}
          leftIcon={ManageProductIcon}
          onPress={onManageProducts}
          accessibilityLabel="Manage Products"
        />
      </View>

      {userPermissions.viewOrders && (
        <View style={styles.shadowWrapper}>
          <ListItem
            title={t('manageOrders')}
            subtitle={t('createEditReceiveOrders')}
            leftIcon={ManageOrderIcon}
            onPress={onOrders}
            accessibilityLabel="Manage Orders"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 10,
  },
  separator: {
    height: 0.5,
    width: '100%',
    backgroundColor: colors.gray,
  },
});
