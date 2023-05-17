import React, { useState, useRef, useCallback } from 'react';
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
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { removeProductsStore, scanningProductStore } from './stores';

import { Button, ButtonType, ScanProduct } from '../../components';
import { encode as btoa } from 'base-64';
import { ProductModal } from '../productModal';
import { fetchProduct } from '../../data/fetchProduct';
import { SelectedProductsList } from './SelectedProductsList';
import { ScanningProductModel } from './stores/ScanningProductStore';
import { AppNavigator } from '../../navigation';
import { onRemoveProducts } from '../../data/removeProducts';
import { SVGs, colors } from '../../theme';
import { clone } from 'ramda';
import { RemoveProductModel } from './stores/RemoveProductsStore';

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

export enum ModalType {
  Add,
  Edit,
}

interface ModalParams {
  type?: ModalType;
  product?: RemoveProductModel | ScanningProductModel;
}

export const RemoveProductsScreen: React.FC<Props> = observer(
  ({ navigation }) => {
    const store = useRef(scanningProductStore).current;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modalParams, setModalParams] = useState<ModalParams>({
      product: undefined,
      type: undefined,
    });

    const [isScannerActive, setIsScannerActive] = useState(true);

    const [isScanner, setIsScanner] = useState(false);

    const fetchProductByCode = async (code: string) => {
      setIsLoading(true);
      const error = await fetchProduct(scanningProductStore, btoa(code));
      setIsLoading(false);

      if (error) {
        Alert.alert('Error', error.message || 'Loading is Failed!');
      } else {
        setModalParams({
          type: ModalType.Add,
          product: store.getCurrentProduct,
        });
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
      setModalParams({
        type: undefined,
        product: undefined,
      });
      setIsScanner(false);
      setIsScannerActive(true);
    };

    const onSubmitProduct = useCallback(
      (product: ScanningProductModel | RemoveProductModel) => {
        switch (modalParams?.type) {
          case ModalType.Add:
            removeProductsStore.addProduct(product);
            break;
          case ModalType.Edit:
            removeProductsStore.updateProduct(product as RemoveProductModel);
            break;
          default:
            break;
        }
      },
      [modalParams?.type],
    );

    const onEditProduct = (product: RemoveProductModel) => {
      setModalParams({
        type: ModalType.Edit,
        product: clone(product),
      });
    };

    const onRemoveProduct = (product: RemoveProductModel) => {
      removeProductsStore.removeProduct(product);
    };

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
            <SelectedProductsList onEditProduct={onEditProduct} />

            <View style={styles.buttons}>
              <Button
                type={ButtonType.secondary}
                icon={
                  <SVGs.CodeIcon
                    color={colors.purple}
                    width={32}
                    height={23.33}
                  />
                }
                textStyle={styles.scanText}
                buttonStyle={styles.buttonContainer}
                title="Scan"
                onPress={onPressScan}
              />

              <Button
                type={ButtonType.primary}
                disabled={!Object.keys(removeProductsStore.getProducts).length}
                buttonStyle={styles.buttonContainer}
                title="Complete"
                onPress={onCompleteRemove}
              />
            </View>
          </>
        )}
        <ProductModal
          type={modalParams.type}
          product={modalParams.product}
          onSubmit={onSubmitProduct}
          onClose={onCloseModal}
          onRemove={onRemoveProduct}
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.white,
  },
  scanText: {
    paddingLeft: 8,
  },
  buttonContainer: {
    width: 163.5,
    height: 48,
  },
});
