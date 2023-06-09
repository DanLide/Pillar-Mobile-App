import React from 'react';
import { StackNavigationOptions } from '@react-navigation/stack';

import { LeftBarButton, TitleBar, RightBarButton } from '../components';

import { colors } from '../../theme';

export enum LeftBarType {
  Back,
  Close,
}

export enum RightBarType {
  Logout,
}

interface GetScreenOptions
  extends Pick<StackNavigationOptions, 'gestureEnabled'> {
  title: string;
  leftBarButtonType?: LeftBarType;
  rightBarButtonType?: RightBarType;
}

export const getScreenOptions = ({
  title,
  leftBarButtonType,
  rightBarButtonType,
  gestureEnabled,
}: GetScreenOptions): StackNavigationOptions => ({
  headerTitle: () => <TitleBar title={title} />,
  headerLeft: () => <LeftBarButton leftBarButtonType={leftBarButtonType} />,
  headerRight: () => <RightBarButton rightBarButtonType={rightBarButtonType} />,
  headerStyle: { backgroundColor: colors.purple },
  gestureEnabled,
});
