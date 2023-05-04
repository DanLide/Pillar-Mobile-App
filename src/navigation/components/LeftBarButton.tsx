import React from 'react';

import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { LeftBarType } from '../helpers';
import { AppNavigator } from '..';
import { SVGs, colors } from '../../theme';

interface LeftBarButtonProps {
  leftBarButtonType?: LeftBarType;
}

export const LeftBarButton: React.FC<LeftBarButtonProps> = ({
  leftBarButtonType,
}) => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const onIconPress = () => {
    switch (leftBarButtonType) {
      case LeftBarType.Back: {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
        break;
      }

      case LeftBarType.Close:
        navigation.reset({
          index: 0,
          routes: [{ name: AppNavigator.HomeScreen }],
        });
        break;

      default:
        break;
    }
  };

  const renderIcon = () => {
    switch (leftBarButtonType) {
      case LeftBarType.Back:
        return (
          <SVGs.ChevronIcon
            style={styles.backArrow}
            color={colors.white}
            width={11}
            height={20}
          />
        );
      case LeftBarType.Close:
        return <SVGs.CloseIcon color={colors.white} />;

      default:
        return null;
    }
  };

  return (
    <TouchableOpacity style={styles.iconButton} onPress={onIconPress}>
      {renderIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: { padding: 14 },
  backArrow: { transform: [{ rotateY: '180deg' }] },
});
