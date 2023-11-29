import React from 'react';
import { ViewStyle } from 'react-native';

import { LeftBarButton, RightBarButton, TitleBar } from '../components';

import { colors } from '../../theme/colors';

import { LeftBarType, RightBarType } from '../types';

interface GetScreenOptions {
  title: string;
  leftBarButtonType?: LeftBarType;
  rightBarButtonType?: RightBarType;
  style?: ViewStyle;
  leftBarButtonAction?: () => void;
  rightBarButtonAction?: () => void;
}

export const getScreenOptions = (params: GetScreenOptions) => ({
  headerTitle: () => <TitleBar title={params.title} />,
  headerLeft: () => (
    <LeftBarButton
      onPress={params.leftBarButtonAction}
      leftBarButtonType={params.leftBarButtonType}
    />
  ),
  headerRight: () => (
    <RightBarButton
      onPress={params.rightBarButtonAction}
      rightBarButtonType={params.rightBarButtonType}
    />
  ),
  headerStyle: {
    backgroundColor: colors.purple,
    ...params.style,
  },
});
