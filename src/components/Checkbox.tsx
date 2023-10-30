import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { SVGs, colors } from '../theme';
import { testIds } from '../helpers';

interface Props {
  isChecked: boolean;
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;

  onChange: () => void;
}

export const Checkbox: React.FC<Props> = ({
  isChecked,
  disabled = false,
  onChange,
  testID = 'checkbox',
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isChecked ? colors.purple : colors.transparent,
          borderColor: isChecked ? colors.purple : colors.grayDark,
        },
        style,
      ]}
      onPress={onChange}
      disabled={disabled}
      testID={testIds.idContainer(testID)}
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
