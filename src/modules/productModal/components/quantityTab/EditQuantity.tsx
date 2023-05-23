import React, { useCallback, memo, useMemo } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

import { colors, fonts, SVGs } from '../../../../theme';

interface Props {
  currentValue?: number;
  maxValue: number;
  isEdit?: boolean;
  minValue: number;

  onRemove?: () => void;
  onChange: (quantity?: number) => void;
}

export const EditQuantity = memo(
  ({ isEdit, currentValue, maxValue, minValue, onChange, onRemove }: Props) => {
    const onChangeInputText = (text: string) => {
      if (maxValue < +text) {
        onChange(maxValue);
        return;
      }
      if (text === '') {
        onChange();
        return;
      }

      onChange(Number(text));
    };

    const onIncreaseCount = useCallback(() => {
      if (Number(currentValue) >= maxValue) return;

      onChange(Number(currentValue) + minValue);
    }, [currentValue, maxValue, minValue, onChange]);

    const onDecreaseCount = useCallback(() => {
      if (typeof currentValue !== 'undefined' && currentValue < minValue)
        return;

      onChange(Number(currentValue) - minValue);
    }, [currentValue, minValue, onChange]);

    const onFocusLost = useCallback(() => {
      if (typeof currentValue === 'undefined') {
        onChange(minValue);
      }
    }, [currentValue, minValue, onChange]);

    const DecreaseButton = useMemo(() => {
      if (Number(currentValue) > 1) {
        return (
          <TouchableOpacity
            style={[styles.quantityButton, styles.border]}
            onPress={onDecreaseCount}
          >
            <SVGs.MinusIcon color={colors.black} />
          </TouchableOpacity>
        );
      }

      if (isEdit) {
        return (
          <TouchableOpacity
            style={[styles.quantityButton, styles.border]}
            onPress={onRemove}
          >
            <SVGs.TrashIcon color={colors.black} />
          </TouchableOpacity>
        );
      }

      return <View style={styles.quantityButton} />;
    }, [currentValue, isEdit, onDecreaseCount, onRemove]);

    return (
      <View style={styles.container}>
        {DecreaseButton}
        <TextInput
          style={styles.input}
          value={currentValue ? `${currentValue}` : ''}
          keyboardType="number-pad"
          onChangeText={onChangeInputText}
          returnKeyType="done"
          onBlur={onFocusLost}
        />
        {currentValue === maxValue || typeof currentValue === 'undefined' ? (
          <View style={styles.quantityButton} />
        ) : (
          <TouchableOpacity
            style={[styles.quantityButton, styles.border]}
            onPress={onIncreaseCount}
          >
            <SVGs.PlusIcon color={colors.black} />
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 58.5,
    marginTop: 8,
  },
  input: {
    height: 103,
    width: 140,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.grayDark,
    fontSize: 78,
    fontFamily: fonts.TT_Bold,
    textAlign: 'center',
  },
  quantityButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  border: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.grayDark,
  },
});
