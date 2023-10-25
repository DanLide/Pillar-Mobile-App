import React, { memo, useCallback, useRef, useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import {
  BaseProductsScreen,
  BaseSelectedProductsList,
  Button,
  ButtonType,
} from '../../components';
import { BaseProductsScreenNavigationProp } from '../../navigation/types';
import { createInvoiceStore, CreateInvoiceStore } from './stores';
import { ProductModalType } from '../productModal';
import { onCreateInvoice } from '../../data/createInvoice';
import { fetchProductsByFacilityId } from '../../data/fetchProductsByFacilityId';
import { SVGs, colors, fonts } from '../../theme';

interface Props {
  navigation: BaseProductsScreenNavigationProp;
}

export const ProductsScreen = memo(({ navigation }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const store = useRef<CreateInvoiceStore>(createInvoiceStore).current;

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
    <BaseProductsScreen
      disableAlert
      infoTitle={store.currentJob?.jobNumber}
      modalType={ProductModalType.CreateInvoice}
      navigation={navigation}
      store={store}
      onComplete={onComplete}
      tooltipTitle="Scan to add products to list"
      primaryButtonTitle="Submit"
      ListComponent={BaseSelectedProductsList}
    />
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
