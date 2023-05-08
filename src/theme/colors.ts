import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast';
import { ToastType } from '../contexts';

export const colors = {
  purpleDark: '#7634BC',
  purple: '#9657D9',
  purpleLight: '#DBC2F9',
  magnolia: '#F6EFFE',
  white: '#FFFFFF',
  redDark: '#B20E18',
  red: '#E02E3A',
  redLight: '#FEEFF0',
  greenDark: '#2A854E',
  green: '#51C981',
  greenLight: '#F2FFF7',
  black: '#000000',
  blackSemiLight: '#323237',
  blackLight: '#424247',
  grayDark: '#95959E',
  gray: '#E1E1E8',
  grayLight: '#F8F8FA',
  transparent: 'transparent',
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
    primary: colors.green,
    secondary: colors.greenLight,
    action: colors.greenDark,
  },
};
