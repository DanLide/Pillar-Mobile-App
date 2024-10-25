import { useCallback, useMemo, useRef, useState } from 'react';

import { observer } from 'mobx-react';
import { SvgProps } from 'react-native-svg';
import { find, whereEq } from 'ramda';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import {
  ButtonCluster,
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
import { ProductModalType } from 'src/modules/productModal';
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
  ProductModal,
  SelectedProductsList,
  TotalCostBar,
} from './components';
import { OrderStatusType, OrderType } from 'src/constants/common.enum';
import { updatePONumber } from 'src/data/updatePONumber';
import { StyleSheet, View } from 'react-native';
import { KeyboardToolbar } from 'react-native-keyboard-controller';
import { useModal } from 'react-native-modalfy';
import { IModalStackParamsList } from 'src/types';

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
    const { openModal } = useModal<IModalStackParamsList>();
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
          openModal('EraseProductModal', {
            onAction: () => {
              ordersStoreRef.setProducts([]);
              ordersStoreRef.setSupplier(undefined);
            },
          });
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
          <AddNotesSection orderStore={ordersStoreRef} />
        </View>

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

        <ButtonCluster
          leftTitle={t('scan')}
          leftType={ButtonType.secondary}
          leftIcon={SVGs.ScanIcon}
          leftIconProps={SCAN_ICON_PROPS}
          leftOnPress={onPressScan}
          rightTitle={submitButtonTitle}
          rightDisabled={!scannedProductsCount || isSuggestedProductsLoading}
          rightIsLoading={isCreateOrderLoading}
          rightType={ButtonType.primary}
          rightOnPress={onCreateOrder}
        />

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
    fontSize: 12,
    lineHeight: 18,
  },
  toastSuccessMessage: {
    textAlign: 'left',
  },
  topContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 8,
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
