import { Toast, ToastActionType } from 'src/components';
import { ToastType } from '../types';
import { StyleSheet } from 'react-native';
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast';

export const renderType: Record<
  NonNullable<ToastProps['type']>,
  (toast: ToastProps) => JSX.Element
> = {
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
  [ToastType.DetailedScanError]: toast => (
    <Toast
      {...toast}
      type={ToastType.DetailedScanError}
      actionType={ToastActionType.Details}
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
  [ToastType.SpecialOrderError]: toast => (
    <Toast
      {...toast}
      type={ToastType.SpecialOrderError}
      actionType={ToastActionType.Close}
      style={styles.productQuantityError}
    />
  ),
  [ToastType.InvoiceMissingProductPrice]: toast => (
    <Toast
      {...toast}
      actionType={ToastActionType.Details}
      type={ToastType.InvoiceMissingProductPrice}
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
  [ToastType.SuggestedItemsError]: toast => (
    <Toast
      {...toast}
      type={ToastType.SuggestedItemsError}
      actionType={ToastActionType.Close}
    />
  ),
  [ToastType.UnitsPerContainerError]: toast => (
    <Toast
      {...toast}
      type={ToastType.UnitsPerContainerError}
      actionType={ToastActionType.Edit}
    />
  ),
  [ToastType.MinimumValueError]: toast => (
    <Toast
      {...toast}
      type={ToastType.MinimumValueError}
      actionType={ToastActionType.Edit}
    />
  ),
  [ToastType.MaximumValueError]: toast => (
    <Toast
      {...toast}
      type={ToastType.MaximumValueError}
      actionType={ToastActionType.Edit}
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
  [ToastType.SuggestedItemsSuccess]: toast => (
    <Toast
      {...toast}
      type={ToastType.SuggestedItemsSuccess}
      actionType={ToastActionType.Close}
    />
  ),
  [ToastType.CreateInvoiceError]: toast => (
    <Toast
      {...toast}
      type={ToastType.CreateInvoiceError}
      actionType={ToastActionType.Retry}
    />
  ),
  [ToastType.ProfileError]: toast => (
    <Toast
      {...toast}
      type={ToastType.ProfileError}
      actionType={ToastActionType.Return}
    />
  ),
  [ToastType.Retry]: toast => (
    <Toast
      {...toast}
      type={ToastType.Error}
      actionType={ToastActionType.Retry}
    />
  ),
  [ToastType.BluetoothEnabled]: toast => (
    <Toast
      {...toast}
      type={ToastType.BluetoothEnabled}
      actionType={ToastActionType.Close}
    />
  ),
  [ToastType.BluetoothDisabled]: toast => (
    <Toast
      {...toast}
      type={ToastType.BluetoothDisabled}
      actionType={ToastActionType.OpenSettings}
    />
  ),
  [ToastType.LocationDisabled]: toast => (
    <Toast
      {...toast}
      type={ToastType.LocationDisabled}
      actionType={ToastActionType.OpenSettings}
    />
  ),
  [ToastType.SuccessCreateJob]: toast => (
    <Toast
      {...toast}
      type={ToastType.SuccessCreateJob}
      actionType={ToastActionType.Close}
    />
  ),
  [ToastType.UnitsPerContainerReset]: toast => (
    <Toast
      {...toast}
      type={ToastType.UnitsPerContainerReset}
      actionType={ToastActionType.Edit}
    />
  ),
};

const styles = StyleSheet.create({
  productQuantityError: { gap: 10 },
});
