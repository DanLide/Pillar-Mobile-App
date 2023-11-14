import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  AppState,
} from 'react-native';
import { observer } from 'mobx-react';
import { SvgProps } from 'react-native-svg';
import { find, whereEq } from 'ramda';

import {
  ButtonType,
  Dropdown,
  DropdownItem,
  InfoTitleBar,
  InfoTitleBarType,
} from 'src/components';
import Button from '../../components/Button';
import { colors, fonts, SVGs } from '../../theme';
import { ordersStore } from './stores';
import { stocksStore } from '../stocksList/stores';
import {
  AppNavigator,
  BaseProductsScreenNavigationProp,
} from 'src/navigation/types';
import { ProductModal, ProductModalType } from 'src/modules/productModal';
import { useBaseProductsScreen, useSingleToast } from 'src/hooks';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from 'src/contexts';
import { ToastType } from 'src/contexts/types';
import { SelectedProductsList, TotalCostBar } from './components';
import { fetchOrdersStocks } from 'src/data/fetchOrdersStocks';
import { receiveBackOrder } from 'src/data/receiveBackOrder';
import { OrderType } from 'src/constants/common.enum';
import permissionStore from '../permissions/stores/PermissionStore';
import { PERMISSIONS, RESULTS } from 'react-native-permissions';

interface Props {
  navigation: BaseProductsScreenNavigationProp;
}

const SCAN_ICON_PROPS: SvgProps = {
  color: colors.purpleDark,
};

const createOrderErrorText = "The order wasn't created. Please try again.";

const ReceiveBackorderScreen = observer(({ navigation }: Props) => {
  const [isCreateOrderLoading, setIsCreateOrderLoading] = useState(false);
  const { showToast, hideAll } = useSingleToast();
  const locationPermission = permissionStore.locationPermission;

  const {
    modalParams,
    scannedProductsCount,
    onPressScan,
    onEditProduct,
    onSubmitProduct,
    setEditableProductQuantity,
    onRemoveProduct,
    onCloseModal,
  } = useBaseProductsScreen(ordersStore, navigation, ProductModalType.ReceiveOrder, true);
  const [isLocationPermissionRequested, setIsLocationPermissionRequested] = useState(false);

  useEffect(() => {
    if (
      locationPermission !== RESULTS.GRANTED &&
      locationPermission !== RESULTS.DENIED &&
      isLocationPermissionRequested
    ) {
      showToast('Location permissions not granted', {
        type: ToastType.BluetoothDisabled,
        onPress: () => {
          permissionStore.openSetting();
        },
      });
      return;
    }
    hideAll();
  }, [
    showToast,
    locationPermission,
    isLocationPermissionRequested,
    hideAll,
  ]);

  useEffect(() => {
    fetchOrdersStocks(stocksStore)
  }, [])

  useEffect(() => {
    const lister = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setIsLocationPermissionRequested(false);
      }
    });
    return () => {
      lister.remove()
    }
  }, []);

  const supplier = useMemo<DropdownItem | undefined>(
    () => find(whereEq({ value: ordersStore.supplierId }), stocksStore.suppliersRenderFormat),
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

  if ((
    locationPermission === RESULTS.UNAVAILABLE ||
    locationPermission === RESULTS.DENIED ||
    locationPermission === RESULTS.BLOCKED
  ) && !isLocationPermissionRequested) {
    const requestPerm = async () => {
      await permissionStore.requestPermission(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      setIsLocationPermissionRequested(true);
    }
    requestPerm();
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size='large' />
      </SafeAreaView>
    )
  }

  const onReceiveOrder = async () => {
    setIsCreateOrderLoading(true);
    const error = await receiveBackOrder(ordersStore);

    setIsCreateOrderLoading(false);

    if (error)
      return showToast(createOrderErrorText, { type: ToastType.Error });

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
          label="Distributor"
          placeholder="Select a Distributor"
          data={stocksStore.suppliersRenderFormat}
          selectedItem={supplier}
          onSelect={item => ordersStore.setSupplier(+item.value)}
        />
      </View>

      <TouchableOpacity style={styles.noteContainer}>
        <SVGs.InvoiceIcon />
        <Text style={styles.noteText}>
          Add Notes
        </Text>
      </TouchableOpacity>

      <View style={styles.productsContainer}>
        <SelectedProductsList
          onItemPress={onEditProduct}
          withStockLocation
          nextNavigationGoBack
        />
      </View>

      <TotalCostBar orderType={OrderType.Purchase} />

      <View style={styles.buttons}>
        <Button
          type={ButtonType.secondary}
          icon={SVGs.ScanIcon}
          iconProps={SCAN_ICON_PROPS}
          textStyle={styles.scanText}
          buttonStyle={styles.buttonContainer}
          title="Scan"
          onPress={onPressScan}
          disabled={!supplier}
        />
        <Button
          disabled={!scannedProductsCount}
          isLoading={isCreateOrderLoading}
          type={ButtonType.primary}
          buttonStyle={styles.buttonContainer}
          title="Receive"
          onPress={onReceiveOrder}
        />
      </View>

      <ProductModal
        {...modalParams}
        product={ordersStore.getCurrentProduct}
        stockName={ordersStore.stockName}
        onSubmit={onSubmitProduct}
        onClose={onCloseModal}
        onRemove={onRemoveProduct}
        onChangeProductQuantity={setEditableProductQuantity}
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    padding: 16,
    backgroundColor: colors.white,
  },
  scanText: {
    paddingLeft: 8,
  },
  buttonContainer: {
    flex: 1,
    height: 48,
  },
  productsContainer: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderColor: colors.neutral30,
    borderTopWidth: 1,
    flex: 1,
    justifyContent: 'space-between',
  },
  recommendedProductsButton: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  recommendedProductsButtonText: {
    color: colors.purpleDark3,
    fontFamily: fonts.TT_Bold,
    fontSize: 13,
    lineHeight: 18,
  },
  toastSuccessMessage: {
    textAlign: 'left',
  },
  topContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  noteContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  noteText: {
    color: colors.purpleDark3,
    fontFamily: fonts.TT_Bold,
    fontSize: 16,
    lineHeight: 20,
    alignSelf: 'center',
    marginLeft: 8,
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
