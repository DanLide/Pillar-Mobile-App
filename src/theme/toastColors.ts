import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast';
import { ToastType } from '../contexts/types';

import { colors } from './colors';

export const toastColors: Record<
  NonNullable<ToastProps['type']>,
  { primary: string; secondary: string; action?: string }
> = {
  [ToastType.Retry]: {
    primary: colors.red,
    secondary: colors.redLight,
    action: colors.redDark,
  },
  [ToastType.CreateInvoiceError]: {
    primary: colors.red,
    secondary: colors.redLight,
    action: colors.redDark,
  },
  [ToastType.Error]: {
    primary: colors.red,
    secondary: colors.redLight,
    action: colors.redDark,
  },
  [ToastType.ProductQuantityError]: {
    primary: colors.red,
    secondary: colors.redLight,
    action: colors.redDark,
  },
  [ToastType.ScanError]: {
    primary: colors.red,
    secondary: colors.redLight,
    action: colors.redDark,
  },
  [ToastType.ProductUpdateError]: {
    primary: colors.red,
    secondary: colors.redLight,
    action: colors.redDark,
  },
  [ToastType.UpcUpdateError]: {
    primary: colors.red,
    secondary: colors.redLight,
    action: colors.redDark,
  },
  [ToastType.SuggestedItemsError]: {
    primary: colors.red,
    secondary: colors.redLight,
    action: colors.redDark,
  },

  [ToastType.Info]: {
    primary: colors.purple,
    secondary: colors.magnolia,
    action: colors.purpleDark,
  },
  [ToastType.TooltipInfo]: {
    primary: colors.purple,
    secondary: colors.background,
    action: colors.purpleDark,
  },
  [ToastType.TooltipCreateInvoice]: {
    primary: colors.purple,
    secondary: colors.background,
    action: colors.purpleDark,
  },

  [ToastType.Success]: {
    primary: colors.green2,
    secondary: colors.greenLight,
    action: colors.green,
  },
  [ToastType.ProductUpdateSuccess]: {
    primary: colors.green3,
    secondary: colors.greenLight,
    action: colors.green4,
  },
  [ToastType.SuggestedItemsSuccess]: {
    primary: colors.green3,
    secondary: colors.white3,
    action: colors.green4,
  },

  [ToastType.BluetoothEnabled]: {
    primary: colors.green3,
    secondary: colors.white3,
    action: colors.green4,
  },
  [ToastType.BluetoothDisabled]: {
    primary: colors.green3,
    secondary: colors.white3,
    action: colors.redDark,
  },
};
