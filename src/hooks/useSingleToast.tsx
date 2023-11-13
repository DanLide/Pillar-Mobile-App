import {
  useToast,
  ToastType as RNToastType,
} from 'react-native-toast-notifications';
import { useCallback } from 'react';

import { ToastType } from 'src/contexts/types';

const TOAST_DURATION_MS = 3000;

export const getToastDuration = (type?: string) => {
  switch (type) {
    case ToastType.Error:
    case ToastType.ScanError:
    case ToastType.ProductQuantityError:
    case ToastType.ProductUpdateError:
    case ToastType.UpcUpdateError:
    case ToastType.BluetoothDisabled:
    case ToastType.SuggestedItemsError:
    case ToastType.UnitsPerContainerError:
      return 0;
    default:
      return TOAST_DURATION_MS;
  }
};
export const useSingleToast = () => {
  const toast = useToast();

  const showToast = useCallback<RNToastType['show']>(
    (message, toastOptions) => {
      toast.hideAll?.();
      return toast.show?.(message, {
        duration: getToastDuration(toastOptions?.type),
        ...toastOptions,
      });
    },
    [toast],
  );

  const hideAll = () => {
    toast.hideAll?.();
  };

  return { showToast, hideAll };
};
