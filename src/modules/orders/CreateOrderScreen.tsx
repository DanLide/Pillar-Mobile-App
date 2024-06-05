import { useCallback, useMemo, useRef, useState } from 'react';

import { observer } from 'mobx-react';
import { SvgProps } from 'react-native-svg';
import { find, whereEq } from 'ramda';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import {
  ButtonType,
  Dropdown,
  DropdownItem,
  InfoTitleBar,
  InfoTitleBarType,
  KeyboardToolButton,
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
import {
  useBaseProductsScreen,
  useSingleToast,
  useCustomGoBack,
} from 'src/hooks';
import { fetchSuggestedProducts } from 'src/data/fetchSuggestedProducts';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from 'src/contexts';
import { ToastType } from 'src/contexts/types';
import { getProductsReservedCount } from 'src/modules/orders/helpers';
import { createOrder } from 'src/data/createOrder';
import {
  AddNotesSection,
  PONumberModal,
  SelectedProductsList,
  TotalCostBar,
} from './components';
import { OrderStatusType, OrderType } from 'src/constants/common.enum';
import { updatePONumber } from 'src/data/updatePONumber';
import { StyleSheet, View } from 'react-native';
import { KeyboardToolbar } from 'react-native-keyboard-controller';
import EraseProductsAlert from 'src/modules/createInvoice/components/EraseProductsAlert';

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

const CreateOrderScreen = observer(
  ({ navigation, route: { params } }: Props) => {
    const { t } = useTranslation();
    const [isPONumberModalVisible, setIsPONumberModalVisible] = useState(false);

    const [isCreateOrderLoading, setIsCreateOrderLoading] = useState(false);
    const [isSuggestedProductsLoading, setIsSuggestedProductsLoading] =
      useState(false);
    const [eraseProductsAlertVisible, setEraseProductsAlertVisible] =
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
      onProductListItemPress,
      onSubmitProduct,
      setEditableProductQuantity,
      onRemoveProduct,
      onCloseModal,
    } = useBaseProductsScreen(ordersStoreRef, navigation, modalType);

    const { showToast } = useSingleToast();

    const submitButtonTitle = isPurchaseOrder ? t('sendOrder') : t('complete');

    const suppliers = useMemo<DropdownItem[]>(
      () =>
        stocksStore.suppliers.map(item => ({
          label: item.name,
          value: item.partyRoleId,
        })),
      [],
    );

    useCustomGoBack({
      callback: event => {
        if (ordersStoreRef.getNotSyncedProducts.length) {
          setEraseProductsAlertVisible(true);
          return;
        }

        navigation.dispatch(event.data.action);
      },
      deps: [ordersStoreRef.getNotSyncedProducts],
    });

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
        return showToast(t('recommendedItemsWerentLoaded'), {
          type: ToastType.SuggestedItemsError,
        });
      }

      const suggestedItemsAdded =
        getProductsReservedCount(ordersStoreRef.getProducts) - reservedCount;

      showToast(
        <ToastMessage style={styles.toastSuccessMessage}>
          {t('recommendedItemsAdded', { count: suggestedItemsAdded })}
        </ToastMessage>,
        { type: ToastType.SuggestedItemsSuccess },
      );
    }, [showToast, ordersStoreRef, t]);

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
        return showToast(t('orderWasntCreated'), { type: ToastType.Error });

      const order = ordersStoreRef.currentOrder?.order;

      if (order?.status === OrderStatusType.POREQUIRED)
        return setIsPONumberModalVisible(true);

      openResultScreen();
    }, [ordersStoreRef, orderType, showToast, openResultScreen, t]);

    const onSubmitPONumber = useCallback(
      async (poNumber: string) => {
        await updatePONumber(poNumber, ordersStoreRef);
        openResultScreen();
      },
      [openResultScreen, ordersStoreRef],
    );

    const isDropdownDisabled = useMemo(() => {
      if (modalType !== ProductModalType.CreateOrder) {
        return;
      }

      const products = ordersStore.getNotSyncedProducts;
      // Disabled when there are products
      return products.length !== 0;
    }, [modalType, ordersStore.getNotSyncedProducts]);

    return (
      <View style={styles.container}>
        <InfoTitleBar
          type={InfoTitleBarType.Primary}
          title={ordersStoreRef.currentStock?.organizationName}
        />

        <View style={styles.topContainer}>
          <Dropdown
            label={t('distributor')}
            placeholder={t('selectDistributor')}
            data={suppliers}
            selectedItem={supplier}
            onSelect={item => ordersStoreRef.setSupplier(+item.value)}
            disabled={isDropdownDisabled}
          />
        </View>
        <AddNotesSection orderStore={ordersStoreRef} />
        <View style={styles.productsContainer}>
          <SelectedProductsList
            onItemPress={onProductListItemPress}
            isLoading={isSuggestedProductsLoading}
          />

          {isPurchaseOrder && (
            <Button
              disabled={!supplier || isSuggestedProductsLoading}
              type={ButtonType.primary}
              title={t('addItemsBelowInventoryMinimum')}
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
            title={t('scan')}
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
        <KeyboardToolbar button={KeyboardToolButton} showArrows={false} />
        <EraseProductsAlert
          visible={eraseProductsAlertVisible}
          onPressPrimary={() => {
            ordersStoreRef.setProducts([]);
            ordersStoreRef.setSupplier(undefined);
            setEraseProductsAlertVisible(false);
          }}
          onPressSecondary={() => {
            setEraseProductsAlertVisible(false);
          }}
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
    paddingTop: 24,
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
