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
import { colors, fonts } from '../theme';

type ButtonProps = TouchableOpacityProps & TextProps;

enum ButtonType {
  primary = 'primary',
  secondary = 'secondary',
}

interface ExtendedButtonProps extends ButtonProps {
  type?: ButtonType;
  title: string;
  isLoading?: boolean;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ExtendedButtonProps> = ({
  type,
  title,
  isLoading,
  buttonStyle,
  textStyle,
  disabled,
  ...props
}) => {
  const isDisabled = isLoading || disabled;

  const getStyleByType = (type?: ButtonType) => {
    switch (type) {
      case ButtonType.primary:
        return styles.primaryContainer;
      case ButtonType.secondary:
        return styles.secondaryContainer;
      default:
        return null;
    }
  };

  const buttonMergedStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.button,
      getStyleByType(type),
      isDisabled && styles.disabledStyle,
      buttonStyle,
    ],
    [type, buttonStyle, isDisabled],
  );

  const getTextStyleByType = (type?: ButtonType) => {
    switch (type) {
      case ButtonType.primary:
        return styles.primaryText;
      case ButtonType.secondary:
        return styles.secondaryText;
      default:
        return null;
    }
  };

  const textMergedStyle = useMemo<StyleProp<TextStyle>>(
    () => [styles.buttonText, getTextStyleByType(type), textStyle],
    [type, textStyle],
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
  primaryContainer: {
    borderRadius: 8,
    backgroundColor: colors.purple,
  },
  primaryText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.TT_Bold,
  },
  secondaryContainer: {
    borderWidth: 1,
    borderColor: colors.grayDark,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  secondaryText: {
    color: colors.purpleDark,
    fontSize: 20,
    fontFamily: fonts.TT_Bold,
  },
});

export default Button;
