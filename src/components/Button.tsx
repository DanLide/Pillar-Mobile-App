import { useCallback } from 'react';
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
  secondaryRed,
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
            isDisabled ? styles.primaryButtonDisabled : undefined,
          ];
        case ButtonType.secondary:
          return styles.secondaryContainer;
        case ButtonType.secondaryRed:
          return styles.secondaryRedContainer;
        default:
          return [
            styles.button,
            isDisabled ? styles.primaryButtonDisabled : undefined,
          ];
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
          return iconProps?.color ?? colors.white;
        case ButtonType.secondary:
        case ButtonType.secondaryRed:
          if (isDisabled) return colors.grayDark;
          return pressed ? colors.white : iconProps?.color ?? colors.black;
      }
    },
    [iconProps?.color, isDisabled, type],
  );

  const buttonMergedStyle = useCallback<
    (state: PressableStateCallbackType) => StyleProp<ViewStyle>
  >(
    ({ pressed }) => [
      getStyleByType(type),
      pressed ? styles.buttonPressed : undefined,
      buttonStyle,
    ],
    [getStyleByType, type, buttonStyle],
  );

  const getTextStyleByType = useCallback(
    (type?: ButtonType) => {
      switch (type) {
        case ButtonType.secondary:
          return [
            styles.secondaryText,
            isDisabled ? styles.secondaryTextDisabled : undefined,
          ];
        case ButtonType.secondaryRed:
          return styles.secondaryRedText;
        default:
          return {};
      }
    },
    [isDisabled],
  );

  const textMergedStyle = useCallback<
    (state: PressableStateCallbackType) => StyleProp<TextStyle>
  >(
    ({ pressed }) => [
      styles.textBase,
      getTextStyleByType(type),
      pressed ? styles.buttonTextPressed : undefined,
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
            {Icon && <Icon {...iconProps} color={iconColor(state)} />}
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
    height: 48,
    borderRadius: 16,
  },
  buttonPressed: {
    backgroundColor: colors.purpleDark3,
    borderColor: colors.purpleDark3,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBase: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.TT_Bold,
    color: colors.white,
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
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  secondaryContainer: {
    borderWidth: 1,
    borderColor: colors.grayDark,
    borderRadius: 8,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  secondaryRedContainer: {
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: 8,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  secondaryText: {
    color: colors.purpleDark,
  },
  secondaryRedText: {
    color: colors.red,
  },
  secondaryTextDisabled: {
    color: colors.grayDark,
  },
});

export default Button;
