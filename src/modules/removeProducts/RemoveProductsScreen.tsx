import React, { useState, useEffect, useRef } from 'react';
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

import { Button, ScanProduct } from '../../components';
import { encode as btoa } from 'base-64';
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
    const store = useRef(scanningProductStore).current;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const [isScannerActive, setIsScannerActive] = useState(true);

    const [isScanner, setIsScanner] = useState(false);

    const fetchProductByCode = async (code: string) => {
      setIsLoading(true);
      const error = await fetchProduct(scanningProductStore, btoa(code));
      setIsLoading(false);

      if (error)
        return Alert.alert('Error', error.message || 'Loading is Failed!');
    };

    const onPressScan = () => {
      setIsScanner(true);
    };
    const onScanProduct = data => {
      setIsScannerActive(false);
      fetchProductByCode(data);
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
      setIsModalVisible(false);
      setIsScanner(false);
      setIsScannerActive(true);
    };

    const onAddProductToRemoveList = (product: ScanningProductModel) => {
      removeProductsStore.addProduct(product);
    };

    useEffect(() => {
      if (store.getCurrentProduct) {
        setIsScanner(false);
        setIsModalVisible(true);
      }
    }, [store.getCurrentProduct]);

    return (
      <SafeAreaView style={styles.container}>
        {isScanner ? (
          <ScanProduct onPressScan={onScanProduct} isActive={isScannerActive} />
        ) : (
          <>
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
              onPress={onPressScan}
            />
            <Button
              disabled={!Object.keys(removeProductsStore.getProducts).length}
              buttonStyle={styles.button}
              title="COMPLETE REMOVE"
              onPress={onCompleteRemove}
            />
            <ProductModal
              isVisible={isModalVisible}
              onAddProductToList={onAddProductToRemoveList}
              onClose={onCloseModal}
            />
          </>
        )}
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
