import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// eslint-disable-next-line import/default
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated';
import { observer } from 'mobx-react';

import {
  Button,
  ButtonType,
  InfoTitleBar,
  InfoTitleBarType,
  Modal,
} from '../../../components';
import {
  Description,
  ProductModalProps,
  ProductModalType,
  ProductQuantity,
  QUANTITY_PICKER_HEIGHT,
} from '../../productModal';

import { colors, fonts } from 'src/theme';
import { ToastContextProvider } from 'src/contexts';
import { EditProduct } from './EditProduct';
import { manageProductsStore } from '../stores';
import { permissionProvider } from 'src/data/providers';
import { ViewProduct } from './ViewProduct';
import { ToastType } from 'src/contexts/types';
import AlertWrapper from 'src/contexts/AlertWrapper';
import { InventoryUseType } from 'src/constants/common.enum';

export enum ProductModalErrors {
  UpcUpdateError = 'UpcUpdateError',
  UpcLengthError = 'UpcLengthError',
  UpcFormatError = 'UpcFormatError',
}

enum ScrollDirection {
  Down,
  Up,
}

const SCROLL_ANIMATION_CONFIG: WithSpringConfig = {
  damping: 500,
  stiffness: 1000,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 10,
  restSpeedThreshold: 10,
};

const getErrorMessage = (error: unknown) => {
  switch (error) {
    case ProductModalErrors.UpcFormatError:
      return 'Invalid UPC Code';
    case ProductModalErrors.UpcLengthError:
      return 'UPC length should be 12 or 13 digits long';
  }
};

interface AlertParams {
  isVisible: boolean;
  shouldCloseModal: boolean;
}

const INIT_ALERT_PARAMS: AlertParams = {
  isVisible: false,
  shouldCloseModal: false,
};

const alertMessage =
  'Are you sure you want to exit without saving? Your edits will not be saved.';

