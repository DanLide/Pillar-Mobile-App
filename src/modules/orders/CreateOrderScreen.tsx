import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import { SvgProps } from 'react-native-svg';

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
import { SelectedProductsList } from './components/SelectedProductsList';
import { stocksStore } from '../stocksList/stores';
import { find, whereEq } from 'ramda';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
  AppNavigator,
  BaseProductsScreenNavigationProp,
} from 'src/navigation/types';
import {
  ProductModal,
  ProductModalParams,
  ProductModalType,
} from 'src/modules/productModal';
import { ProductModel } from 'src/stores/types';

const SCAN_ICON_PROPS: SvgProps = {
  color: colors.purpleDark,
};

const RECOMMENDED_PRODUCTS_ICON_PROPS: SvgProps = {
  color: colors.purpleDark,
};

interface Props {
  navigation: BaseProductsScreenNavigationProp;
}

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

export const CreateOrderScreen = observer(({ navigation }: Props) => {
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);

  const store = useRef(ordersStore).current;

  const scannedProductsCount = Object.keys(store.getProducts).length;

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

  const onPressScan = useCallback(async () => {
    const result = await check(PERMISSIONS.IOS.CAMERA);
    if (result !== RESULTS.GRANTED) {
      navigation.navigate(AppNavigator.CameraPermissionScreen, {
        nextRoute: AppNavigator.ScannerScreen,
      });
      return;
    }
    navigation.navigate(AppNavigator.ScannerScreen);
  }, [navigation]);

  const onEditProduct = useCallback(
    (product: ProductModel) => {
      store.setCurrentProduct(product);
      setModalParams({
        isEdit: true,
        maxValue: store.getEditableMaxValue(),
        onHand: store.getEditableOnHand(product),
        type: ProductModalType.CreateOrder,
      });
    },
    [store],
  );

  const onSubmitProduct = useCallback(
    (product: ProductModel) => store.updateProduct(product),
    [store],
  );

  const setEditableProductQuantity = useCallback(
    (quantity: number) => store.setEditableProductQuantity(quantity),
    [store],
  );

  const onRemoveProduct = useCallback(
    (product: ProductModel) => store.removeProduct(product),
    [store],
  );

  const onCloseModal = useCallback(() => setModalParams(initModalParams), []);

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
        <SelectedProductsList onItemPress={onEditProduct} />
        <Button
          type={ButtonType.primary}
          title="Add Items Below Inventory Minimum"
          icon={SVGs.ProductSmallIcon}
          iconProps={RECOMMENDED_PRODUCTS_ICON_PROPS}
          buttonStyle={styles.recommendedProductsButton}
          textStyle={styles.recommendedProductsButtonText}
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
          disabled={!scannedProductsCount}
          type={ButtonType.primary}
          buttonStyle={styles.buttonContainer}
          title="Send Order"
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
