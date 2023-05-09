import React, { useState, useRef } from 'react';
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
import { ProductModal } from './productModal';
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
    const store = useRef(scanningProductStore).current;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<
      ScanningProductModel | undefined
    >(undefined);

    const fetchProductByCode = async (code: string) => {
      setIsLoading(true);
      const error = await fetchProduct(scanningProductStore, code);
      setIsLoading(false);

      if (error) {
        Alert.alert('Error', error.message || 'Loading is Failed!');
      } else {
        setSelectedProduct(store.getCurrentProduct);
      }
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
      // TODO discuss with business how we should handle partly crashed requests
      if (error)
        return Alert.alert('Error', error.message || 'Removing is Failed!', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Retry',
            onPress: onCompleteRemove,
          },
        ]);

      navigation.navigate(AppNavigator.ResultScreen);
    };

    const onCloseModal = () => {
      setSelectedProduct(undefined);
    };

    const onAddProductToRemoveList = (product: ScanningProductModel) => {
      removeProductsStore.addProduct(product);
    };

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
          disabled={!Object.keys(removeProductsStore.getProducts).length}
          buttonStyle={styles.button}
          title="COMPLETE REMOVE"
          onPress={onCompleteRemove}
        />

        <ProductModal
          product={selectedProduct}
          onAddProductToList={onAddProductToRemoveList}
          onClose={onCloseModal}
        />
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
