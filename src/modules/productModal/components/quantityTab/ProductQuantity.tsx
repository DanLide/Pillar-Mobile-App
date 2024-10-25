import { FC, forwardRef, useEffect, useMemo, useState } from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewProps,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import i18n from 'i18next';
import { colors, fonts, SVGs } from 'src/theme';
import { EditQuantity } from './EditQuantity';
import { FooterDescription } from './FooterDescription';
import { ToastType } from 'src/contexts/types';
import { getProductStepQty } from 'src/data/helpers';
import { InventoryUseType } from 'src/constants/common.enum';
import { ProductModel } from 'src/stores/types';
import {
  Button,
  ButtonType,
  ColoredTooltip,
  getScannerErrorMessages,
  ScannerScreenError,
} from 'src/components';
import { ProductModalType } from '../../ProductModal';
import { Description } from './Description';
import { useSingleToast } from 'src/hooks';
import { ToastMessage } from 'src/components/ToastMessage';
import AlertWrapper, { AlertWrapperProps } from 'src/contexts/AlertWrapper';

export type ProductQuantityToastType =
  | ToastType.ProductQuantityError
  | ToastType.ProductUpdateError
  | ToastType.ProductUpdateSuccess
  | ToastType.UpcUpdateError
  | ToastType.UnitsPerContainerError
  | ToastType.UnitsPerContainerReset
  | ToastType.MinimumValueError
  | ToastType.MaximumValueError
  | ToastType.SpecialOrderError;

interface Props extends ViewProps {
  type?: ProductModalType;
  maxValue: number;
  minValue?: number;
  onHand?: number;
  isEdit?: boolean;
  jobSelectable?: boolean;
  toastType?: ProductQuantityToastType;
  product?: ProductModel;
  disabled?: boolean;
  hideCount?: boolean;
  isHideDecreaseButton?: boolean;
  isAllowZeroValue?: boolean;

  onChangeProductQuantity: (quantity: number) => void;
  onRemove?: () => void;
  onPressAddToList?: () => void;
  onJobSelectNavigation?: () => void;
  onToastAction?: () => void;
  onClose?: () => void;
}

const toastStyles = StyleSheet.create({
  default: {
    textAlign: 'left',
    marginHorizontal: 8,
  },
});

const getToastMessages = (toastType: ProductQuantityToastType) => {
  const toastMessages: Record<ProductQuantityToastType, JSX.Element | string> =
    {
      [ToastType.ProductQuantityError]: (
        <ToastMessage style={toastStyles.default}>
          {i18n.t('youCannotRemoveMoreProducts1')}
          <ToastMessage bold>{i18n.t('onHand')}</ToastMessage>
          {i18n.t('youCannotRemoveMoreProducts2')}{' '}
          <ToastMessage bold>{i18n.t('manageProducts')}</ToastMessage>{' '}
          {i18n.t('section')}
        </ToastMessage>
      ),
      [ToastType.ProductUpdateError]: i18n.t(
        'sorryThereWasIssueSavingProductUpdate',
      ),
      [ToastType.ProductUpdateSuccess]: i18n.t('productUpdated'),
      [ToastType.UpcUpdateError]: i18n.t('thisUPCAlreadyExists'),
      [ToastType.UnitsPerContainerError]: (
        <ToastMessage>
          <ToastMessage bold style={toastStyles.default}>
            {i18n.t('piecesPerContainer')}
          </ToastMessage>{' '}
          {i18n.t('cannotBeSavedLessThan1')}
        </ToastMessage>
      ),
      [ToastType.UnitsPerContainerReset]: (
        <ToastMessage>
          <ToastMessage bold style={toastStyles.default}>
            {i18n.t('piecesPerContainer')}
          </ToastMessage>{' '}
          {i18n.t('reset').toLowerCase()}
        </ToastMessage>
      ),
      [ToastType.MinimumValueError]: (
        <ToastMessage>
          <ToastMessage bold style={toastStyles.default}>
            {i18n.t('minimum')}{' '}
          </ToastMessage>
          {i18n.t('valueCannotBe0')}
        </ToastMessage>
      ),
      [ToastType.MaximumValueError]: (
        <ToastMessage style={toastStyles.default}>
          <ToastMessage bold style={toastStyles.default}>
            {i18n.t('maximum')}{' '}
          </ToastMessage>
          {i18n.t('mustBeGreaterThan')}{' '}
          <ToastMessage bold style={toastStyles.default}>
            {i18n.t('piecesPerContainerMinimumValue')}
          </ToastMessage>
        </ToastMessage>
      ),
      [ToastType.SpecialOrderError]: (
        <ToastMessage style={toastStyles.default}>
          {i18n.t('productListedAs1')}
          <ToastMessage bold>{i18n.t('specialOrder')}</ToastMessage>
          {i18n.t('productListedAs2')}{' '}
          <ToastMessage bold>{i18n.t('manageOrders')}</ToastMessage>{' '}
          {i18n.t('section')}
        </ToastMessage>
      ),
    };

  return toastMessages[toastType];
};

