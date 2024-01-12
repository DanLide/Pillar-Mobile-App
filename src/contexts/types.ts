export enum ToastType {
  Error = 'Error',
  ScanError = 'ScanError',
  DetailedScanError = 'DetailedScanError',
  ProductQuantityError = 'ProductQuantityError',
  ProductUpdateError = 'ProductUpdateError',
  UpcUpdateError = 'UpcUpdateError',
  SuggestedItemsError = 'SuggestedItemsError',
  CreateInvoiceError = 'CreateInvoiceError',
  InvoiceMissingProductPrice = 'InvoiceMissingProductPrice',
  UnitsPerContainerError = 'UnitsPerContainerError',
  ProfileError = 'ProfileError',

  Info = 'Info',
  TooltipInfo = 'TooltipInfo',
  TooltipCreateInvoice = 'TooltipCreateInvoice',

  Success = 'Success',
  ProductUpdateSuccess = 'ProductUpdateSuccess',
  SuggestedItemsSuccess = 'SuggestedItemsSuccess',

  Retry = 'Retry',

  BluetoothEnabled = 'BluetoothEnabled',
  BluetoothDisabled = 'BluetoothDisabled',

  LocationDisabled = 'LocationDisabled',
}
