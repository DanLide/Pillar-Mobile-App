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
import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { removeProductsStore, scanningProductStore } from './stores';

import { Button } from '../../components';
import { ProductModal } from '../productModal';
import { fetchProduct } from '../../data/fetchProduct';
import { SelectedProductsList } from './SelectedProductsList';
import { ScanningProductModel } from './stores/ScanningProductStore';
import { AppNavigator } from '../../navigation';
import { onRemoveProducts } from '../../data/removeProducts';

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

export const RemoveProductsScreen: React.FC<Props> = observer(
  ({ navigation }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const fetchProductByCode = async (code: string) => {
      setIsLoading(true);
      const error = await fetchProduct(scanningProductStore, code);
      setIsLoading(false);

      if (error)
        return Alert.alert('Error', error.message || 'Loading is Failed!');
    };

    const onScanProduct = () => {
      Alert.prompt('Product', 'Enter product code', (code: string) =>
        fetchProductByCode(code),
      );
    };

    const onCompleteRemove = async () => {
      setIsLoading(true);
      const error = await onRemoveProducts(removeProductsStore);
      setIsLoading(false);

      if (error)
        return Alert.alert('Error', error.message || 'Removing is Failed!');

      navigation.navigate(AppNavigator.ResultScreen);
    };

    const onCloseModal = () => {
      setIsModalVisible(false);
    };

    const onAddProductToRemoveList = (product: ScanningProductModel) => {
      removeProductsStore.addProduct(product);
    };

    useEffect(() => {
      if (scanningProductStore.currentProduct) {
        setIsModalVisible(true);
      }
    }, [scanningProductStore.currentProduct]);

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
          disabled={!Object.keys(removeProductsStore.products).length}
          buttonStyle={styles.button}
          title="COMPLETE REMOVE"
          onPress={onCompleteRemove}
        />

        {scanningProductStore.currentProduct ? (
          <ProductModal
            product={scanningProductStore.currentProduct}
            isVisible={isModalVisible}
            onAddProductToList={onAddProductToRemoveList}
            onClose={onCloseModal}
          />
        ) : null}
      </SafeAreaView>
    );
  },
);

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
