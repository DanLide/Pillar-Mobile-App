import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast';
import { ToastType } from '../contexts/types';

import { colors } from './colors';

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
  [ToastType.ProductQuantityError]: {
    primary: colors.red,
    secondary: colors.redLight,
    action: colors.redDark,
  },
  [ToastType.TooltipInfo]: {
    primary: colors.purple,
    secondary: colors.background,
    action: colors.purpleDark,
  },
};
