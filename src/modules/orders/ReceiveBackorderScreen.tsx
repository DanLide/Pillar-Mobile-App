import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ActivityIndicator,
  AppState,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { SvgProps } from 'react-native-svg';
import { find, whereEq } from 'ramda';

import {
  ButtonCluster,
  Dropdown,
  DropdownItem,
  InfoTitleBar,
  InfoTitleBarType,
  KeyboardToolButton,
} from 'src/components';
import { colors, SVGs } from '../../theme';
import { ordersStore } from './stores';
import { stocksStore } from '../stocksList/stores';
import {
  AppNavigator,
  BaseProductsScreenNavigationProp,
} from 'src/navigation/types';
import { ProductModal, ProductModalType } from 'src/modules/productModal';
import {
  useBaseProductsScreen,
  useSingleToast,
  useCustomGoBack,
} from 'src/hooks';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from 'src/contexts';
import { ToastType } from 'src/contexts/types';
import {
  AddNotesSection,
  SelectedProductsList,
  TotalCostBar,
} from './components';
import { fetchOrdersStocks } from 'src/data/fetchOrdersStocks';
import { receiveBackOrder } from 'src/data/receiveBackOrder';
import { OrderType } from 'src/constants/common.enum';
import permissionStore from '../permissions/stores/PermissionStore';
import { PERMISSIONS, RESULTS } from 'react-native-permissions';
import { KeyboardToolbar } from 'react-native-keyboard-controller';
import EraseProductsAlert from 'src/modules/createInvoice/components/EraseProductsAlert';

interface Props {
  navigation: BaseProductsScreenNavigationProp;
}

const SCAN_ICON_PROPS: SvgProps = {
  color: colors.purpleDark,
};

const ReceiveBackorderScreen = observer(({ navigation }: Props) => {
  const { t } = useTranslation();
  const [isCreateOrderLoading, setIsCreateOrderLoading] = useState(false);
  const { showToast, hideAll } = useSingleToast();
  const locationPermission = permissionStore.locationPermission;

  const {
    modalParams,
    scannedProductsCount,
    onPressScan,
    onProductListItemPress,
    onSubmitProduct,
    setEditableProductQuantity,
    onRemoveProduct,
    onCloseModal,
  } = useBaseProductsScreen(
    ordersStore,
    navigation,
    ProductModalType.ReceiveOrder,
    true,
  );
  const [isLocationPermissionRequested, setIsLocationPermissionRequested] =
    useState(false);
  const [eraseProductsAlertVisible, setEraseProductsAlertVisible] =
    useState(false);

  useCustomGoBack({
    callback: event => {
      if (ordersStore.getNotSyncedProducts.length) {
        setEraseProductsAlertVisible(true);
        return;
      }

      navigation.dispatch(event.data.action);
    },
    deps: [ordersStore.getNotSyncedProducts],
  });

  useEffect(() => {
    if (
      locationPermission !== RESULTS.GRANTED &&
      locationPermission !== RESULTS.DENIED &&
      isLocationPermissionRequested
    ) {
      showToast(t('locationPermissionsNotGranted'), {
        type: ToastType.BluetoothDisabled,
        onPress: () => {
          permissionStore.openSetting();
        },
      });
      return;
    }
    hideAll && hideAll();
  }, [
    showToast,
    locationPermission,
    isLocationPermissionRequested,
    hideAll,
    t,
  ]);

  useEffect(() => {
    ordersStore.clear();
    fetchOrdersStocks(stocksStore);
  }, []);

  useEffect(() => {
    const lister = AppState.addEventListener('change', state => {
      if (state === 'active') {
        setIsLocationPermissionRequested(false);
      }
    });
    return () => {
      lister.remove();
    };
  }, []);

  const supplier = useMemo<DropdownItem | undefined>(
    () =>
      find(
        whereEq({ value: ordersStore.supplierId }),
        stocksStore.suppliersRenderFormat,
      ),
    [ordersStore.supplierId, stocksStore.suppliersRenderFormat],
  );

  const openResultScreen = useCallback(
    () =>
      navigation.reset({
        index: 0,
        routes: [
          {
            name: AppNavigator.BackOrderResultScreen,
            state: { routes: [{ name: AppNavigator.HomeStack }] },
          },
        ],
      }),
    [navigation],
  );

  if (
    (locationPermission === RESULTS.UNAVAILABLE ||
      locationPermission === RESULTS.DENIED ||
      locationPermission === RESULTS.BLOCKED) &&
    !isLocationPermissionRequested
  ) {
    const requestPerm = async () => {
      await permissionStore.requestPermission(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );
      setIsLocationPermissionRequested(true);
    };
    requestPerm();
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const onReceiveOrder = async () => {
    setIsCreateOrderLoading(true);
    const error = await receiveBackOrder(ordersStore);

    setIsCreateOrderLoading(false);

    if (error)
      return showToast(t('orderWasntCreated'), { type: ToastType.Error });

    openResultScreen();
  };

  return (
    <View style={styles.container}>
      <InfoTitleBar
        type={InfoTitleBarType.Primary}
        title={ordersStore.currentStock?.organizationName}
      />
      <View style={styles.topContainer}>
        <Dropdown
          label={t('distributor')}
          placeholder={t('selectDistributor')}
          data={stocksStore.suppliersRenderFormat}
          selectedItem={supplier}
          onSelect={item => ordersStore.setSupplier(+item.value)}
        />
      </View>
      <AddNotesSection orderStore={ordersStore} />
      <View style={styles.productsContainer}>
        <SelectedProductsList
          onItemPress={onProductListItemPress}
          withStockLocation
          nextNavigationGoBack
        />
      </View>
      <TotalCostBar orderType={OrderType.Purchase} />
      <ButtonCluster
        leftTitle={t('scan')}
        leftOnPress={onPressScan}
        leftDisabled={!supplier}
        leftIcon={SVGs.ScanIcon}
        leftIconProps={SCAN_ICON_PROPS}
        rightTitle={t('receive')}
        rightOnPress={onReceiveOrder}
        rightDisabled={!scannedProductsCount}
        rightIsLoading={isCreateOrderLoading}
      />
      <ProductModal
        {...modalParams}
        product={ordersStore.getCurrentProduct}
        stockName={ordersStore.stockName}
        onSubmit={onSubmitProduct}
        onClose={onCloseModal}
        onRemove={onRemoveProduct}
        onChangeProductQuantity={setEditableProductQuantity}
      />
      <KeyboardToolbar button={KeyboardToolButton} showArrows={false} />
      <EraseProductsAlert
        visible={eraseProductsAlertVisible}
        onPressPrimary={() => {
          ordersStore.setProducts([]);
          ordersStore.setSupplier(undefined);
          setEraseProductsAlertVisible(false);
        }}
        onPressSecondary={() => {
          setEraseProductsAlertVisible(false);
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
  },
  productsContainer: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderColor: colors.neutral30,
    borderTopWidth: 1,
    flex: 1,
    justifyContent: 'space-between',
  },
  topContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
});

export default (props: Props) => (
  <ToastContextProvider
    disableSafeArea
    offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON * 2 - 12}
  >
    <ReceiveBackorderScreen {...props} />
  </ToastContextProvider>
);
