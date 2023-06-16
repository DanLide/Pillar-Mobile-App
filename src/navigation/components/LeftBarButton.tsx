import React from 'react';

import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { LeftBarType } from '../types';
import { SVGs, colors } from '../../theme';
import { testIds } from '../../helpers';

interface LeftBarButtonProps {
  leftBarButtonType?: LeftBarType;
  testID?: string;
}

export const LeftBarButton: React.FC<LeftBarButtonProps> = ({
  leftBarButtonType,
  testID = 'leftBarButton',
}) => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const onIconPress = () => {
    switch (leftBarButtonType) {
      case LeftBarType.Back:
      case LeftBarType.Close: {
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
  iconButton: { padding: 14 },
  backArrow: { transform: [{ rotateY: '180deg' }] },
});
