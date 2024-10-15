import { ViewStyle } from 'react-native';

import { LeftBarButton, RightBarButton, TitleBar } from '../components';

import { colors } from '../../theme/colors';

import { LeftBarType, RightBarType } from '../types';

interface GetScreenOptions {
  title: string;
  leftBarButtonTestId?: string;
  leftBarButtonType?: LeftBarType;
  rightBarButtonTestId?: string;
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
      testID={params.leftBarButtonTestId}
    />
  ),
  headerRight: () => (
    <RightBarButton
      onPress={params.rightBarButtonAction}
      rightBarButtonType={params.rightBarButtonType}
      testID={params.rightBarButtonTestId}
    />
  ),
  headerStyle: {
    backgroundColor: colors.purple,
    ...params.style,
  },
});
