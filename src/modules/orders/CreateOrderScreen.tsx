import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import { SvgProps } from 'react-native-svg';

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
import { SelectedProductsList } from './components/SelectedProductsList';
import { stocksStore } from '../stocksList/stores';
import { find, whereEq } from 'ramda';
import {
  AppNavigator,
  BaseProductsScreenNavigationProp,
} from 'src/navigation/types';
import { ProductModal } from 'src/modules/productModal';
import { useBaseProductsScreen, useSingleToast } from 'src/hooks';
import { fetchSuggestedProducts } from 'src/data/fetchSuggestedProducts';
import {
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  ToastContextProvider,
} from 'src/contexts';
import { ToastType } from 'src/contexts/types';
import { getProductsReservedCount } from 'src/modules/orders/helpers';
import { createOrder } from 'src/data/createOrder';

interface Props {
  navigation: BaseProductsScreenNavigationProp;
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

const CreateOrderScreen = observer(({ navigation }: Props) => {
  const [isCreateOrderLoading, setIsCreateOrderLoading] = useState(false);
  const [isSuggestedProductsLoading, setIsSuggestedProductsLoading] =
    useState(false);

  const store = useRef(ordersStore).current;

  const {
    modalParams,
    scannedProductsCount,
    onPressScan,
    onEditProduct,
    onSubmitProduct,
    setEditableProductQuantity,
    onRemoveProduct,
    onCloseModal,
  } = useBaseProductsScreen(store, navigation);

  const { showToast } = useSingleToast();

  const suppliers = useMemo<DropdownItem[]>(
    () =>
      stocksStore.suppliers.map(item => ({
        label: item.name,
        value: item.partyRoleId,
      })),
    [],
  );

  const supplier = useMemo<DropdownItem | undefined>(
    () => find(whereEq({ value: store.supplierId }), suppliers),
    [store.supplierId, suppliers],
  );

  const addSuggestedItems = useCallback(async () => {
    const reservedCount = getProductsReservedCount(store.getProducts);

    setIsSuggestedProductsLoading(true);
    const error = await fetchSuggestedProducts(store);
    setIsSuggestedProductsLoading(false);

    if (error) {
      return showToast(suggestedItemsErrorText, {
        type: ToastType.SuggestedItemsError,
      });
    }

    const suggestedItemsAdded =
      getProductsReservedCount(store.getProducts) - reservedCount;

    showToast(
      <ToastMessage style={styles.toastSuccessMessage}>
        {suggestedItemsSuccessText(suggestedItemsAdded)}
      </ToastMessage>,
      { type: ToastType.SuggestedItemsSuccess },
    );
  }, [showToast, store]);

  const onCreateOrder = useCallback(async () => {
    setIsCreateOrderLoading(true);
    const error = await createOrder(store);
    setIsCreateOrderLoading(false);

    if (error) {
      Alert.alert("The order wasn't created. Please try again");
    } else {
      navigation.navigate(AppNavigator.ResultScreen);
    }
  }, [navigation, store]);

  return (
    <View style={styles.container}>
      <InfoTitleBar
        type={InfoTitleBarType.Primary}
        title={store.currentStock?.organizationName}
      />

      <View style={styles.topContainer}>
        <Dropdown
          label="Distributor"
          placeholder="Select a Distributor"
          data={suppliers}
          selectedItem={supplier}
          onSelect={item => store.setSupplier(+item.value)}
        />
      </View>

      <View style={styles.productsContainer}>
        <SelectedProductsList
          onItemPress={onEditProduct}
          isLoading={isSuggestedProductsLoading}
        />

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
      </View>

      <View style={styles.totalCostContainer}>
        <Text style={styles.totalCostText}>Total Cost: </Text>
        <Text style={styles.totalCostCount}>${store.getTotalCost}</Text>
      </View>

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
          title="Send Order"
          onPress={onCreateOrder}
        />
      </View>

      <ProductModal
        {...modalParams}
        product={store.getCurrentProduct}
        stockName={store.stockName}
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
  totalCostContainer: {
    alignItems: 'center',
    backgroundColor: colors.purpleDark2,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 48,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  totalCostText: {
    color: colors.white,
    fontFamily: fonts.TT_Bold,
    fontSize: 16,
    lineHeight: 20,
  },
  totalCostCount: {
    color: colors.white,
    fontFamily: fonts.TT_Bold,
    fontSize: 20,
    lineHeight: 24,
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
