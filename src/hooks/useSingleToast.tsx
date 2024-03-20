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
    case ToastType.SpecialOrderError:
    case ToastType.ProductUpdateError:
    case ToastType.UpcUpdateError:
    case ToastType.BluetoothDisabled:
    case ToastType.LocationDisabled:
    case ToastType.SuggestedItemsError:
      return 0;
    case ToastType.DetailedScanError:
      return 15000;
    default:
      return TOAST_DURATION_MS;
  }
};
export const useSingleToast = () => {
  const { show, hideAll } = useToast();
  const toastInitialized = show && hideAll;

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
