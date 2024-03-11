import React, { FC, forwardRef, useEffect, useMemo, useState } from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewProps,
} from 'react-native';

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
  scannerErrorMessages,
} from 'src/components';
import { ProductModalType } from '../../ProductModal';
import { Description } from './Description';
import { useSingleToast } from 'src/hooks';
import { getProductTotalCost } from 'src/modules/orders/helpers';
import { ToastMessage } from 'src/components/ToastMessage';
import AlertWrapper, { AlertWrapperProps } from 'src/contexts/AlertWrapper';

export type ProductQuantityToastType =
  | ToastType.ProductQuantityError
  | ToastType.ProductUpdateError
  | ToastType.ProductUpdateSuccess
  | ToastType.UpcUpdateError
  | ToastType.UnitsPerContainerError
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

  onChangeProductQuantity: (quantity: number) => void;
  onRemove?: () => void;
  onPressAddToList?: () => void;
  onJobSelectNavigation?: () => void;
  onToastAction?: () => void;
}

export const toastMessages: Record<
  ProductQuantityToastType,
  JSX.Element | string
> = {
  [ToastType.ProductQuantityError]: (
    <ToastMessage style={{ textAlign: 'left', marginHorizontal: 8 }}>
      You cannot remove more products than are '
      <ToastMessage bold>On Hand</ToastMessage>' in this stock location. You can
      update product quantity in the{' '}
      <ToastMessage bold>Manage Products</ToastMessage> section
    </ToastMessage>
  ),
  [ToastType.ProductUpdateError]:
    'Sorry, there was an issue saving the product update',
  [ToastType.ProductUpdateSuccess]: 'Product Updated',
  [ToastType.UpcUpdateError]:
    'This UPC already exists in the stock location of this product. Please, use another one',
  [ToastType.UnitsPerContainerError]: (
    <ToastMessage>
      <ToastMessage bold>Pieces Per Container</ToastMessage> cannot be saved
      less than 1
    </ToastMessage>
  ),
  [ToastType.SpecialOrderError]: (
    <ToastMessage style={{ textAlign: 'left', marginHorizontal: 8 }}>
      Product listed as '<ToastMessage bold>Special Order</ToastMessage>'. You
      can create a new order in the{' '}
      <ToastMessage bold>Manage Orders</ToastMessage> section
    </ToastMessage>
  ),
};

const getEditQuantityLabel = (type?: ProductModalType) => {
  switch (type) {
    case ProductModalType.CreateOrder:
      return 'Order Quantity';
    case ProductModalType.ReturnOrder:
      return 'Return Quantity';
    case ProductModalType.ManageProduct:
      return 'On Hand';
    case ProductModalType.Remove:
      return 'Remove Quantity';
    case ProductModalType.Return:
      return 'Return Quantity';
    case ProductModalType.CreateInvoice:
      return 'Invoice Quantity';
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
      onChangeProductQuantity,
      onPressAddToList,
      onJobSelectNavigation,
      onRemove,
      onToastAction,
    }: Props,
    ref: React.ForwardedRef<TextInput>,
  ) => {
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
        showToast(toastMessages[toastType], {
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

      return product.reservedCount || product.receivedQty;
    }, [isProductQuantityError, isSpecialOrderError, product]);

    if (!product) return null;

    const { isRecoverable, inventoryUseTypeId } = product;

    const stepQty = getProductStepQty(inventoryUseTypeId);

    const keyboardType: KeyboardTypeOptions =
      inventoryUseTypeId === InventoryUseType.Percent
        ? 'decimal-pad'
        : 'number-pad';

    const onChange = (quantity: number) => {
      onChangeProductQuantity(quantity);
    };

    const handleJobButtonPress = () => {
      if (type === ProductModalType.Remove && !product?.isRecoverable) {
        showToast(scannerErrorMessages.ProductIsNotRecoverable, {
          type: ToastType.InvoiceMissingProductPrice,
          duration: 0,
          onPress: () => {
            setInvoicingInfoAlertVisible(true);
          },
        });

        return;
      }

      onJobSelectNavigation?.();
    };

    const onPressButton = () => {
      if (jobSelectable && isRecoverable) {
        onJobSelectNavigation?.();
      } else {
        onPressAddToList?.();
      }
    };

    const renderBottomButton = () => {
      if (type === ProductModalType.ManageProduct) {
        return null;
      }

      if (isEdit && currentValue === 0) {
        return (
          <Pressable style={styles.deleteButton} onPress={onRemove}>
            <SVGs.TrashIcon color={colors.redDark} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        );
      }

      const buttonLabel =
        (jobSelectable && isRecoverable) ||
        type === ProductModalType.CreateInvoice
          ? 'Next'
          : 'Done';

      const disabled = type === ProductModalType.ReceiveOrder
        ? isProductQuantityError
        : isProductQuantityError || currentValue === 0;

      return (
        <Button
          disabled={disabled}
          type={ButtonType.primary}
          buttonStyle={styles.continueButton}
          title={buttonLabel}
          onPress={onPressButton}
        />
      );
    };

    const renderDescription = () => {
      switch (type) {
        case ProductModalType.ManageProduct:
          return null;
        case ProductModalType.ReceiveOrder:
        case ProductModalType.CreateOrder:
        case ProductModalType.ReturnOrder:
        case ProductModalType.ReceiveBackOrder:
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
                    <Text style={styles.quantityTitle}>Minimum Quantity</Text>
                    <Text style={styles.quantityValue}>{product.min}</Text>
                  </View>
                  <Text style={styles.divider}>/</Text>
                  <View>
                    <Text style={styles.quantityTitle}>Maximum Quantity</Text>
                    <Text style={styles.quantityValue}>{product.max}</Text>
                  </View>
                </View>
              )}
              <Text style={styles.cost}>
                Cost Per: ${product.cost?.toFixed(2)}
              </Text>
              <Text style={styles.totalCost}>
                Total Cost: ${getProductTotalCost(product).toFixed(2)}
              </Text>
            </View>
          );
        default:
          return null;
      }
    };

    const showJob =
      jobSelectable && isProductQuantityError && isSpecialOrderError;

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
                  {isEdit && jobNumber
                    ? `Repair Order ${jobNumber}`
                    : 'Link to Repair Order'}
                </Text>
              </Pressable>
              {jobSelectable && product.isRecoverable ? (
                <ColoredTooltip
                  title="Recommended"
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

const InvoicingInfoAlert: FC<InvoicingInfoAlertProps> = props => (
  <AlertWrapper
    message={
      <Text style={{ textAlign: 'center' }}>
        Invoicing Settings for this product can be added at repairstack.3m.com{' '}
        {'>'} Products
      </Text>
    }
    hidePrimary
    secondaryTitle="Close"
    {...props}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    justifyContent: 'space-between',
    // paddingHorizontal: 16,
  },
  continueButton: {
    width: 135,
    height: 48,
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
});
