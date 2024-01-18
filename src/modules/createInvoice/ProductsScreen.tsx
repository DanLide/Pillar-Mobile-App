import React, { useCallback, useRef, useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import {
  BaseProductsScreen,
  BaseSelectedProductsList,
  Button,
  ButtonType,
} from '../../components';
import { BaseProductsScreenNavigationProp } from 'src/navigation/types';
import { createInvoiceStore, CreateInvoiceStore } from './stores';
import { ProductModalType } from '../productModal';
import { onCreateInvoice } from 'src/data/createInvoice';
import { fetchProductsByFacilityId } from 'src/data/fetchProductsByFacilityId';
import { SVGs, colors, fonts } from '../../theme';
import { useBaseProductsScreen, useCustomGoBack } from 'src/hooks';
import { observer } from 'mobx-react';
import EraseProductsAlert from 'src/modules/createInvoice/components/EraseProductsAlert';

interface Props {
  navigation: BaseProductsScreenNavigationProp;
}

export const ProductsScreen = observer(({ navigation }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [eraseProductsAlertVisible, setEraseProductsAlertVisible] =
    useState(false);

  const store = useRef<CreateInvoiceStore>(createInvoiceStore).current;
  const {
    modalParams,
    product,
    scannedProductsCount,
    onPressScan,
    onProductListItemPress,
    onSubmitProduct,
    setEditableProductQuantity,
    onRemoveProduct,
    onCloseModal,
  } = useBaseProductsScreen(store, navigation, ProductModalType.CreateInvoice);

  useCustomGoBack(
    event => {
      if (store.getNotSyncedProducts.length) {
        setEraseProductsAlertVisible(true);
        return;
      }

      navigation.dispatch(event.data.action);
    },
    undefined,
    [store.getNotSyncedProducts],
  );

  const onComplete = useCallback(() => {
    return onCreateInvoice(store);
  }, [store]);

  const fetchProducts = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);
    const result = await fetchProductsByFacilityId(createInvoiceStore);
    if (result) {
      setIsError(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.image}>
          <SVGs.JobListErrorIcon />
          <Text style={styles.text}>Sorry, there was an issue products</Text>
        </View>
        <Button
          type={ButtonType.secondary}
          title="Retry"
          onPress={fetchProducts}
          buttonStyle={styles.button}
        />
      </View>
    );
  }

  return (
    <>
      <BaseProductsScreen
        disableAlert
        modalParams={modalParams}
        product={product}
        scannedProductsCount={scannedProductsCount}
        onPressScan={onPressScan}
        onProductListItemPress={onProductListItemPress}
        onSubmitProduct={onSubmitProduct}
        setEditableProductQuantity={setEditableProductQuantity}
        onRemoveProduct={onRemoveProduct}
        onCloseModal={onCloseModal}
        infoTitle={store.currentJob?.jobNumber}
        navigation={navigation}
        store={store}
        onComplete={onComplete}
        tooltipTitle="Scan to add products to list"
        primaryButtonTitle="Submit"
        ListComponent={BaseSelectedProductsList}
      />

      <EraseProductsAlert
        visible={eraseProductsAlertVisible}
        onPressPrimary={() => {
          store.setProducts([]);
          setEraseProductsAlertVisible(false);
          onPressScan();
        }}
        onPressSecondary={() => {
          setEraseProductsAlertVisible(false);
        }}
      />
    </>
  );
});

const styles = StyleSheet.create({
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
  button: {
    marginHorizontal: 16,
    marginTop: 'auto',
    marginBottom: 16,
  },
});
