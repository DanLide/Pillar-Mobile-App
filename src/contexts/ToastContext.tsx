import React, { PropsWithChildren, useMemo } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ToastProvider } from 'react-native-toast-notifications';
import { Props as ToastProviderProps } from 'react-native-toast-notifications/lib/typescript/toast-container';
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast';

import { Toast, ToastActionType } from '../components';

export enum ToastType {
  Error = 'Error',
  Info = 'Info',
  Success = 'Success',
  ScanError = 'ScanError',
}

type Props = PropsWithChildren<ToastProviderProps>;

const TOAST_DURATION_MS = 3000;
const OFFSET_DEFAULT = 16;

export const ToastContextProvider: React.FC<Props> = ({
  children,
  offset = 0,
  ...props
}) => {
  const renderType = useMemo<
    Record<NonNullable<ToastProps['type']>, (toast: ToastProps) => JSX.Element>
  >(
    () => ({
      [ToastType.Error]: toast => (
        <Toast
          {...toast}
          type={ToastType.Error}
          actionType={ToastActionType.Close}
        />
      ),
      [ToastType.Info]: toast => (
        <Toast
          {...toast}
          type={ToastType.Info}
          actionType={ToastActionType.Close}
        />
      ),
      [ToastType.Success]: toast => (
        <Toast
          {...toast}
          type={ToastType.Success}
          actionType={ToastActionType.Close}
        />
      ),
      [ToastType.ScanError]: toast => (
        <Toast
          {...toast}
          type={ToastType.ScanError}
          actionType={ToastActionType.Close}
        />
      ),
    }),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <ToastProvider
          duration={TOAST_DURATION_MS}
          animationType="zoom-in"
          swipeEnabled={false}
          renderType={renderType}
          offset={OFFSET_DEFAULT + offset}
          {...props}
        >
          {children}
        </ToastProvider>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
