import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { SVGs, colors } from '../../theme';
import { authStore } from '../../stores';

import { RightBarType } from '../types';

interface Props {
  rightBarButtonType?: RightBarType;
  testID?: string;
}

export const RightBarButton: React.FC<Props> = ({
  rightBarButtonType,
  testID = 'rightBarButton',
}) => {
  const onIconPress = () => {
    switch (rightBarButtonType) {
      case RightBarType.Logout:
        authStore.logOut();
        break;
      default:
        break;
    }
  };

  const renderIcon = () => {
    switch (rightBarButtonType) {
      case RightBarType.Logout:
        return <SVGs.LogoutIcon color={colors.white} />;
      default:
        return null;
    }
  };
  return (
    <TouchableOpacity
      testID={`${testID}:button`}
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