const getEditQuantityLabel = (type?: ProductModalType) => {
  switch (type) {
    case ProductModalType.CreateOrder:
      return i18n.t('orderQuantity');
    case ProductModalType.ReturnOrder:
      return i18n.t('returnQuantity');
    case ProductModalType.ManageProduct:
      return i18n.t('onHand');
    case ProductModalType.Remove:
      return i18n.t('removeQuantity');
    case ProductModalType.Return:
      return i18n.t('returnQuantity');
    case ProductModalType.CreateInvoice:
      return i18n.t('invoiceQuantity');
  }
};

export const ProductQuantity = forwardRef(
  (
    {
      type,
      product,
      isEdit,
      jobSelectable,
      toastType,
      maxValue,
      minValue,
      onHand,
      disabled,
      hideCount,
      style,
      isHideDecreaseButton,
      isAllowZeroValue,
      onChangeProductQuantity,
      onPressAddToList,
      onJobSelectNavigation,
      onRemove,
      onToastAction,
      onClose,
    }: Props,
    ref: React.ForwardedRef<TextInput>,
  ) => {
    const { t } = useTranslation();
    const jobNumber = product?.job?.jobNumber;

    const isSpecialOrder =
      product?.inventoryUseTypeId === InventoryUseType.NonStock;

    const [invoicingInfoAlertVisible, setInvoicingInfoAlertVisible] =
      useState(false);

    const isProductQuantityError = toastType === ToastType.ProductQuantityError;
    const isSpecialOrderError = toastType === ToastType.SpecialOrderError;

    const { showToast } = useSingleToast();

    useEffect(() => {
      if (toastType)
        showToast(getToastMessages(toastType), {
          type: toastType,
          onPress: onToastAction,
        });
    }, [onToastAction, showToast, toastType]);

    const currentValue = useMemo(() => {
      if (!product) {
        return undefined;
      }

      if (isProductQuantityError) {
        return product.onHand;
      }

      if (isSpecialOrderError) {
        return 0;
      }

      if (type === ProductModalType.ReceiveOrder) {
        return product.reservedCount;
      } else {
        return product.reservedCount || product.receivedQty;
      }
    }, [isProductQuantityError, isSpecialOrderError, product, type]);

    if (!product) return null;

    const { isRecoverable, inventoryUseTypeId } = product;

    const stepQty = getProductStepQty(inventoryUseTypeId, {
      disableDecimals:
        type === ProductModalType.CreateOrder ||
        type === ProductModalType.ReturnOrder ||
        type === ProductModalType.ReceiveOrder,
    });

    const keyboardType: KeyboardTypeOptions =
      inventoryUseTypeId === InventoryUseType.Percent
        ? 'decimal-pad'
        : 'number-pad';

    const onChange = (quantity: number) => {
      onChangeProductQuantity(quantity);
    };

    const handleJobButtonPress = () => {
      if (type === ProductModalType.Remove && !product?.isRecoverable) {
        showToast(
          getScannerErrorMessages(ScannerScreenError.ProductIsNotRecoverable),
          {
            type: ToastType.InvoiceMissingProductPrice,
            duration: 0,
            onPress: () => {
              setInvoicingInfoAlertVisible(true);
            },
          },
        );

        return;
      }

      onJobSelectNavigation?.();
    };

    const onPressButton = () => {
      if (currentValue === 0 && onClose && !isAllowZeroValue) {
        onClose();
        return;
      }

      if (jobSelectable && isRecoverable && !jobNumber) {
        onJobSelectNavigation?.();
      } else {
        onPressAddToList?.();
      }
    };

    const renderBottomButton = () => {
      if (
        type === ProductModalType.ManageProduct ||
        type === ProductModalType.CreateOrder ||
        type === ProductModalType.ReturnOrder ||
        type === ProductModalType.ReceiveOrder ||
        type === ProductModalType.ReceiveBackOrder
      ) {
        return null;
      }

      const calculateButtonLabel = () => {
        if (type === ProductModalType.Remove && currentValue === 0)
          return t('cancel');

        return (jobSelectable && isRecoverable && !jobNumber) ||
          type === ProductModalType.CreateInvoice
          ? t('next')
          : t('done');
      };

      const calculateDisabled = () => {
        if (type === ProductModalType.Remove && currentValue === 0)
          return false;

        if (type === ProductModalType.Remove) {
          return isProductQuantityError;
        }

        return isProductQuantityError || currentValue === 0;
      };

      const calculateButtonType = () => {
        if (type === ProductModalType.Remove && currentValue === 0) {
          return ButtonType.secondaryRed;
        }

        return ButtonType.primary;
      };

      if (isEdit && currentValue === 0) {
        return (
          <Pressable style={styles.deleteButton} onPress={onRemove}>
            <SVGs.TrashIcon color={colors.redDark} />
            <Text style={styles.deleteButtonText}>{t('delete')}</Text>
          </Pressable>
        );
      }

      const buttonType = calculateButtonType();
      const buttonLabel = calculateButtonLabel();
      const disabled = calculateDisabled();

      return (
        <Button
          disabled={disabled}
          type={buttonType}
          buttonStyle={styles.continueButton}
          title={buttonLabel}
          onPress={onPressButton}
        />
      );
    };

    const renderDescription = () => {
      switch (type) {
        case ProductModalType.ManageProduct:
        case ProductModalType.CreateOrder:
        case ProductModalType.ReturnOrder:
        case ProductModalType.ReceiveOrder:
        case ProductModalType.ReceiveBackOrder:
          return null;
        case ProductModalType.Remove:
        case ProductModalType.Return:
        case ProductModalType.CreateInvoice:
          return (
            <Text style={styles.description} ellipsizeMode="middle">
              {product.name}
            </Text>
          );
        default:
          return <Description product={product} />;
      }
    };

    const renderCostOfProduct = () => {
      switch (type) {
        case ProductModalType.ReceiveOrder:
        case ProductModalType.CreateOrder:
        case ProductModalType.ReturnOrder:
        case ProductModalType.ReceiveBackOrder:
          return (
            <View style={styles.costOfProduct}>
              {!isSpecialOrder && (
                <View style={styles.quantity}>
                  <View>
                    <Text style={styles.quantityTitle}>
                      {t('minimumQuantity')}
                    </Text>
                    <Text style={styles.quantityValue}>{product.min}</Text>
                  </View>
                  <Text style={styles.divider}>/</Text>
                  <View>
                    <Text style={styles.quantityTitle}>
                      {t('maximumQuantity')}
                    </Text>
                    <Text style={styles.quantityValue}>{product.max}</Text>
                  </View>
                </View>
              )}
            </View>
          );
        default:
          return null;
      }
    };

    const showJob =
      jobSelectable && !isProductQuantityError && !isSpecialOrderError;

    return (
      <>
        <View style={[styles.container, style]}>
          {renderDescription()}
          <View>
            <EditQuantity
              currentValue={currentValue}
              maxValue={maxValue}
              minValue={minValue ?? stepQty}
              stepValue={stepQty}
              disabled={disabled}
              hideCount={hideCount}
              keyboardType={keyboardType}
              label={getEditQuantityLabel(type)}
              ref={ref}
              onChange={onChange}
              onRemove={onRemove}
              isHideDecreaseButton={isHideDecreaseButton}
            />
            {type === ProductModalType.ManageProduct && isEdit ? null : (
              <FooterDescription
                type={type}
                hideOnHandCount={
                  type === ProductModalType.CreateInvoice ||
                  type === ProductModalType.ManageProduct
                }
                product={product}
                onHand={onHand}
              />
            )}
          </View>

          {showJob && (
            <View>
              <Pressable
                onPress={handleJobButtonPress}
                style={styles.jobContainer}
              >
                <SVGs.RefundIcon color={colors.purple} />
                <Text style={styles.jobText}>
                  {jobNumber
                    ? t('repairOrder', { jobNumber })
                    : t('linkToRepairOrder')}
                </Text>
              </Pressable>
              {jobSelectable && product.isRecoverable ? (
                <ColoredTooltip
                  title={t('recommended')}
                  textStyles={styles.tooltip}
                />
              ) : null}
            </View>
          )}
          {renderCostOfProduct()}
          {renderBottomButton()}
        </View>

        <InvoicingInfoAlert
          visible={invoicingInfoAlertVisible}
          onPressSecondary={() => {
            setInvoicingInfoAlertVisible(false);
          }}
        />
      </>
    );
  },
);

