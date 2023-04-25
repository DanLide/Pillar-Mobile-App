import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import { SVGs, colors, fonts } from '../../theme';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';

import { AppNavigator } from '..';

export enum LeftHeaderType {
  Back,
  Close,
}

interface GetScreenOptions {
  title: string;
  leftHeaderType?: LeftHeaderType;

  leftHeaderAction?: () => void;
}

interface HeaderLeftProps {
  leftHeaderType?: LeftHeaderType;
  leftHeaderAction?: () => void;
}

const HeaderLeft: React.FC<HeaderLeftProps> = ({
  leftHeaderType,
  leftHeaderAction,
}) => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const onIconPress = () => {
    if (leftHeaderAction) {
      leftHeaderAction();
    } else {
      switch (leftHeaderType) {
        case LeftHeaderType.Back: {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
          break;
        }

        case LeftHeaderType.Close:
          navigation.reset({
            index: 0,
            routes: [{ name: AppNavigator.HomeScreen }],
          });
          break;

        default:
          break;
      }
    }
  };

  const renderIcon = () => {
    switch (leftHeaderType) {
      case LeftHeaderType.Back:
        return (
          <SVGs.ChevronIcon
            style={styles.backArrow}
            color={colors.white}
            width={11}
            height={20}
          />
        );
      case LeftHeaderType.Close:
        return <SVGs.CloseIcon />;

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

export const getScreenOptions = (params: GetScreenOptions) => ({
  headerTitle: () => <Text style={styles.title}>{params.title}</Text>,
  headerLeft: () => (
    <HeaderLeft
      leftHeaderAction={params.leftHeaderAction}
      leftHeaderType={params.leftHeaderType}
    />
  ),
  headerStyle: {
    backgroundColor: colors.purple,
  },
});

const styles = StyleSheet.create({
  title: {
    fontSize: 19,
    lineHeight: 26,
    fontFamily: fonts.TT_Bold,
    color: colors.white,
  },
  iconButton: { padding: 14 },
  backArrow: { transform: [{ rotateY: '180deg' }] },
});
