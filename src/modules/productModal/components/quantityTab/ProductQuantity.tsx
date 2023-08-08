import React, { useEffect } from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
import { observer } from 'mobx-react';
import { useToast } from 'react-native-toast-notifications';

import { colors, fonts, SVGs } from '../../../../theme';
import { EditQuantity } from './EditQuantity';
import { FooterDescription } from './FooterDescription';
import { ToastType } from '../../../../contexts/types';
import { getProductMinQty } from '../../../../data/helpers';
import { InventoryUseType } from '../../../../constants/common.enum';
import { ProductModel } from '../../../../stores/types';
import { Button, ButtonType, ColoredTooltip } from '../../../../components';
import { ProductModalType } from '../../ProductModal';
import { Description } from './Description';

export type ProductQuantityToastType =
  | ToastType.ProductQuantityError
  | ToastType.ProductUpdateError;

interface Props extends ViewProps {
  type?: ProductModalType;
  maxValue: number;
  onHand: number;
  isEdit?: boolean;
  jobSelectable?: boolean;
  toastType?: ProductQuantityToastType;
  product?: ProductModel;

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
};

export const ProductQuantity: React.FC<Props> = observer(
  ({
    type,
    product,
    isEdit,
    jobSelectable,
    toastType,
    maxValue,
    onHand,
    style,
    onChangeProductQuantity,
    onPressAddToList,
    onJobSelectNavigation,
    onRemove,
    onToastAction,
  }) => {
    const jobNumber = product?.job?.jobNumber;

    const toast = useToast();

    useEffect(() => {
      if (toastType)
        toast.show?.(toastMessages[toastType], {
          type: toastType,
          onPress: onToastAction,
        });
    }, [onToastAction, toast, toastType]);

    if (!product) return null;

    const { isRecoverable, inventoryUseTypeId, reservedCount } = product;

    const minQty = getProductMinQty(inventoryUseTypeId);

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
        return null
      }

      if (isEdit && reservedCount === 0) {
        return (
          <Pressable
            style={styles.deleteButton}
            onPress={onRemove}
          >
            <SVGs.TrashIcon color={colors.redDark} />
            <Text style={styles.deleteButtonText}>
              Delete
            </Text>
          </Pressable>
        )
      }

      const buttonLabel =
        (jobSelectable && isRecoverable) ||
          type === ProductModalType.CreateInvoice
          ? 'Next'
          : 'Done';

      const disabled = toastType === ToastType.ProductQuantityError || reservedCount ===0

      return (
        <Button
          disabled={disabled}
          type={ButtonType.primary}
          buttonStyle={styles.continueButton}
          title={buttonLabel}
          onPress={onPressButton}
        />
      )
    }

    return (
      <View style={[styles.container, style]}>
        {type !== ProductModalType.ManageProduct && (
          <Description product={product} />
        )}
        <View>
          <EditQuantity
            isEdit={isEdit}
            currentValue={reservedCount}
            maxValue={maxValue}
            minValue={minQty}
            stepValue={minQty}
            disabled={toastType === ToastType.ProductQuantityError}
            keyboardType={keyboardType}
            onChange={onChange}
            onRemove={onRemove}
          />
          <FooterDescription
            hideOnHandCount={
              type === ProductModalType.CreateInvoice ||
              type === ProductModalType.ManageProduct
            }
            product={product}
            onHand={onHand}
          />
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
    paddingHorizontal: 16,
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
});
