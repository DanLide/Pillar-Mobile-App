import {
  useToast,
  ToastType as RNToastType,
} from 'react-native-toast-notifications';
import { useCallback } from 'react';

import { ToastType } from 'src/contexts/types';
import { useBottomInsert } from './useBottomInsert';
import { ToastOptions } from 'react-native-toast-notifications/lib/typescript/toast';

const TOAST_DURATION_MS = 3000;
const OFFSET_ABOVE_BUTTONS = 68;

export const getToastDuration = (type?: string) => {
  switch (type) {
    case ToastType.Error:
    case ToastType.ScanError:
    case ToastType.ProductQuantityError:
    case ToastType.SpecialOrderError:
    case ToastType.ProductUpdateError:
    case ToastType.UpcUpdateError:
    case ToastType.BluetoothDisabled:
    case ToastType.LocationDisabled:
    case ToastType.SuggestedItemsError:
    case ToastType.UnitsPerContainerReset:
      return 0;
    case ToastType.DetailedScanError:
      return 2000;
    default:
      return TOAST_DURATION_MS;
  }
};

export const useToastMessage = () => {
  const { show, hideAll } = useToast();
  const toastInitialized = !!show && hideAll;
  const bottomDefault = useBottomInsert(0);
  const bottomIndent = bottomDefault > 16 ? bottomDefault - 16 : bottomDefault;
  const showToast = useCallback(
    (
      message: string | JSX.Element,
      {
        offsetType,
        style,
        ...toastOptions
      }: ToastOptions & { offsetType?: 'aboveButtons' },
    ) => {
      const marginBottom =
        bottomIndent +
        (offsetType === 'aboveButtons' ? OFFSET_ABOVE_BUTTONS : 0);
      hideAll?.();
      return show?.(message, {
        duration: getToastDuration(toastOptions?.type),
        style: [{ marginBottom }, style],
        ...toastOptions,
      });
    },
    [show, hideAll, bottomIndent],
  );

  return { showToast, hideAll, toastInitialized };
};

/**
 *
 * @deprecated This hook is deprecated, please use useToastMessage along with the new global toast provider instead
 */
export const useSingleToast = () => {
  const { show, hideAll } = useToast();
  const toastInitialized = !!show && hideAll;

  const showToast = useCallback<RNToastType['show']>(
    (message, toastOptions) => {
      hideAll?.();
      return show?.(message, {
        duration: getToastDuration(toastOptions?.type),
        ...toastOptions,
      });
    },
    [show, hideAll],
  );

  return { showToast, hideAll, toastInitialized };
};
