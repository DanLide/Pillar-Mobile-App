import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { observer } from 'mobx-react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useToast } from 'react-native-toast-notifications';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";


import { removeProductsStore, scanningProductStore } from './stores';

import { Button, ScanProduct, ToastMessage } from '../../components';
import { encode as btoa } from 'base-64';
import { ProductModal } from '../productModal';
import { fetchProduct } from '../../data/fetchProduct';
import { SelectedProductsList } from './SelectedProductsList';
import { ScanningProductModel } from './stores/ScanningProductStore';
import { AppNavigator } from '../../navigation';
import { onRemoveProducts } from '../../data/removeProducts';
import { ToastContextProvider, ToastType } from '../../contexts';
import { Utils } from '../../data/helpers/utils';
import { scanMelody } from '../../components/Sound';

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const hapticOptions = {
  enableVibrateFallback: true,
};

const TOAST_OFFSET_ABOVE_SINGLE_BUTTON = 62;

export const RemoveProductsScreen: React.FC<Props> = observer(
  ({ navigation }) => {
    const store = useRef(scanningProductStore).current;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<
      ScanningProductModel | undefined
    >(undefined);

    const [isScannerActive, setIsScannerActive] = useState(true);

    const [isScanner, setIsScanner] = useState(false);

    const toast = useToast();

    const fetchProductByCode = async (code: string) => {
      setIsLoading(true);
      const error = await fetchProduct(scanningProductStore, btoa(code));
      setIsLoading(false);

      if (error) {
        Alert.alert('Error', error.message || 'Loading is Failed!');
      } else {
        setSelectedProduct(store.getCurrentProduct);
      }
    };

    const turnOnScanner = () => {
      setIsScannerActive(true);
      setIsScanner(true);
    };

    const onPressScan = async () => {
      const result = await check(PERMISSIONS.IOS.CAMERA);
      if (result !== RESULTS.GRANTED) {
        navigation.navigate(AppNavigator.CameraPermissionScreen, {
          turnOnScanner,
        });
        return;
      }

      setIsScanner(true);
    };

    const onScanProduct = data => {
      setIsScannerActive(false);
      ReactNativeHapticFeedback.trigger('selection', hapticOptions)
      scanMelody.play()
      fetchProductByCode(data);
    };

    const onCompleteRemove = async () => {
      setIsLoading(true);
      await onRemoveProducts(removeProductsStore);
      setIsLoading(false);

      navigation.navigate(AppNavigator.ResultScreen);
    };

    const onCloseModal = () => {
      setSelectedProduct(undefined);
      setIsScanner(true);
      setIsScannerActive(true);
    };

    const onAddProductToRemoveList = useCallback(
      (product: ScanningProductModel) => {
        const { reservedCount, nameDetails } = product;

        removeProductsStore.addProduct(product);

        toast.show?.(
          <ToastMessage>
            <ToastMessage bold>{reservedCount}</ToastMessage>{' '}
            {reservedCount > 1 ? 'units' : 'unit'} of{' '}
            <ToastMessage bold>
              {Utils.truncateString(nameDetails)}
            </ToastMessage>{' '}
            added to List
          </ToastMessage>,
          { type: ToastType.Info },
        );
      },
      [toast],
    );

    return (
      <View style={styles.container}>
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
          </>
        )}
        <ProductModal
          product={selectedProduct}
          onAddProductToList={onAddProductToRemoveList}
          onClose={onCloseModal}
        />
      </View>
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

export default (props: Props) => (
  <ToastContextProvider offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}>
    <RemoveProductsScreen {...props} />
  </ToastContextProvider>
);
