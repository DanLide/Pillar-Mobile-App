import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { observer } from 'mobx-react';

import { productJobStore } from './stores';

import { Button } from '../../components';
import { ProductJobModal } from './ProductJobModal';
import { fetchProduct } from '../../data/fetchProduct';
import { SelectedProductsList } from './SelectedProductsList';

const { width, height } = Dimensions.get('window');

export const RemoveProductsScreen = observer(() => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const fetchProductByCode = async (code: string) => {
    setIsLoading(true);
    const error = await fetchProduct(productJobStore, code);
    setIsLoading(false);

    if (error)
      return Alert.alert('Error', error.message || 'Loading is Failed!');
  };

  const onScanProduct = () => {
    Alert.prompt('Product', 'Enter product code', (code: string) =>
      fetchProductByCode(code),
    );
  };

  const onCompleteRemove = () => {};

  const onCloseModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (productJobStore.currentProduct) {
      setIsModalVisible(true);
    }
  }, [productJobStore.currentProduct]);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="white"
            style={styles.activityIndicator}
          />
        </View>
      ) : null}
      <SelectedProductsList />

      <Button
        buttonStyle={styles.scanButton}
        textStyle={styles.scanButtonText}
        title="SCAN PRODUCT"
        onPress={onScanProduct}
      />
      <Button
        buttonStyle={styles.button}
        title="COMPLETE REMOVE"
        onPress={onCompleteRemove}
      />

      <ProductJobModal isVisible={isModalVisible} onClose={onCloseModal} />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  loader: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'gray',
    top: 0,
    zIndex: 100,
    opacity: 0.6,
  },
  activityIndicator: {
    marginTop: height / 2 - 150,
  },
  button: {
    margin: 12,
  },
  scanButton: {
    margin: 12,
    backgroundColor: 'transparent',
  },
  scanButtonText: {
    color: 'black',
  },
});
