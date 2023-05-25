import React, { useCallback, memo, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { isEmpty } from 'ramda';

import { colors, fonts, SVGs } from '../../../../theme';

interface Props extends Pick<TextInputProps, 'keyboardType'> {
  currentValue: string;
  maxValue: number;
  minValue: number;
  disabled?: boolean;
  isEdit?: boolean;

  onRemove?: () => void;
  onChange: (quantity: string) => void;
}

export const EditQuantity = memo(
  ({
    isEdit,
    currentValue,
    maxValue,
    minValue,
    disabled,
    keyboardType,
    onChange,
    onRemove,
  }: Props) => {
    const onChangeInputText = (text: string) => {
      if (maxValue < +text) {
        return onChange(String(maxValue));
      }

      onChange(text.replace(',', '.'));
    };

    const onIncreaseCount = useCallback(() => {
      if (+currentValue >= maxValue) return;

      const updatedCount =
        +currentValue % minValue
          ? Math.ceil(+currentValue / minValue) * minValue
          : +currentValue + minValue;

      onChange(String(updatedCount));
    }, [currentValue, maxValue, minValue, onChange]);

    const onDecreaseCount = useCallback(() => {
      if (+currentValue < minValue) return;

      const updatedCount =
        +currentValue % minValue
          ? Math.floor(+currentValue / minValue) * minValue
          : +currentValue - minValue;

      onChange(String(updatedCount));
    }, [currentValue, minValue, onChange]);

    const onFocusLost = useCallback(() => {
      if (isNaN(+currentValue) || +currentValue < minValue) {
        return onChange(String(minValue));
      }

      onChange(String(Math.round(+currentValue / minValue) * minValue));
    }, [currentValue, minValue, onChange]);

    const DecreaseButton = useMemo(() => {
      if (disabled) return <View style={styles.quantityButton} />;

      if (+currentValue > minValue) {
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
    }, [currentValue, isEdit, minValue, disabled, onDecreaseCount, onRemove]);

    return (
      <View style={styles.container}>
        {DecreaseButton}
        <TextInput
          editable={!disabled}
          style={[styles.input, disabled && styles.inputDisabled]}
          value={disabled ? '-' : currentValue}
          keyboardType={keyboardType}
          onChangeText={onChangeInputText}
          returnKeyType="done"
          onBlur={onFocusLost}
        />
        {disabled ||
        +currentValue === maxValue ||
        isEmpty(currentValue) ||
        isNaN(+currentValue) ? (
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
    marginHorizontal: 36.5,
    marginTop: 8,
  },
  input: {
    height: 103,
    width: 184,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.grayDark,
    fontSize: 72,
    fontFamily: fonts.TT_Bold,
    textAlign: 'center',
  },
  inputDisabled: {
    color: colors.blackSemiLight,
    backgroundColor: colors.gray,
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
