import React from 'react';

import { LeftBarButton, TitleBar, RightBarButton } from '../components';

import { colors } from '../../theme/colors';

import { LeftBarType, RightBarType } from '../types';

interface GetScreenOptions {
  title: string;
  leftBarButtonType?: LeftBarType;
  rightBarButtonType?: RightBarType;
}

export const getScreenOptions = (params: GetScreenOptions) => ({
  headerTitle: () => <TitleBar title={params.title} />,
  headerLeft: () => (
    <LeftBarButton leftBarButtonType={params.leftBarButtonType} />
  ),
  headerRight: () => (
    <RightBarButton rightBarButtonType={params.rightBarButtonType} />
  ),
  headerStyle: {
    backgroundColor: colors.purple,
  },
});
