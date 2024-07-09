import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Button, { ButtonType } from './Button';
import { commonStyles } from 'src/theme';
import { Spacer } from './Spacer';
import { isIPod } from 'src/constants';
import { SafeAreaView } from 'react-native-safe-area-context';

interface IClusterButtonProps {
  style?: StyleProp<ViewStyle>;
  leftTitle: string;
  leftOnPress: () => void;
  leftType?: ButtonType;
  leftDisabled?: boolean;
  leftIsLoading?: boolean;
  rightTitle: string;
  rightOnPress: () => void;
  rightType?: ButtonType;
  rightDisabled?: boolean;
  rightIsLoading?: boolean;
}

export const ButtonCluster = ({
  style,
  leftType = ButtonType.secondary,
  leftTitle,
  leftDisabled,
  leftIsLoading,
  leftOnPress,
  rightType = ButtonType.primary,
  rightTitle,
  rightDisabled,
  rightIsLoading,
  rightOnPress,
}: IClusterButtonProps) => {
  return (
    <SafeAreaView edges={{ bottom: 'maximum' }} style={[styles.root, style]}>
      <Button
        type={leftType}
        title={leftTitle}
        buttonStyle={commonStyles.flex1}
        isLoading={leftIsLoading}
        disabled={leftDisabled}
        onPress={leftOnPress}
      />
      <Spacer w={isIPod ? 8 : 16} />
      <Button
        type={rightType}
        title={rightTitle}
        disabled={rightDisabled}
        isLoading={rightIsLoading}
        buttonStyle={commonStyles.flex1}
        onPress={rightOnPress}
      />
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
});
