import React, { PropsWithChildren, useMemo } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ToastProvider } from 'react-native-toast-notifications';
import { Props as ToastProviderProps } from 'react-native-toast-notifications/lib/typescript/toast-container';
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast';

import { Toast, ToastActionType } from '../components';
import { testIds } from '../helpers';

import { ToastType } from './types';

interface Props extends PropsWithChildren<ToastProviderProps> {
  disableSafeArea?: boolean;
  testID?: string;
}

const TOAST_DURATION_MS = 3000;
const OFFSET_DEFAULT = 16;

export const TOAST_OFFSET_ABOVE_SINGLE_BUTTON = 62;

export const ToastContextProvider: React.FC<Props> = ({
  children,
  offset = 0,
  disableSafeArea,
  testID = 'toastContext',
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
      [ToastType.ScanError]: toast => (
        <Toast
          {...toast}
          type={ToastType.ScanError}
          actionType={ToastActionType.Close}
        />
      ),
      [ToastType.ProductQuantityError]: toast => (
        <Toast
          {...toast}
          type={ToastType.ProductQuantityError}
          actionType={ToastActionType.Close}
          style={styles.productQuantityError}
        />
      ),
      [ToastType.ProductUpdateError]: toast => (
        <Toast
          {...toast}
          type={ToastType.ProductUpdateError}
          actionType={ToastActionType.Retry}
        />
      ),
      [ToastType.UpcUpdateError]: toast => (
        <Toast
          {...toast}
          type={ToastType.UpcUpdateError}
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
      [ToastType.ProductUpdateSuccess]: toast => (
        <Toast
          {...toast}
          type={ToastType.ProductUpdateSuccess}
          actionType={ToastActionType.Close}
        />
      ),
    }),
    [],
  );

  const ContainerComponent = disableSafeArea ? View : SafeAreaView;

  return (
    <ContainerComponent
      testID={testIds.idContainer(testID)}
      style={styles.container}
    >
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
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  productQuantityError: { gap: 10 },
});
