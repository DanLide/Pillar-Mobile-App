import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Button, { ButtonType } from './Button';
import { commonStyles } from 'src/theme';
import { Spacer } from './Spacer';
import { isIPod } from 'src/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';

interface IClusterButtonProps {
  style?: StyleProp<ViewStyle>;
  showLeftButton?: boolean;
  showRightButton?: boolean;
  leftTitle: string;
  leftOnPress?: () => void;
  leftIcon?: React.NamedExoticComponent<SvgProps>;
  leftIconProps?: SvgProps;
  leftType?: ButtonType;
  leftDisabled?: boolean;
  leftIsLoading?: boolean;
  rightTitle: string;
  rightOnPress?: () => void;
  rightType?: ButtonType;
  rightDisabled?: boolean;
  rightIsLoading?: boolean;
  withoutHorizontalPadding?: boolean;
}

export const ButtonCluster = ({
  style,
  leftType = ButtonType.secondary,
  leftTitle,
  leftDisabled,
  leftIsLoading,
  leftOnPress,
  leftIcon,
  leftIconProps,
  showLeftButton = true,
  rightType = ButtonType.primary,
  rightTitle,
  rightDisabled,
  rightIsLoading,
  rightOnPress,
  showRightButton = true,
}: IClusterButtonProps) => {
  const isSingleButton = !showLeftButton || !showRightButton;
  return (
    <SafeAreaView
      edges={{ bottom: 'maximum' }}
      style={[styles.root, isSingleButton && styles.horizontal16, style]}
    >
      {showLeftButton && (
        <Button
          type={leftType}
          title={leftTitle}
          icon={leftIcon}
          iconProps={leftIconProps}
          buttonStyle={commonStyles.flex1}
          isLoading={leftIsLoading}
          disabled={leftDisabled}
          onPress={leftOnPress}
          accessibilityLabel={`${leftTitle}`}
        />
      )}
      {!isSingleButton && <Spacer w={isIPod ? 8 : 16} />}
      {showRightButton && (
        <Button
          type={rightType}
          title={rightTitle}
          disabled={rightDisabled}
          isLoading={rightIsLoading}
          buttonStyle={commonStyles.flex1}
          onPress={rightOnPress}
          accessibilityLabel={`${rightTitle}`}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    paddingHorizontal: isIPod ? 8 : 16,
    paddingTop: isIPod ? 8 : 16,
    paddingBottom: 16,
  },
  horizontal16: {
    paddingHorizontal: 16,
  },
  horizontal0: { paddingHorizontal: 0 },
});
