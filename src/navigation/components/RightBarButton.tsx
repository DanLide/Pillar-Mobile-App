import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { RightBarType } from '../helpers/getScreenOptions';
import { SVGs, colors } from '../../theme';
import { authStore } from '../../stores';

interface Props {
    rightBarButtonType?: RightBarType;
}

export const RightBarButton: React.FC<Props> = ({ rightBarButtonType }) => {
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
    <TouchableOpacity style={styles.iconButton} onPress={onIconPress}>
      {renderIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 14,
  },
});
