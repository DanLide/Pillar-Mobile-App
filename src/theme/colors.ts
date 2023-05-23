import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast';
import { ToastType } from '../contexts';

export const colors = {
  purpleDark: '#7634BC',
  purple: '#9657D9',
  purpleLight: '#DBC2F9',
  purpleDisabled: '#C7A8E9',
  purpleWithOpacity: 'rgba(150,87,217,0.5)',
  magnolia: '#F6EFFE',
  white: '#FFFFFF',
  white2: '#F6EFFE',
  redDark: '#B20E18',
  red: '#E02E3A',
  redSemiLight: '#C95100',
  redLight: '#FEEFF0',
  black: '#000000',
  blackWidthOpacity: 'rgba(0, 0, 0, 0.3)',
  blackSemiLight: '#323237',
  blackLight: '#424247',
  grayDark: '#95959E',
  gray: '#E1E1E8',
  grayLight: '#F8F8FA',
  transparent: 'transparent',
  green: '#0A672F',
  greenLight: '#D9FAE6',
  green2: '#00FD92',
  yellow: '#FFC156',
  blue: '#1A51C2',
  blueLight: '#E8F3FF',
  pink: '#D130A1',
  pinkLight: '#FFEDFB',
};

export const toastColors: Record<
  NonNullable<ToastProps['type']>,
  { primary: string; secondary: string; action?: string }
> = {
  [ToastType.Error]: {
    primary: colors.red,
    secondary: colors.redLight,
    action: colors.redDark,
  },
  [ToastType.Info]: {
    primary: colors.purple,
    secondary: colors.magnolia,
    action: colors.purpleDark,
  },
  [ToastType.Success]: {
    primary: colors.green2,
    secondary: colors.greenLight,
    action: colors.green,
  },
  [ToastType.ScanError]: {
    primary: colors.red,
    secondary: colors.redLight,
    action: colors.redDark,
  },
};
