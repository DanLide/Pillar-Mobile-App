import React, { useRef, useEffect } from 'react';
import { Text, StyleSheet, Pressable, KeyboardTypeOptions } from 'react-native';
import { Button, ButtonType } from '../../../../components';
import { observer } from 'mobx-react';
import { useToast } from 'react-native-toast-notifications';

import { colors, fonts, SVGs } from '../../../../theme';
import { productModalStore } from '../../store';
import { EditQuantity } from './EditQuantity';
import { Description } from './Description';
import { FooterDescription } from './FooterDescription';
import { ToastType } from '../../../../contexts';
import { getProductMinQty } from '../../../../data/helpers';
import { InventoryUseType } from '../../../../constants/common.enum';

interface Props {
  isEdit: boolean;
  error?: string;

  onRemove?: () => void;
  onPressAddToList: () => void;
  onJobSelectNavigation: () => void;
}

export const ProductQuantity: React.FC<Props> = observer(
  ({ isEdit, error, onPressAddToList, onJobSelectNavigation, onRemove }) => {
    const store = useRef(productModalStore).current;
    const product = store.getProduct;

    const toast = useToast();

    useEffect(() => {
      if (error) toast.show?.(error, { type: ToastType.ProductQuantityError });
    }, [error, toast]);

    if (!product) return null;

    const { job, isRecoverable, inventoryUseTypeId, onHand, reservedCount } =
      product;

    const jobNumber = job?.jobNumber;
    const minQty = getProductMinQty(inventoryUseTypeId);

    const buttonLabel = isRecoverable ? 'Next' : 'Done';
    const keyboardType: KeyboardTypeOptions =
      inventoryUseTypeId === InventoryUseType.Percent
        ? 'decimal-pad'
        : 'number-pad';

    const onChange = (quantity: number) => {
      store.updateQuantity(quantity);
    };

    const onPressButton = () => {
      if (isRecoverable) {
        onJobSelectNavigation();
      } else {
        onPressAddToList();
      }
    };

    return (
      <>
        <Description product={product} />
        <EditQuantity
          isEdit={isEdit}
          currentValue={reservedCount}
          maxValue={onHand}
          minValue={minQty}
          stepValue={minQty}
          disabled={!!error}
          keyboardType={keyboardType}
          onChange={onChange}
          onRemove={onRemove}
        />
        <FooterDescription product={product} />

        {!error && (
          <Pressable
            onPress={onJobSelectNavigation}
            style={styles.jobContainer}
          >
            <SVGs.JobIcon color={colors.purple} />
            <Text style={styles.jobText}>
              {isEdit && jobNumber ? `Job ${jobNumber}` : 'Link to Job Number'}
            </Text>
          </Pressable>
        )}

        <Button
          disabled={!!error}
          type={ButtonType.primary}
          buttonStyle={styles.continueButton}
          title={buttonLabel}
          onPress={onPressButton}
        />
      </>
    );
  },
);

const styles = StyleSheet.create({
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
    paddingTop: 34,
  },
  jobText: {
    fontSize: 13,
    fontFamily: fonts.TT_Bold,
    lineHeight: 18,
    color: colors.purpleDark,
    paddingLeft: 8,
  },
});
