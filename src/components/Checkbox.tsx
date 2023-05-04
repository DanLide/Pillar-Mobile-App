import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { SVGs, colors } from '../theme';

interface Props {
  isChecked: boolean;
  onChange: () => void;

  disabled?: boolean;
}

export const Checkbox: React.FC<Props> = ({
  isChecked,
  disabled = false,
  onChange,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isChecked ? colors.purple : colors.transparent,
          borderColor: isChecked ? colors.purple : colors.grayDark,
        },
      ]}
      onPress={onChange}
      disabled={disabled}
    >
      {isChecked ? <SVGs.CheckMarkIcon color={colors.white} /> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    borderWidth: 1,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
