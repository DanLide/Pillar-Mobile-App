import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import { SvgProps } from 'react-native-svg';
import { find, whereEq } from 'ramda';
import { RouteProp } from '@react-navigation/native';

import {
  ButtonType,
  Dropdown,
  DropdownItem,
  InfoTitleBar,
  InfoTitleBarType,
  ToastMessage,
} from 'src/components';
import Button from '../../components/Button';
import { colors, fonts, SVGs } from '../../theme';
import { ordersStore } from './stores';
import { stocksStore } from '../stocksList/stores';
import {
  AppNavigator,
  BaseProductsScreenNavigationProp,
  OrdersParamsList,
} from 'src/navigation/types';
import { ProductModal, ProductModalType } from 'src/modules/productModal';
import { useBaseProductsScreen, useSingleToast } from 'src/hooks';
import { fetchSuggestedProducts } from 'src/data/fetchSuggestedProducts';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from 'src/contexts';
import { ToastType } from 'src/contexts/types';
import { getProductsReservedCount } from 'src/modules/orders/helpers';
import { createOrder } from 'src/data/createOrder';
import {
  PONumberModal,
  SelectedProductsList,
  TotalCostBar,
} from './components';
import { OrderStatusType, OrderType } from 'src/constants/common.enum';
import { updatePONumber } from 'src/data/updatePONumber';

interface Props {
  navigation: BaseProductsScreenNavigationProp;
  route: RouteProp<OrdersParamsList, AppNavigator.CreateOrderScreen>;
}

const SCAN_ICON_PROPS: SvgProps = {
  color: colors.purpleDark,
};

const RECOMMENDED_PRODUCTS_ICON_PROPS: SvgProps = {
  color: colors.purpleDark,
};

const suggestedItemsSuccessText = (count: number) =>
  `${count} Recommended items added`;

const suggestedItemsErrorText =
  "Recommended items weren't loaded. Please try again";

const createOrderErrorText = "The order wasn't created. Please try again.";

