import React, { PropsWithChildren, useMemo } from 'react';
import { ToastProvider } from 'react-native-toast-notifications';
import { Props as ToastProviderProps } from 'react-native-toast-notifications/lib/typescript/toast-container';
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast';
import { Toast } from '../components';
import { ToastIconType, ToastActionType } from '../components/Toast';

type Props = PropsWithChildren<ToastProviderProps>;

export const ToastContextProvider: React.FC<Props> = ({
  children,
  ...props
}) => {
  const renderType = useMemo<
    Record<NonNullable<ToastProps['type']>, (toast: ToastProps) => JSX.Element>
  >(
    () => ({
      danger: toast => (
        <Toast
          iconType={ToastIconType.Error}
          actionType={ToastActionType.Close}
          {...toast}
        />
      ),
      normal: toast => (
        <Toast
          iconType={ToastIconType.Info}
          actionType={ToastActionType.Close}
          {...toast}
        />
      ),
      success: toast => (
        <Toast
          iconType={ToastIconType.Success}
          actionType={ToastActionType.Close}
          {...toast}
        />
      ),
    }),
    [],
  );

  return (
    <ToastProvider swipeEnabled={false} renderType={renderType} {...props}>
      {children}
    </ToastProvider>
  );
};
