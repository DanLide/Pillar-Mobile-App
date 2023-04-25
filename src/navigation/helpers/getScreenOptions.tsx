import React from 'react';

import { LeftBarButton, TitleBar, RightBarButton } from '../components';

import { colors } from '../../theme';

export enum LeftBarType {
  Back,
  Close,
}

interface GetScreenOptions {
  title: string;
  leftBarButtonType?: LeftBarType;

  leftBarButtonAction?: () => void;
}

export const getScreenOptions = (params: GetScreenOptions) => ({
  headerTitle: () => <TitleBar title={params.title} />,
  headerLeft: () => (
    <LeftBarButton
      leftBarButtonAction={params.leftBarButtonAction}
      leftBarButtonType={params.leftBarButtonType}
    />
  ),
  headerRight: () => <RightBarButton />,
  headerStyle: {
    backgroundColor: colors.purple,
  },
});
