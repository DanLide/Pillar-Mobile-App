import React, { useCallback, memo, useMemo } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

import { colors, fonts, SVGs } from '../../../../theme';

interface Props {
  currentValue: number;
  maxValue: number;
  disabled?: boolean;
  isEdit?: boolean;

  onRemove?: () => void;
  onChange: (quantity: number) => void;
}

export const EditQuantity = memo(
  ({ isEdit, currentValue, maxValue, disabled, onChange, onRemove }: Props) => {
    const onChangeInputText = (text: string) => {
      if (!Number(text) || maxValue < +text) return;

      if (text) {
        onChange(+text);
      }
    };

    const onIncreaseCount = useCallback(() => {
      if (currentValue >= maxValue) return;

      onChange(currentValue + 1);
    }, [currentValue, maxValue, onChange]);

    const onDecreaseCount = useCallback(() => {
      if (currentValue === 0) return;

      onChange(currentValue - 1);
    }, [currentValue, onChange]);

    const DecreaseButton = useMemo(() => {
      if (disabled) return;

      if (currentValue > 1) {
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
    }, [currentValue, disabled, isEdit, onDecreaseCount, onRemove]);

    return (
      <View style={styles.container}>
        {DecreaseButton}
        <TextInput
          editable={!disabled}
          style={[styles.input, disabled && styles.inputDisabled]}
          value={disabled ? '-' : `${currentValue}`}
          keyboardType="number-pad"
          onChangeText={onChangeInputText}
          returnKeyType="done"
        />
        {!disabled && (
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
    justifyContent: 'space-around',
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
  inputDisabled: {
    color: colors.blackSemiLight,
    backgroundColor: colors.gray,
    width: 184,
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