export const ProductModal = observer(
  ({
    product,
    onHand,
    maxValue,
    type,
    stockName,
    toastType,
    isEdit,
    onSubmit,
    onEditPress,
    onCancelPress,
    onClose,
  }: ProductModalProps) => {
    const store = useRef(manageProductsStore).current;
    const scrollViewRef = useRef<Animated.ScrollView>(null);
    const reservedCountInputRef = useRef<TextInput>(null);
    const unitsPerContainerInputRef = useRef<TextInput>(null);
    const viewRef = useRef<View>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isUnitsPerContainerError, setIsUnitsPerContainerError] =
      useState(false);
    const [upcError, setUpcError] = useState<string | undefined>();
    const [alertParams, setAlertParams] =
      useState<AlertParams>(INIT_ALERT_PARAMS);

    const modalCollapsedOffset = useHeaderHeight();
    const { top: modalExpandedOffset } = useSafeAreaInsets();

    const { userPermissions } = permissionProvider

    const topOffset = useSharedValue(modalCollapsedOffset);

    const isOnOrder = (product?.onOrder ?? 0) > 0;
    const isSpecialOrder =
      product?.inventoryUseTypeId === InventoryUseType.NonStock;

    const onOrderTitle = useMemo(
      () => (
        <Text style={styles.onOrderTitle}>
          <Text style={styles.onOrderTitleBold}>On Order.</Text> Some settings
          cannot be changed
        </Text>
      ),
      [],
    );

    const scrollTo = useCallback(
      (destination: number) => {
        'worklet';
        topOffset.value = withSpring(destination, SCROLL_ANIMATION_CONFIG);
      },
      [topOffset],
    );

    const clearProductModalStoreOnClose = useCallback(() => {
      setAlertParams(INIT_ALERT_PARAMS);
      setUpcError(undefined);
      scrollViewRef.current?.scrollTo({ y: 0 });

      setTimeout(() => onClose());
    }, [onClose]);

    const handleModalClose = useCallback(() => {
      if (store.isProductChanged) {
        setAlertParams({ isVisible: true, shouldCloseModal: true });
        return;
      }

      clearProductModalStoreOnClose();
    }, [clearProductModalStoreOnClose, store.isProductChanged]);

    const handleError = useCallback((error: unknown) => {
      switch (error) {
        case ProductModalErrors.UpcFormatError:
        case ProductModalErrors.UpcLengthError:
        case ProductModalErrors.UpcUpdateError:
          setUpcError(getErrorMessage(error));
          scrollViewRef.current?.scrollToEnd({ animated: true });
          break;
      }
    }, []);

    const handleCancel = useCallback(() => {
      setUpcError(undefined);
      onCancelPress?.();
    }, [onCancelPress]);

    const handleSubmit = useCallback(async () => {
      if (!product) return;

      const isEachPeace = product?.inventoryUseTypeId === InventoryUseType.Each;
      const viewRefInstance = viewRef.current;

      if (isEachPeace && !product.unitsPerContainer && viewRefInstance) {
        const y = await new Promise<number>(resolve =>
          unitsPerContainerInputRef.current?.measureLayout(
            viewRefInstance,
            (x, y) => resolve(y - QUANTITY_PICKER_HEIGHT),
          ),
        );
        setIsUnitsPerContainerError(true);
        onSubmit(product, ToastType.UnitsPerContainerError);

        scrollViewRef.current?.scrollTo({ y, animated: true });
        return;
      }

      setIsLoading(true);
      const error = await onSubmit(product);
      setIsLoading(false);

      if (error) return handleError(error);

      if (isEdit) handleCancel();
      else clearProductModalStoreOnClose();
    }, [
      clearProductModalStoreOnClose,
      handleCancel,
      handleError,
      isEdit,
      onSubmit,
      product,
    ]);

    const handleToastAction = useCallback(() => {
      switch (toastType) {
        case ToastType.ProductUpdateError:
          return handleSubmit();
        case ToastType.UpcUpdateError:
          onEditPress?.();
          break;
        case ToastType.UnitsPerContainerError:
          unitsPerContainerInputRef.current?.focus();
          break;
      }
    }, [handleSubmit, onEditPress, toastType]);

    const handleEditPress = useCallback(() => {
      onEditPress?.();
      if (isSpecialOrder) store.setOnHand(0);
    }, [isSpecialOrder, onEditPress, store]);

    const handleCancelPress = useCallback(() => {
      if (store.isProductChanged) {
        setAlertParams({ isVisible: true, shouldCloseModal: false });
        return;
      }

      handleCancel();
    }, [handleCancel, store.isProductChanged]);

    const handleRemoveBySelect = useCallback(
      (removeBy: number) => {
        if (product?.inventoryUseTypeId === removeBy) return;

        store.setInventoryType(removeBy);
        reservedCountInputRef.current?.focus();
      },

      [product?.inventoryUseTypeId, store],
    );

    const handleUnitsPerContainerChange = useCallback(
      (unitsPerContainer: number) => {
        if (isUnitsPerContainerError) setIsUnitsPerContainerError(false);
        store.setUnitsPerContainer(unitsPerContainer);
      },
      [isUnitsPerContainerError, store],
    );

    const handleUpcChange = useCallback(() => {
      setUpcError(undefined);
    }, []);

    const setEditableProductQuantity = useCallback(
      (quantity: number) =>
        isEdit
          ? store.setOnHand(quantity)
          : store.setEditableProductQuantity(quantity),
      [isEdit, store],
    );

    const scrollHandler = useAnimatedScrollHandler(
      {
        onScroll: event => {
          const scrollDirection =
            event.contentOffset.y > 0
              ? ScrollDirection.Up
              : ScrollDirection.Down;

          switch (scrollDirection) {
            case ScrollDirection.Up:
              scrollTo(modalExpandedOffset);
              break;
            case ScrollDirection.Down:
              scrollTo(modalCollapsedOffset);
              break;
          }
        },
      },
      [],
    );

    const handleAlertPrimaryPress = useCallback(() => {
      if (alertParams.shouldCloseModal) {
        clearProductModalStoreOnClose();
        return;
      }

      handleCancel();
      setAlertParams(INIT_ALERT_PARAMS);
    }, [
      alertParams.shouldCloseModal,
      clearProductModalStoreOnClose,
      handleCancel,
    ]);

    const handleAlertSecondaryPress = useCallback(
      () => setAlertParams(INIT_ALERT_PARAMS),
      [],
    );

    return (
      <Modal
        isVisible={type !== ProductModalType.Hidden}
        onClose={handleModalClose}
        title={stockName}
        titleContainerStyle={styles.titleContainer}
        topOffset={topOffset}
        semiTitle={isEdit ? 'Edit Product' : 'View Product'}
      >
        <>
          <ToastContextProvider disableSafeArea offset={35}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={85}
              behavior="padding"
              style={styles.keyboardAvoidingView}
            >
              <Animated.ScrollView
                onScroll={scrollHandler}
                stickyHeaderIndices={[0]}
                contentContainerStyle={styles.contentContainer}
                bounces={false}
                ref={scrollViewRef}
                nestedScrollEnabled
              >
                <Description product={product} topOffset={topOffset} />
                <View style={styles.settings} ref={viewRef}>
                  <ProductQuantity
                    isEdit={isEdit}
                    type={ProductModalType.ManageProduct}
                    product={product}
                    onChangeProductQuantity={setEditableProductQuantity}
                    toastType={toastType}
                    maxValue={maxValue ?? 0}
                    minValue={0}
                    onHand={onHand}
                    disabled={!userPermissions.editProductInStock}
                    ref={reservedCountInputRef}
                    onToastAction={handleToastAction}
                    onClose={onClose}
                  />
                  {isEdit ? (
                    <EditProduct
                      product={product}
                      stockName={stockName}
                      unitsPerContainerError={isUnitsPerContainerError}
                      upcError={upcError}
                      onRemoveBySelect={handleRemoveBySelect}
                      onUnitsPerContainerChange={handleUnitsPerContainerChange}
                      onUpcChange={handleUpcChange}
                      ref={unitsPerContainerInputRef}
                    />
                  ) : (
                    <ViewProduct product={product} />
                  )}
                </View>
              </Animated.ScrollView>
              {isEdit && isOnOrder && (
                <InfoTitleBar
                  type={InfoTitleBarType.Secondary}
                  title={onOrderTitle}
                />
              )}
              <View style={styles.buttons}>
                {userPermissions.editProductInStock && (
                  <Button
                    title={isEdit ? 'Cancel' : 'Edit'}
                    type={ButtonType.secondary}
                    disabled={isLoading}
                    buttonStyle={styles.buttonContainer}
                    onPress={isEdit ? handleCancelPress : handleEditPress}
                  />
                )}
                <Button
                  title={isEdit ? 'Save' : 'Done'}
                  type={ButtonType.primary}
                  isLoading={isLoading}
                  buttonStyle={styles.buttonContainer}
                  onPress={handleSubmit}
                />
              </View>
            </KeyboardAvoidingView>
          </ToastContextProvider>

          <AlertWrapper
            visible={alertParams.isVisible}
            message={alertMessage}
            onPressPrimary={handleAlertPrimaryPress}
            onPressSecondary={handleAlertSecondaryPress}
          />
        </>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    height: 48,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    padding: 16,
    backgroundColor: colors.white,
  },
  contentContainer: {
    gap: 24,
    paddingBottom: 56,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  onOrderTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.TT_Regular,
    color: colors.blackLight,
    alignSelf: 'center',
  },
  onOrderTitleBold: {
    fontFamily: fonts.TT_Bold,
  },
  settings: {
    alignItems: 'center',
    gap: 24,
  },
  titleContainer: {
    backgroundColor: colors.purpleLight,
    overflow: 'hidden',
    padding: 0,
  },
});
