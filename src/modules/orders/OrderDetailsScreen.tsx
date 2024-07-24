import { useEffect, useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack';
import { observer } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import { groupBy } from 'ramda';
import { masterLockStore, ssoStore } from 'src/stores';

import { ordersStore } from './stores';
import {
  OrderTitleByStatusType,
  StatusBadge,
  getBadgeStyleByStatusType,
} from './components/StatusBadge';
import { AppNavigator, OrdersParamsList } from '../../navigation/types';
import { fetchOrderDetails } from '../../data/fetchOrderDetails';
import { SVGs, colors, fonts } from '../../theme';
import { Button, ButtonType } from '../../components';
import { OrderStatusType, RoleType } from '../../constants/common.enum';
import { OrdersDetailsStockList } from './components/OrdersDetailsStockList';
import permissionStore from 'src/modules/permissions/stores/PermissionStore';
import { PERMISSIONS, RESULTS } from 'react-native-permissions';
import { ToastType } from 'src/contexts/types';
import { fetchStocks } from 'src/data/fetchStocks';
import { stocksStore } from '../stocksList/stores';
import { useSingleToast } from 'src/hooks';
import { LockStatus, LockVisibility } from 'src/data/masterlock';
import { permissionProvider } from 'src/data/providers';

type Props = NativeStackScreenProps<
  OrdersParamsList,
  AppNavigator.OrderDetailsScreen
>;

export const OrderDetailsScreen = observer(({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const ordersStoreRef = useRef(ordersStore).current;
  const [isLocationPermissionRequested, setIsLocationPermissionRequested] =
    useState(false);
  const locationPermission = permissionStore.locationPermission;
  const isDeviceConfiguredBySSO = ssoStore.getIsDeviceConfiguredBySSO;

  const { userPermissions } = permissionProvider;

  const { showToast, hideAll } = useSingleToast();
  const selectedStockId = useRef('');

  const stockItem = stocksStore.stocks.find(
    stock => stock.partyRoleId === Number(selectedStockId.current),
  );

  const controllerSerialNo = stockItem?.controllerSerialNo || '';

  const isVisible =
    masterLockStore.stocksState[controllerSerialNo]?.visibility ===
    LockVisibility.VISIBLE;

  const lockStatus = masterLockStore.stocksState[controllerSerialNo]?.status;
  const navigateToUnlockScreen =
    isVisible &&
    lockStatus === LockStatus.LOCKED &&
    stockItem?.roleTypeId === RoleType.Cabinet &&
    isDeviceConfiguredBySSO;

  const { currentOrder } = ordersStoreRef;
  const orderProductsByStockId = groupBy(
    product => product.stockLocationId || '',
    currentOrder?.productList || [],
  );

  const [selectedStock, setSelectedStock] = useState<string | undefined>(
    undefined,
  );

  const onSelectProducts: (currentStockNames: string, stockId: string) => void =
    useCallback((currentStockNames: string, stockId: string) => {
      setSelectedStock(currentStockNames);
      selectedStockId.current = stockId;
    }, []);

  const initMasterLock = useCallback(async () => {
    if (!stocksStore.stocks.length) return;
    masterLockStore.initMasterLockForStocks(stocksStore.stocks);
  }, [stocksStore.stocks]);

  const fetchOrder = useCallback(async () => {
    setSelectedStock(undefined);
    setIsLoading(true);
    setIsError(false);
    await fetchStocks(stocksStore);
    const result = await fetchOrderDetails(route.params.orderId);
    if (result) {
      setIsError(true);
    } else if (stocksStore.stocks.length) {
      await initMasterLock();
    }
    setIsLoading(false);
  }, [initMasterLock, route.params.orderId]);

  useEffect(() => {
    if (isFocused) {
      fetchOrder();
    }
  }, [fetchOrder, isFocused]);

  const onNavigateToOrderByStockLocation = () => {
    if (selectedStock) {
      ordersStoreRef.setSelectedProductsByStock(selectedStock);

      if (navigateToUnlockScreen) {
        masterLockStore.unlock(controllerSerialNo);
        return navigation.navigate(AppNavigator.BaseUnlockScreen, {
          masterlockId: controllerSerialNo,
          nextScreen: AppNavigator.OrderByStockLocationScreen,
        });
      }
      navigation.navigate(AppNavigator.OrderByStockLocationScreen);
    }
  };

  const onNavigateToHome = () => {
    navigation.reset({
      routes: [{ name: AppNavigator.Drawer }],
    });
  };

  useEffect(() => {
    if (
      locationPermission !== RESULTS.GRANTED &&
      locationPermission !== RESULTS.DENIED &&
      isLocationPermissionRequested
    ) {
      showToast(t('locationPermissionsNotGranted'), {
        type: ToastType.LocationDisabled,
        onPress: () => {
          permissionStore.openSetting();
        },
      });
      return;
    }
    hideAll && hideAll();
  }, [
    hideAll,
    showToast,
    isLocationPermissionRequested,
    locationPermission,
    t,
  ]);

  const showLocationPermLoader =
    (locationPermission === RESULTS.UNAVAILABLE ||
      locationPermission === RESULTS.DENIED ||
      locationPermission === RESULTS.BLOCKED) &&
    !isLocationPermissionRequested;

  if (isLoading || showLocationPermLoader) {
    const requestPerm = async () => {
      await permissionStore.requestPermission(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );
      setIsLocationPermissionRequested(true);
    };
    requestPerm();
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.image}>
          <SVGs.JobListErrorIcon />
          <Text style={styles.text}>{t('sorryIssueLoadingOrders')}</Text>
        </View>
        <Button
          type={ButtonType.secondary}
          title={t('retry')}
          onPress={fetchOrder}
          buttonStyle={styles.button}
        />
      </View>
    );
  }

  if (currentOrder) {
    const OrderDetailsSubtitle = () => {
      switch (currentOrder.order.status) {
        case OrderTitleByStatusType[OrderStatusType.POREQUIRED]:
          return t('waitingForPoDistributor');
        case OrderTitleByStatusType[OrderStatusType.SUBMITTED]:
          return t('orderIsSubmitted');
        case OrderTitleByStatusType[OrderStatusType.SHIPPED]:
          return t('orderShippedToShop');
        case OrderTitleByStatusType[OrderStatusType.APPROVAL]:
          return t('beforeOrderReceivedManagerApproval');
        case OrderTitleByStatusType[OrderStatusType.CLOSED]:
          return t('orderClosed');
        case OrderTitleByStatusType[OrderStatusType.CANCELLED]:
          return t('orderCancelled');
        case OrderTitleByStatusType[OrderStatusType.RECEIVING]:
          return t('someItemsNotReceived');
        default:
          return null;
      }
    };

    const renderButton = () => {
      if (!userPermissions.receiveOrder) {
        return null;
      }

      switch (currentOrder.order.status) {
        case OrderTitleByStatusType[OrderStatusType.SUBMITTED]:
          return (
            <Button
              disabled={!selectedStock}
              type={ButtonType.primary}
              title={t('unlockAndReceive')}
              onPress={onNavigateToOrderByStockLocation}
            />
          );
        case OrderTitleByStatusType[OrderStatusType.SHIPPED]:
          return (
            <Button
              disabled={!selectedStock}
              type={ButtonType.primary}
              title={t('receive')}
              onPress={onNavigateToOrderByStockLocation}
            />
          );
        case OrderTitleByStatusType[OrderStatusType.RECEIVING]:
          return (
            <Button
              disabled={!selectedStock}
              type={ButtonType.primary}
              title={t('unlockAndReceive')}
              onPress={onNavigateToOrderByStockLocation}
            />
          );
        case OrderTitleByStatusType[OrderStatusType.POREQUIRED]:
        case OrderTitleByStatusType[OrderStatusType.APPROVAL]:
        case OrderTitleByStatusType[OrderStatusType.CLOSED]:
          return (
            <Button
              type={ButtonType.primary}
              title={t('home')}
              onPress={onNavigateToHome}
            />
          );
        case OrderTitleByStatusType[OrderStatusType.CANCELLED]:
        default:
          return null;
      }
    };

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.titleContainer,
            getBadgeStyleByStatusType(currentOrder.order.status),
          ]}
        >
          <StatusBadge orderStatusType={currentOrder.order.status} isString />
          <Text style={styles.headerSubtitle}>{OrderDetailsSubtitle()}</Text>
        </View>

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              {t('order')} {currentOrder.order.orderId}
            </Text>
            <Text style={styles.titleDistributor}>
              {currentOrder.order.supplierName}
            </Text>
          </View>
        </View>

        <View style={styles.stockHeader}>
          <Text style={styles.headerText}>{t('stockLocation')}</Text>
          <Text style={styles.headerText}>{t('receivedOrdered')}</Text>
        </View>
        <OrdersDetailsStockList
          productsByStockId={orderProductsByStockId}
          selectedStock={selectedStock}
          onSelectProducts={onSelectProducts}
          contentContainerStyle={styles.contentContainer}
        />
        {renderButton() ? (
          <View
            style={{
              backgroundColor: colors.white,
              padding: 16,
              marginTop: 'auto',
            }}
          >
            {renderButton()}
          </View>
        ) : null}
      </View>
    );
  }

  return null;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    fontFamily: fonts.TT_Bold,
    paddingBottom: 8,
  },
  titleDistributor: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    paddingBottom: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
  },
  headerSubtitle: {
    flex: 1,
    paddingLeft: 8,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    color: colors.grayDark2,
  },
  contentContainer: {
    backgroundColor: colors.white,
    paddingBottom: 8,
  },
  headerPlaceholder: {
    height: 26,
    width: '15%',
  },
  stockHeader: {
    paddingHorizontal: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.grayLight,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    borderTopColor: colors.gray,
    borderTopWidth: 1,
  },
  headerText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Bold,
    color: colors.grayDark2,
    paddingVertical: 4,
  },
  button: {
    marginHorizontal: 16,
    marginTop: 'auto',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.TT_Regular,
    paddingBottom: 3,
    paddingRight: 8,
    color: colors.purpleDark,
  },
  loading: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    paddingHorizontal: 76,
    paddingTop: 16,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Regular,
    color: colors.blackSemiLight,
    textAlign: 'center',
  },
});
