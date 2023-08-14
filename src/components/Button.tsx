import React, { useCallback } from 'react';
import {
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  TextProps,
  ActivityIndicator,
  StyleProp,
  View,
  Pressable,
  PressableStateCallbackType,
  ColorValue,
} from 'react-native';

import { testIds } from '../helpers';
import Text from './Text';
import { colors, fonts } from '../theme';
import { SvgProps } from 'react-native-svg';

type ButtonProps = TouchableOpacityProps & TextProps;

export enum ButtonType {
  primary,
  secondary,
}

interface ExtendedButtonProps extends ButtonProps {
  type?: ButtonType;
  title: string;
  isLoading?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.NamedExoticComponent<SvgProps>;
  iconProps?: SvgProps;
}

const Button: React.FC<ExtendedButtonProps> = ({
  type,
  title,
  isLoading,
  buttonStyle,
  textStyle,
  disabled,
  icon: Icon,
  iconProps,
  testID = 'button',
  ...props
}) => {
  const isDisabled = isLoading || disabled;

  const getStyleByType = useCallback(
    (type?: ButtonType) => {
      switch (type) {
        case ButtonType.primary:
          return [
            styles.primaryContainer,
            isDisabled && styles.primaryButtonDisabled,
          ];
        case ButtonType.secondary:
          return styles.secondaryContainer;
        default:
          return null;
      }
    },
    [isDisabled],
  );

  const iconColor = useCallback<
    (state: PressableStateCallbackType) => ColorValue | undefined
  >(
    ({ pressed }) => {
      switch (type) {
        case ButtonType.primary:
          return colors.white;
        case ButtonType.secondary:
          if (isDisabled) return colors.grayDark;
          return pressed ? colors.white : colors.black;
      }
    },
    [isDisabled, type],
  );

  const buttonMergedStyle = useCallback<
    (state: PressableStateCallbackType) => StyleProp<ViewStyle>
  >(
    ({ pressed }) => [
      styles.button,
      getStyleByType(type),
      pressed && styles.buttonPressed,
      buttonStyle,
    ],
    [getStyleByType, type, buttonStyle],
  );

  const getTextStyleByType = useCallback(
    (type?: ButtonType) => {
      switch (type) {
        case ButtonType.primary:
          return styles.primaryText;
        case ButtonType.secondary:
          return [
            styles.secondaryText,
            isDisabled && styles.secondaryTextDisabled,
          ];
        default:
          return null;
      }
    },
    [isDisabled],
  );

  const textMergedStyle = useCallback<
    (state: PressableStateCallbackType) => StyleProp<TextStyle>
  >(
    ({ pressed }) => [
      styles.buttonText,
      getTextStyleByType(type),
      pressed && styles.buttonTextPressed,
      textStyle,
    ],
    [getTextStyleByType, type, textStyle],
  );

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      style={buttonMergedStyle}
      testID={testIds.idContainer(testID)}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color="white"
          testID={testIds.idLoadingIndicator(testID)}
        />
      ) : (
        state => (
          <View
            style={styles.buttonContainer}
            testID={testIds.idContent(testID)}
          >
            {Icon && <Icon color={iconColor(state)} {...iconProps} />}
            <Text
              {...props}
              style={textMergedStyle(state)}
              disabled
              testID={testIds.idTitle(testID)}
            >
              {title}
            </Text>
          </View>
        )
      )}
    </Pressable>
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
  buttonPressed: {
    backgroundColor: colors.purpleDark3,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    color: 'white',
  },
  buttonTextPressed: {
    color: colors.white,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryContainer: {
    borderRadius: 8,
    backgroundColor: colors.purple,
  },
  primaryText: {
    color: colors.white,
    fontSize: 23.5,
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
    fontSize: 23.5,
    fontFamily: fonts.TT_Bold,
  },
  secondaryTextDisabled: {
    color: colors.grayDark,
  },
});

export default Button;
