import { colors, fonts } from 'src/theme';
import { LeftBarButton } from './components';
import { LeftBarType } from './types';
import { StackNavigationOptions } from '@react-navigation/stack';

export const DEFAULT_STACK_OPTIONS: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.purple,
  },
  headerTitleStyle: {
    fontSize: 19,
    lineHeight: 26,
    fontFamily: fonts.TT_Bold,
    color: colors.white,
  },
  headerLeft: () => <LeftBarButton leftBarButtonType={LeftBarType.Back} />,
};
