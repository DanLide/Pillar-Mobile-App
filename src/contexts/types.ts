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
  MinimumValueError = 'MinimumValueError',
  MaximumValueError = 'MaximumValueError',
  ProfileError = 'ProfileError',
  SpecialOrderError = 'SpecialOrderError',

  Info = 'Info',
  TooltipInfo = 'TooltipInfo',
  TooltipCreateInvoice = 'TooltipCreateInvoice',
  UnitsPerContainerReset = 'UnitsPerContainerReset',

  Success = 'Success',
  ProductUpdateSuccess = 'ProductUpdateSuccess',
  SuggestedItemsSuccess = 'SuggestedItemsSuccess',
  SuccessCreateJob = 'SuccessCreateJob',

  Retry = 'Retry',

  BluetoothEnabled = 'BluetoothEnabled',
  BluetoothDisabled = 'BluetoothDisabled',

  LocationDisabled = 'LocationDisabled',
}