const CreateOrderScreen = observer(
  ({ navigation, route: { params } }: Props) => {
    const [isPONumberModalVisible, setIsPONumberModalVisible] = useState(false);

    const [isCreateOrderLoading, setIsCreateOrderLoading] = useState(false);
    const [isSuggestedProductsLoading, setIsSuggestedProductsLoading] =
      useState(false);

    const ordersStoreRef = useRef(ordersStore).current;

    const orderType = params?.orderType;

    const isPurchaseOrder = orderType === OrderType.Purchase;

    const modalType =
      orderType === OrderType.Purchase
        ? ProductModalType.CreateOrder
        : ProductModalType.ReturnOrder;

    const {
      modalParams,
      scannedProductsCount,
      onPressScan,
      onEditProduct,
      onSubmitProduct,
      setEditableProductQuantity,
      onRemoveProduct,
      onCloseModal,
    } = useBaseProductsScreen(ordersStoreRef, navigation, modalType);

    const { showToast } = useSingleToast();

    const submitButtonTitle = isPurchaseOrder ? 'Send Order' : 'Complete';

    const suppliers = useMemo<DropdownItem[]>(
      () =>
        stocksStore.suppliers.map(item => ({
          label: item.name,
          value: item.partyRoleId,
        })),
      [],
    );

    const supplier = useMemo<DropdownItem | undefined>(
      () => find(whereEq({ value: ordersStoreRef.supplierId }), suppliers),
      [ordersStoreRef.supplierId, suppliers],
    );

    const addSuggestedItems = useCallback(async () => {
      const reservedCount = getProductsReservedCount(
        ordersStoreRef.getProducts,
      );

      setIsSuggestedProductsLoading(true);
      const error = await fetchSuggestedProducts(ordersStoreRef);
      setIsSuggestedProductsLoading(false);

      if (error) {
        return showToast(suggestedItemsErrorText, {
          type: ToastType.SuggestedItemsError,
        });
      }

      const suggestedItemsAdded =
        getProductsReservedCount(ordersStoreRef.getProducts) - reservedCount;

      showToast(
        <ToastMessage style={styles.toastSuccessMessage}>
          {suggestedItemsSuccessText(suggestedItemsAdded)}
        </ToastMessage>,
        { type: ToastType.SuggestedItemsSuccess },
      );
    }, [showToast, ordersStoreRef]);

    const openResultScreen = useCallback(
      () =>
        navigation.reset({
          index: 0,
          routes: [
            {
              name: AppNavigator.CreateOrderResultScreen,
              params: { orderType },
              state: { routes: [{ name: AppNavigator.HomeStack }] },
            },
          ],
        }),
      [navigation, orderType],
    );

    const onCreateOrder = useCallback(async () => {
      setIsCreateOrderLoading(true);
      const error = await createOrder(ordersStoreRef, orderType);
      setIsCreateOrderLoading(false);

      if (error)
        return showToast(createOrderErrorText, { type: ToastType.Error });

      const order = ordersStoreRef.currentOrder?.order;

      if (order?.status === OrderStatusType.POREQUIRED)
        return setIsPONumberModalVisible(true);

      openResultScreen();
    }, [ordersStoreRef, orderType, showToast, openResultScreen]);

    const onSubmitPONumber = useCallback(
      async (poNumber: string) => {
        await updatePONumber(poNumber, ordersStoreRef);
        openResultScreen();
      },
      [openResultScreen, ordersStoreRef],
    );

    return (
      <View style={styles.container}>
        <InfoTitleBar
          type={InfoTitleBarType.Primary}
          title={ordersStoreRef.currentStock?.organizationName}
        />

        <View style={styles.topContainer}>
          <Dropdown
            label="Distributor"
            placeholder="Select a Distributor"
            data={suppliers}
            selectedItem={supplier}
            onSelect={item => ordersStoreRef.setSupplier(+item.value)}
          />
        </View>

        <View style={styles.productsContainer}>
          <SelectedProductsList
            onItemPress={onEditProduct}
            isLoading={isSuggestedProductsLoading}
          />

          {isPurchaseOrder && (
            <Button
              disabled={!supplier || isSuggestedProductsLoading}
              type={ButtonType.primary}
              title="Add Items Below Inventory Minimum"
              icon={SVGs.ProductSmallIcon}
              iconProps={RECOMMENDED_PRODUCTS_ICON_PROPS}
              buttonStyle={styles.recommendedProductsButton}
              textStyle={styles.recommendedProductsButtonText}
              onPress={addSuggestedItems}
            />
          )}
        </View>

        <TotalCostBar orderType={orderType} />

        <View style={styles.buttons}>
          <Button
            type={ButtonType.secondary}
            icon={SVGs.ScanIcon}
            iconProps={SCAN_ICON_PROPS}
            textStyle={styles.scanText}
            buttonStyle={styles.buttonContainer}
            title="Scan"
            onPress={onPressScan}
          />
          <Button
            disabled={!scannedProductsCount || isSuggestedProductsLoading}
            isLoading={isCreateOrderLoading}
            type={ButtonType.primary}
            buttonStyle={styles.buttonContainer}
            title={submitButtonTitle}
            onPress={onCreateOrder}
          />
        </View>

        <ProductModal
          {...modalParams}
          product={ordersStoreRef.getCurrentProduct}
          stockName={ordersStoreRef.stockName}
          onSubmit={onSubmitProduct}
          onClose={onCloseModal}
          onRemove={onRemoveProduct}
          onChangeProductQuantity={setEditableProductQuantity}
        />

        <PONumberModal
          isVisible={isPONumberModalVisible}
          title={ordersStoreRef.stockName}
          onSkip={openResultScreen}
          onSubmit={onSubmitPONumber}
        />
      </View>
    );
  },
);

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
});

export default (props: Props) => (
  <ToastContextProvider
    disableSafeArea
    offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON * 2 - 12}
  >
    <CreateOrderScreen {...props} />
  </ToastContextProvider>
);
