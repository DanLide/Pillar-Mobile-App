import React, { useRef, useMemo } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Button, ButtonType } from '../../../../components';
import { observer } from 'mobx-react';
import { colors, fonts, SVGs } from '../../../../theme';
import { productModalStore } from '../../store';

import { EditQuantity } from './EditQuantity';
import { Description } from './Description';
import { FooterDescription } from './FooterDescription';

interface Props {
  isEdit: boolean;

  onRemove?: () => void;
  onPressAddToList: () => void;
  onJobSelectNavigation: () => void;
}

export const ProductQuantity: React.FC<Props> = observer(
  ({ isEdit, onPressAddToList, onJobSelectNavigation, onRemove }) => {
    const store = useRef(productModalStore).current;
    const product = store.getProduct;
    const jobNumber = product?.job?.jobNumber;

    if (!product) return null;

    const buttonLabel = product.isRecoverable ? 'Next' : 'Done';

    const onChange = (quantity: number | string) => {
      store.updateQuantity(quantity);
    };

    const onPressButton = () => {
      if (product.isRecoverable) {
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
          maxValue={product.onHand}
          currentValue={product?.reservedCount}
          onChange={onChange}
          onRemove={onRemove}
        />
        <FooterDescription product={product} />

        <Pressable onPress={onJobSelectNavigation} style={styles.jobContainer}>
          <SVGs.JobIcon color={colors.purple} />
          <Text style={styles.jobText}>
            {isEdit && jobNumber ? `Job ${jobNumber}` : 'Link to Job Number'}
          </Text>
        </Pressable>

        <Button
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
