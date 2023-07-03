import React, { useEffect } from 'react';
import {
  Text,
  StyleSheet,
  Pressable,
  KeyboardTypeOptions,
  View,
} from 'react-native';
import { Button, ButtonType, ColoredTooltip } from '../../../../components';
import { observer } from 'mobx-react';
import { useToast } from 'react-native-toast-notifications';

import { colors, fonts, SVGs } from '../../../../theme';
import { EditQuantity } from './EditQuantity';
import { Description } from './Description';
import { FooterDescription } from './FooterDescription';
import { ToastType } from '../../../../contexts/types';
import { getProductMinQty } from '../../../../data/helpers';
import { InventoryUseType } from '../../../../constants/common.enum';
import { ProductModel } from '../../../../stores/types';

interface Props {
  maxValue: number;
  isEdit?: boolean;
  jobSelectable?: boolean;
  error?: string;
  product?: ProductModel;

  onChangeProductQuantity: (quantity: number) => void;
  onRemove?: () => void;
  onPressAddToList: () => void;
  onJobSelectNavigation: () => void;
}

export const ProductQuantity: React.FC<Props> = observer(
  ({
    product,
    isEdit,
    jobSelectable,
    error,
    maxValue,
    onChangeProductQuantity,
    onPressAddToList,
    onJobSelectNavigation,
    onRemove,
  }) => {
    const jobNumber = product?.job?.jobNumber;

    const toast = useToast();

    useEffect(() => {
      if (error) toast.show?.(error, { type: ToastType.ProductQuantityError });
    }, [error, toast]);

    if (!product) return null;

    const { isRecoverable, inventoryUseTypeId, reservedCount } = product;

    const minQty = getProductMinQty(inventoryUseTypeId);

    const buttonLabel = jobSelectable && isRecoverable ? 'Next' : 'Done';
    const keyboardType: KeyboardTypeOptions =
      inventoryUseTypeId === InventoryUseType.Percent
        ? 'decimal-pad'
        : 'number-pad';

    const onChange = (quantity: number) => {
      onChangeProductQuantity(quantity);
    };

    const onPressButton = () => {
      if (jobSelectable && isRecoverable) {
        onJobSelectNavigation();
      } else {
        onPressAddToList();
      }
    };

    return (
      <View style={styles.container}>
        <Description product={product} />
        <View>
          <EditQuantity
            isEdit={isEdit}
            currentValue={reservedCount}
            maxValue={maxValue}
            minValue={minQty}
            stepValue={minQty}
            disabled={!!error}
            keyboardType={keyboardType}
            onChange={onChange}
            onRemove={onRemove}
          />
          <FooterDescription product={product} maxValue={maxValue} />
        </View>

        <View>
          {jobSelectable && !error && (
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
          )}

          {product.isRecoverable ? (
            <ColoredTooltip title="Recommended" textStyles={styles.tooltip} />
          ) : null}
        </View>

        <Button
          disabled={!!error}
          type={ButtonType.primary}
          buttonStyle={styles.continueButton}
          title={buttonLabel}
          onPress={onPressButton}
        />
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
});
