import { useToast, ToastType } from 'react-native-toast-notifications';
import { useCallback } from 'react';

export const useSingleToast = () => {
  const toast = useToast();

  const showToast = useCallback<ToastType['show']>(
    (...args) => {
      toast.hideAll?.();
      return toast.show?.(...args);
    },
    [toast],
  );

  return { showToast };
};