type InvoicingInfoAlertProps = Omit<
  AlertWrapperProps,
  'message' | 'hidePrimary' | 'secondaryTitle'
>;

const InvoicingInfoAlert: FC<InvoicingInfoAlertProps> = props => {
  const { t } = useTranslation();
  return (
    <AlertWrapper
      message={<Text style={styles.alertTitle}>{t('invoicingSettings')}</Text>}
      hidePrimary
      secondaryTitle={t('close')}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    justifyContent: 'space-between',
    // paddingHorizontal: 16,
  },
  alertTitle: { textAlign: 'center' },
  continueButton: {
    width: 135,
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 16,
  },
  jobContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  jobText: {
    fontSize: 13,
    fontFamily: fonts.TT_Bold,
    lineHeight: 18,
    color: colors.purpleDark,
    paddingLeft: 8,
  },
  tooltip: {
    alignSelf: 'center',
    color: colors.purpleDark,
    backgroundColor: colors.white2,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.red,
    height: 48,
    marginTop: 'auto',
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
  description: {
    fontSize: 17,
    fontFamily: fonts.TT_Regular,
    lineHeight: 25,
    color: colors.grayDark2,
    textAlign: 'center',
  },
  costOfProduct: {
    flex: 1,
    justifyContent: 'flex-end',
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
  divider: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.TT_Bold,
    color: colors.grayDark3,
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
});
