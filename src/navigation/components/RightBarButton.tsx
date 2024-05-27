import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { SVGs, colors } from '../../theme';
import { authStore } from '../../stores';
import { AppNavigator, RightBarType } from '../types';
import { testIds } from '../../helpers';

interface Props {
  rightBarButtonType?: RightBarType;
  testID?: string;
  onPress?: () => void;
}

export const RightBarButton: React.FC<Props> = ({
  rightBarButtonType,
  testID = 'rightBarButton',
  onPress,
}) => {
  const navigation = useNavigation();

  const onIconPress = () => {
    if (onPress) {
      onPress();
      return;
    }

    switch (rightBarButtonType) {
      case RightBarType.Logout:
        authStore.logOut();
        break;
      case RightBarType.QuestionMark:
        navigation.navigate(AppNavigator.HowToScanScreen);
        break;
      case RightBarType.Close: {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
        break;
      }
      default:
        break;
    }
  };

  const renderIcon = () => {
    switch (rightBarButtonType) {
      case RightBarType.Logout:
        return <SVGs.LogoutIcon color={colors.white} />;
      case RightBarType.QuestionMark:
        return <SVGs.QuestionMark color={colors.white} />;
      case RightBarType.Close:
        return <SVGs.CloseIcon color={colors.white} />;
      default:
        return null;
    }
  };
  return (
    <TouchableOpacity
      testID={testIds.idButton(testID)}
      style={styles.iconButton}
      onPress={onIconPress}
    >
      {renderIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 14,
  },
});
