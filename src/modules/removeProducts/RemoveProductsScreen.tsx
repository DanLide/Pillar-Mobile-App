import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { autorun } from 'mobx';

import { removeProductsStore } from './stores';
import {
  Button,
  ButtonType,
  InfoTitleBar,
  InfoTitleBarType,
  TooltipBar,
} from '../../components';
import {
  ProductModal,
  ProductModalParams,
  ProductModalType,
} from '../productModal';
import { SelectedProductsList } from './SelectedProductsList';
import { AppNavigator } from '../../navigation';
import { onRemoveProducts } from '../../data/removeProducts';
import { SVGs, colors } from '../../theme';

import AlertWrapper from '../../contexts/AlertWrapper';
import {
  CurrentProductStoreType,
  ScannerModalStoreType,
  ProductModel,
} from '../../stores/types';
const { width, height } = Dimensions.get('window');

interface Props {
  navigation: NavigationProp<ParamListBase>;
}
type Store = ScannerModalStoreType & CurrentProductStoreType;

const initModalParams: ProductModalParams = {
  type: ProductModalType.Hidden,
  maxValue: undefined,
};

const alertMessage =
  'If you change the stock location now, all products added to this list will be deleted. \n\n Are you sure you want to continue?';

const RemoveProductsScreen: React.FC<Props> = observer(({ navigation }) => {
  const store = useRef<Store>(removeProductsStore).current;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalParams, setModalParams] =
    useState<ProductModalParams>(initModalParams);

  const [alertVisible, setAlertVisible] = useState(false);
  const isNeedNavigateBack = useRef(false);

  useEffect(() => {
    autorun(() => {
      navigation.addListener('beforeRemove', e => {
        if (!removeProductsStore.getNotSyncedProducts.length) {
          return;
        }
        if (isNeedNavigateBack.current) {
          setAlertVisible(false);
          return;
        }
        e.preventDefault();
        setAlertVisible(true);
      });
    });
  }, [navigation, alertVisible]);

  const onPressScan = async () => {
    const result = await check(PERMISSIONS.IOS.CAMERA);
    if (result !== RESULTS.GRANTED) {
      navigation.navigate(AppNavigator.CameraPermissionScreen, {
        nextRoute: AppNavigator.RemoveProductScannerScreen,
      });
      return;
    }
    navigation.navigate(AppNavigator.RemoveProductScannerScreen);
  };

  const onCompleteRemove = async () => {
    setIsLoading(true);
    await onRemoveProducts(removeProductsStore);
    setIsLoading(false);

    isNeedNavigateBack.current = true;
    navigation.reset({
      index: 0,
      routes: [
        {
          name: AppNavigator.ResultScreen,
          state: { routes: [{ name: AppNavigator.HomeStack }] },
        },
      ],
    });
  };

  const onCloseModal = () => {
    setModalParams(initModalParams);
  };

  const onSubmitProduct = (product: ProductModel) => {
    store.updateProduct(product);
  };

  const setEditableProductQuantity = (quantity: number) => {
    store.setEditableProductQuantity(quantity);
  };

  const onEditProduct = (product: ProductModel) => {
    store.setCurrentProduct(product);
    setModalParams({
      type: ProductModalType.Edit,
      maxValue: store.getEditableMaxValue(product),
    });
  };

  const onRemoveProduct = (product: ProductModel) => {
    store.removeProduct(product);
  };

  const onPressPrimary = () => {
    isNeedNavigateBack.current = true;
    navigation.goBack();
  };

  const onPressSecondary = () => {
    setAlertVisible(false);
  };

  return (
    <AlertWrapper
      visible={alertVisible}
      message={alertMessage}
      title="Change Stock Location"
      onPressPrimary={onPressPrimary}
      onPressSecondary={onPressSecondary}
    >
      <View style={styles.container}>
        <InfoTitleBar
          type={InfoTitleBarType.Primary}
          title={removeProductsStore.currentStock?.organizationName}
        />
        <TooltipBar title="Scan to add products to list" />

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
              disabled={!Object.keys(store.getProducts).length}
              buttonStyle={styles.buttonContainer}
              title="Complete"
              onPress={onCompleteRemove}
            />
          </View>
        </>
        <ProductModal
          {...modalParams}
          product={store.getCurrentProduct}
          onSubmit={onSubmitProduct}
          onClose={onCloseModal}
          onRemove={onRemoveProduct}
          onChangeProductQuantity={setEditableProductQuantity}
        />
      </View>
    </AlertWrapper>
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
