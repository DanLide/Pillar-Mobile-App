import React, { useCallback, memo, useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';

import { colors, fonts, SVGs } from '../../../../theme';
import { Utils } from '../../../../data/helpers/utils';

interface Props extends Pick<TextInputProps, 'keyboardType'> {
  currentValue: number;
  maxValue: number;
  minValue: number;
  stepValue: number;
  disabled?: boolean;
  isEdit?: boolean;

  onRemove?: () => void;
  onChange: (quantity: number) => void;
}

export const EditQuantity = memo(
  ({
    isEdit,
    currentValue,
    maxValue,
    minValue,
    stepValue,
    disabled,
    keyboardType,
    onChange,
    onRemove,
  }: Props) => {
    const [displayValue, setDisplayValue] = useState(String(currentValue));

    const setNewValue = useCallback(
      (value: string | number) => {
        setDisplayValue(String(value));
        onChange(+value);
      },
      [onChange],
    );

    const onChangeInputText = (text: string) => {
      if (maxValue < +text) {
        return setNewValue(maxValue);
      }

      setNewValue(Utils.parseFloatFromString(text));
    };

    const onIncreaseCount = useCallback(() => {
      const updatedCount =
        Math.floor(currentValue / stepValue) * stepValue + stepValue;

      setNewValue(updatedCount);
    }, [currentValue, stepValue, setNewValue]);

    const onDecreaseCount = useCallback(() => {
      const updatedCount =
        Math.ceil(currentValue / stepValue) * stepValue - stepValue;

      setNewValue(updatedCount);
    }, [currentValue, stepValue, setNewValue]);

    const onFocusLost = useCallback(() => {
      if (isNaN(currentValue) || currentValue < minValue) {
        return setNewValue(minValue);
      }

      const updatedCount = Math.ceil(currentValue / stepValue) * stepValue;

      setNewValue(updatedCount);
    }, [currentValue, minValue, stepValue, setNewValue]);

    const DecreaseButton = useMemo(() => {
      if (disabled) return <View style={styles.quantityButton} />;

      if (currentValue > minValue) {
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
          contextMenuHidden
          editable={!disabled}
          style={[styles.input, disabled && styles.inputDisabled]}
          value={disabled ? '-' : displayValue}
          keyboardType={keyboardType}
          onChangeText={onChangeInputText}
          returnKeyType="done"
          onBlur={onFocusLost}
        />
        {disabled || currentValue === maxValue || isNaN(currentValue) ? (
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
    fontSize: 78,
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
