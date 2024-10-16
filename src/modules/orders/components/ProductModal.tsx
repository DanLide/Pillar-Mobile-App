import { useCallback, useRef, useMemo, memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-notifications';
import ToastContainer from 'react-native-toast-notifications/lib/typescript/toast-container';
// eslint-disable-next-line import/default
import Animated, {
  useAnimatedScrollHandler,
  withSpring,
  WithSpringConfig,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, ButtonType, Modal } from 'src/components';
import { colors, fonts, SVGs } from 'src/theme';
import {
  ToastContextProvider,
  TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
} from 'src/contexts';
import { ToastType } from 'src/contexts/types';
import { renderType } from 'src/contexts/ToastContext/renderTypes';
import {
  Description,
  ProductModalProps,
  ProductModalType,
} from 'src/modules/productModal';
import { ProductQuantity } from 'src/modules/productModal/components/quantityTab';
import { getProductTotalCost } from 'src/modules/orders/helpers';

enum ScrollDirection {
  Down,
  Up,
}

const TOAST_SUCCESS_CREATE_JOB = renderType[ToastType.SuccessCreateJob];

const SCROLL_ANIMATION_CONFIG: WithSpringConfig = {
  damping: 500,
  stiffness: 1000,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 10,
  restSpeedThreshold: 10,
};

export const ProductModal = memo(
  ({
    type,
    product,
    stockName,
    toastType,
    isEdit,
    maxValue = 0,
    minValue,
    onHand = 0,
    isHideDecreaseButton,
    isAllowZeroValue,
    onClose,
    onSubmit,
    onRemove,
    onChangeProductQuantity,
  }: ProductModalProps) => {
    const { t } = useTranslation();
    const scrollViewRef = useRef<Animated.ScrollView>(null);
    const toastRef = useRef<ToastContainer>(null);

    const modalCollapsedOffset = useHeaderHeight();
    const { top: modalExpandedOffset } = useSafeAreaInsets();

    const topOffset = useSharedValue(modalCollapsedOffset);

    const isProductQuantityError = toastType === ToastType.ProductQuantityError;

    const clearProductModalStoreOnClose = useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0 });

      setTimeout(() => onClose());
    }, [onClose]);

    const onRemoveAlert = useCallback(() => {
      if (product) onRemove?.(product);
      clearProductModalStoreOnClose();
    }, [clearProductModalStoreOnClose, product, onRemove]);

    const onPressSkip = useCallback(() => {
      if (!product) return;

      onSubmit(product);
      clearProductModalStoreOnClose();
    }, [clearProductModalStoreOnClose, onSubmit, product]);

    const scrollTo = useCallback(
      (destination: number) => {
        'worklet';
        topOffset.value = withSpring(destination, SCROLL_ANIMATION_CONFIG);
      },
      [topOffset],
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

    const title = useMemo<JSX.Element>(
      () => (
        <Text style={styles.title} ellipsizeMode="middle">
          {type === ProductModalType.ReceiveBackOrder
            ? product?.nameDetails
            : product?.product}
        </Text>
      ),
      [type, product],
    );

    const renderStockName = useMemo(() => {
      switch (type) {
        case ProductModalType.ReceiveBackOrder:
          return t('chooseStockLocationItem');
        default:
          return stockName;
      }
    }, [stockName, type, t]);

    const currentValue = useMemo(() => {
      if (!product) {
        return undefined;
      }

      if (isProductQuantityError) {
        return product.onHand;
      }

      if (type === ProductModalType.ReceiveOrder) {
        return product.reservedCount;
      } else {
        return product.reservedCount || product.receivedQty;
      }
    }, [isProductQuantityError, product, type]);

    const onPressButton = useCallback(() => {
      if (currentValue === 0 && onClose && !isAllowZeroValue) {
        onClose();
        return;
      }

      onPressSkip?.();
    }, [currentValue, isAllowZeroValue, onClose, onPressSkip]);

    const BottomButton = useMemo(() => {
      const calculateDisabled = () => {
        if (type === ProductModalType.ReceiveOrder) {
          return isProductQuantityError;
        }

        if (
          type === ProductModalType.ReturnOrder &&
          (!product?.onHand || product.onHand < (currentValue ?? 0))
        ) {
          return true;
        }

        return isProductQuantityError || currentValue === 0;
      };

      if (isEdit && currentValue === 0) {
        return (
          <Pressable style={styles.deleteButton} onPress={onRemoveAlert}>
            <SVGs.TrashIcon color={colors.redDark} />
            <Text style={styles.deleteButtonText}>{t('delete')}</Text>
          </Pressable>
        );
      }

      const disabled = calculateDisabled();

      return (
        <Button
          disabled={disabled}
          type={ButtonType.primary}
          buttonStyle={styles.continueButton}
          title={t('done')}
          onPress={onPressButton}
        />
      );
    }, [
      currentValue,
      isEdit,
      isProductQuantityError,
      onPressButton,
      onRemoveAlert,
      product?.onHand,
      t,
      type,
    ]);

    const renderCostOfProduct = () =>
      product && (
        <View>
          <Text style={styles.cost}>
            {t('costPer')}: ${product.cost?.toFixed(2)}
          </Text>
          <Text style={styles.totalCost}>
            {t('totalCost')}: ${getProductTotalCost(product).toFixed(2)}
          </Text>
        </View>
      );

    return (
      <Modal
        isVisible={type !== ProductModalType.Hidden}
        onClose={clearProductModalStoreOnClose}
        title={renderStockName}
        titleContainerStyle={styles.titleContainer}
        topOffset={topOffset}
        semiTitle={title}
      >
        <ToastContextProvider
          duration={0}
          offset={TOAST_OFFSET_ABOVE_SINGLE_BUTTON}
        >
          <Animated.ScrollView
            onScroll={scrollHandler}
            stickyHeaderIndices={[0]}
            contentContainerStyle={styles.contentContainer}
            bounces={false}
            ref={scrollViewRef}
            nestedScrollEnabled
          >
            <Description type={type} product={product} topOffset={topOffset} />
            <ProductQuantity
              type={type}
              product={product}
              onChangeProductQuantity={onChangeProductQuantity}
              isEdit={isEdit}
              disabled={
                toastType === ToastType.ProductQuantityError ||
                toastType === ToastType.SpecialOrderError
              }
              toastType={toastType}
              maxValue={maxValue}
              minValue={minValue}
              isAllowZeroValue={isAllowZeroValue}
              style={styles.productQuantityContainer}
              onHand={onHand}
              onPressAddToList={onPressSkip}
              onRemove={onRemoveAlert}
              isHideDecreaseButton={isHideDecreaseButton}
              onClose={onClose}
            />
          </Animated.ScrollView>
          {renderCostOfProduct()}
          {BottomButton}
        </ToastContextProvider>
        <Toast ref={toastRef} renderToast={TOAST_SUCCESS_CREATE_JOB} />
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  continueButton: {
    width: 135,
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  contentContainer: {
    paddingBottom: 56,
  },
  cost: {
    width: '100%',
    padding: 8,
    fontSize: 12,
    lineHeight: 11,
    fontFamily: fonts.TT_Regular,
    color: colors.grayDark2,
    backgroundColor: colors.background,
    textAlign: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.red,
    height: 48,
    marginTop: 8,
    marginBottom: 16,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  deleteButtonText: {
    color: colors.redDark,
    fontWeight: '700',
    fontSize: 20,
    fontFamily: fonts.TT_Bold,
    marginLeft: 15,
  },
  divider: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Bold,
    color: colors.grayDark3,
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  productQuantityContainer: {
    paddingTop: 16,
  },
  quantity: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quantityTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.TT_Regular,
    color: colors.grayDark2,
  },
  quantityValue: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Bold,
    color: colors.grayDark3,
    textAlign: 'center',
  },
  title: {
    fontSize: 17,
    fontFamily: fonts.TT_Bold,
    lineHeight: 20,
    color: colors.grayDark3,
  },
  titleContainer: {
    backgroundColor: colors.purpleLight,
    overflow: 'hidden',
    padding: 0,
  },
  totalCost: {
    width: '100%',
    padding: 8,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: fonts.TT_Bold,
    color: colors.white,
    backgroundColor: colors.purpleDark2,
    textAlign: 'center',
  },
  upcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcTitle: {
    fontSize: 17,
    fontFamily: fonts.TT_Bold,
    lineHeight: 20,
    paddingLeft: 8,
    paddingRight: 14,
  },
  upc: {
    fontSize: 17,
    fontFamily: fonts.TT_Regular,
    lineHeight: 25.5,
    color: colors.grayDark2,
  },
});
