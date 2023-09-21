import React, { memo, useEffect } from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
import { clone } from 'ramda';

import { colors, fonts, SVGs } from '../../../../theme';
import { EditQuantity } from './EditQuantity';
import { FooterDescription } from './FooterDescription';
import { ToastType } from '../../../../contexts/types';
import { getProductStepQty } from '../../../../data/helpers';
import { InventoryUseType } from '../../../../constants/common.enum';
import { ProductModel } from '../../../../stores/types';
import { Button, ButtonType, ColoredTooltip } from '../../../../components';
import { ProductModalType } from '../../ProductModal';
import { Description } from './Description';
import { useSingleToast } from '../../../../hooks';
import { getToastDuration } from '../../../../contexts';

export type ProductQuantityToastType =
  | ToastType.ProductQuantityError
  | ToastType.ProductUpdateError
  | ToastType.ProductUpdateSuccess
  | ToastType.UpcUpdateError;

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

  onChangeProductQuantity: (quantity: number) => void;
  onRemove?: () => void;
  onPressAddToList?: () => void;
  onJobSelectNavigation?: () => void;
  onToastAction?: () => void;
}

export const toastMessages: Record<ProductQuantityToastType, string> = {
  [ToastType.ProductQuantityError]:
    "You cannot remove more products than are 'In Stock' in this stock location. You can update product quantity in Manage Products section",
  [ToastType.ProductUpdateError]:
    'Sorry, there was an issue saving the product update',
  [ToastType.ProductUpdateSuccess]: 'Product Updated',
  [ToastType.UpcUpdateError]:
    'This UPC already exists in the stock location of this product. Please, use another one',
};

export const ProductQuantity = memo(
  ({
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
    onChangeProductQuantity,
    onPressAddToList,
    onJobSelectNavigation,
    onRemove,
    onToastAction,
  }: Props) => {
    const jobNumber = product?.job?.jobNumber;

    const { showToast } = useSingleToast();

    useEffect(() => {
      if (toastType)
        showToast(toastMessages[toastType], {
          type: toastType,
          onPress: onToastAction,
          duration: getToastDuration(toastType),
        });
    }, [onToastAction, showToast, toastType]);

    if (!product) return null;

    const {
      isRecoverable,
      inventoryUseTypeId,
      reservedCount = product.receivedQty,
    } = product;

    const stepQty = getProductStepQty(inventoryUseTypeId);

    const keyboardType: KeyboardTypeOptions =
      inventoryUseTypeId === InventoryUseType.Percent
        ? 'decimal-pad'
        : 'number-pad';

    const onChange = (quantity: number) => {
      onChangeProductQuantity(quantity);
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

      if (isEdit && reservedCount === 0) {
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

      const disabled =
        toastType === ToastType.ProductQuantityError || reservedCount === 0;

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
          return <Description product={product} />;
        case ProductModalType.ReceiveOrder:
          return (
            <Text style={styles.description} ellipsizeMode="middle">
              {product.name}
            </Text>
          );
        default:
          return null;
      }
    };

    const renderCostOfProduct = () => {
      switch (type) {
        case ProductModalType.ReceiveOrder:
          return (
            <View>
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
              <Text style={styles.cost}>Cost Per: ${product.cost}</Text>
              <Text style={styles.totalCost}>
                Total Cost: ${(product.cost || 0) * (product.receivedQty || 0)}
              </Text>
            </View>
          );
        default:
          return null;
      }
    };

    const getMinValue = () => {
      switch (type) {
        case ProductModalType.ReceiveOrder:
          return clone(product.receivedQty) ?? stepQty;
        default:
          return minValue ?? stepQty;
      }
    };

    return (
      <View style={[styles.container, style]}>
        {renderDescription()}
        <View>
          <EditQuantity
            currentValue={reservedCount}
            maxValue={maxValue}
            minValue={getMinValue()}
            stepValue={stepQty}
            disabled={disabled}
            hideCount={hideCount}
            error={toastType === ToastType.ProductQuantityError}
            keyboardType={keyboardType}
            onChange={onChange}
            onRemove={onRemove}
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

        {jobSelectable && toastType !== ToastType.ProductQuantityError && (
          <View>
            <Pressable
              onPress={onJobSelectNavigation}
              style={styles.jobContainer}
            >
              <SVGs.RefundIcon color={colors.purple} />
              <Text style={styles.jobText}>
                {isEdit && jobNumber
                  ? `Job ${jobNumber}`
                  : 'Link to Job Number'}
              </Text>
            </Pressable>
            {jobSelectable && product.isRecoverable ? (
              <ColoredTooltip title="Recommended" textStyles={styles.tooltip} />
            ) : null}
          </View>
        )}
        {renderCostOfProduct()}
        {renderBottomButton()}
      </View>
    );
  },
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
  quantity: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    margin: 16,
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
