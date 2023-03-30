import React, { useMemo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  TextProps,
  ActivityIndicator,
  StyleProp,
} from 'react-native';

import Text from './Text';

type ButtonProps = TouchableOpacityProps & TextProps;

interface ExtendedButtonProps extends ButtonProps {
  title: string;
  isLoading?: boolean;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ExtendedButtonProps> = ({
  title,
  isLoading,
  buttonStyle,
  textStyle,
  disabled,
  ...props
}) => {
  const isDisabled = isLoading || disabled;

  const buttonMergedStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.button, isDisabled && styles.disabledStyle, buttonStyle],
    [buttonStyle, isDisabled],
  );

  const textMergedStyle = useMemo<StyleProp<TextStyle>>(
    () => [styles.buttonText, textStyle],
    [textStyle],
  );

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      style={buttonMergedStyle}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text {...props} style={textMergedStyle}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 16,
  },
  disabledStyle: {
    opacity: 0.2,
  },
  buttonText: {
    fontSize: 17,
    color: 'white',
  },
});

export default Button;
