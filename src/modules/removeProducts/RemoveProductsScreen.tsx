import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

import { removeProductsStore } from './stores';
import { Button, ButtonType } from '../../components';
import { ProductModal } from '../productModal';
import { SelectedProductsList } from './SelectedProductsList';
import { ScanningProductModel } from './stores/ScanningProductStore';
import { AppNavigator } from '../../navigation';
import { onRemoveProducts } from '../../data/removeProducts';
import { SVGs, colors } from '../../theme';
import { clone } from 'ramda';
import { RemoveProductModel } from './stores/RemoveProductsStore';
import { isRemoveProductModel } from './helpers';

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

const RemoveProductsScreen: React.FC<Props> = observer(({ navigation }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalParams, setModalParams] = useState<ModalParams>({
    product: undefined,
    type: undefined,
  });

  const onPressScan = async () => {
    const result = await check(PERMISSIONS.IOS.CAMERA);
    if (result !== RESULTS.GRANTED) {
      navigation.navigate(AppNavigator.CameraPermissionScreen, {
        nextRoute: AppNavigator.RemoveProductScannerScreen
      });
      return;
    }
    navigation.navigate(AppNavigator.RemoveProductScannerScreen);
  };

  const onCompleteRemove = async () => {
    setIsLoading(true);
    await onRemoveProducts(removeProductsStore);
    setIsLoading(false);

    navigation.navigate(AppNavigator.ResultScreen);
  };

  const onCloseModal = () => {
    setModalParams({
      type: undefined,
      product: undefined,
    });
  };

  const onSubmitProduct = (
    product: ScanningProductModel | RemoveProductModel,
  ) => {
    if (isRemoveProductModel(product))
      removeProductsStore.updateProduct(product);
  };

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
    <View style={styles.container}>
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
              <SVGs.CodeIcon color={colors.purple} width={32} height={23.33} />
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
      <ProductModal
        type={modalParams.type}
        product={modalParams.product}
        onSubmit={onSubmitProduct}
        onClose={onCloseModal}
        onRemove={onRemoveProduct}
      />
    </View>
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

export default RemoveProductsScreen;
