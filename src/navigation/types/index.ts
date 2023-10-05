import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';

export enum AppNavigator {
  // UnauthStack
  UnauthStack = 'UnauthStack',
  WelcomeScreen = 'WelcomeScreen',
  LoginViaCredentialsScreen = 'LoginViaCredentialsScreen',

  // HomeStack
  HomeStack = 'HomeStack',
  HomeScreen = 'HomeScreen',
  TermsScreen = 'TermsScreen',
  LanguageSelectScreen = 'LanguageSelectScreen',
  SelectSSOScreen = 'SelectSSOScreen',
  Drawer = 'Drawer',

  // Shared screens
  SelectStockScreen = 'SelectStockScreen',
  HowToScanScreen = 'HowToScanScreen',
  CameraPermissionScreen = 'CameraPermissionScreen',
  ScannerScreen = 'ScannerScreen',
  ResultScreen = 'ResultScreen',
  BaseUnlockScreen = 'BaseUnlockScreen',
  BluetoothPermissionScreen = 'BluetoothPermissionScreen',

  // RemoveProductsStack
  RemoveProductsStack = 'RemoveProductsStack',
  RemoveProductsScreen = 'RemoveProductsScreen',

  // ReturnProductsStack
  ReturnProductsStack = 'ReturnProductsStack',
  ReturnProductsScreen = 'ReturnProductsScreen',

  // ManageProductsStack
  ManageProductsStack = 'ManageProductsStack',
  ManageProductsScreen = 'ManageProductsScreen',

  // CreateInvoiceStack
  CreateInvoiceStack = 'CreateInvoiceStack',
  SelectProductJob = 'SelectProductJob',
  ProductsScreen = 'ProductsScreen',
  CreateInvoiceProductsScreen = 'CreateInvoiceProductsScreen',

  // Orders
  OrdersStack = 'OrdersStack',
  OrdersScreen = 'OrdersScreen',
  OrderDetailsScreen = 'OrderDetailsScreen',
  OrderByStockLocationScreen = 'OrderByStockLocationScreen',
  CreateOrderScreen = 'CreateOrderScreen',
}

type CameraPermissionScreenParams = {
  nextRoute: keyof (RemoveStackParamList & ReturnStackParamList);
};

type BluetoothPermissionScreenParams = {
  nextRoute: AppNavigator.SelectStockScreen;
};

type StockLocationParams = { succeedBluetooth?: boolean };

type SelectSSOScreenParams = {
  isUpdating?: boolean;
};

type UnlockStockScreenParams = {
  title?: string;
  masterlockId: string;
  nextScreen?:
    | AppNavigator.ReturnProductsScreen
    | AppNavigator.RemoveProductsScreen
    | AppNavigator.CreateOrderScreen
    | AppNavigator.ManageProductsScreen;
};

export type AppStackParamList = {
  [AppNavigator.UnauthStack]: undefined;
  [AppNavigator.HomeStack]: undefined;
};

export type UnauthStackParamsList = {
  [AppNavigator.WelcomeScreen]: undefined;
  [AppNavigator.LoginViaCredentialsScreen]: undefined;
};

export type HomeStackParamList = {
  [AppNavigator.HomeScreen]: undefined;
  [AppNavigator.Drawer]: undefined;
  [AppNavigator.TermsScreen]: undefined;
  [AppNavigator.LanguageSelectScreen]: undefined;
  [AppNavigator.SelectSSOScreen]: SelectSSOScreenParams;
  [AppNavigator.RemoveProductsStack]: undefined;
  [AppNavigator.ReturnProductsStack]: undefined;
  [AppNavigator.ManageProductsStack]: undefined;
  [AppNavigator.CreateInvoiceStack]: undefined;
  [AppNavigator.OrdersStack]: undefined;
};

export type RemoveStackParamList = {
  [AppNavigator.SelectStockScreen]: StockLocationParams;
  [AppNavigator.RemoveProductsScreen]: undefined;
  [AppNavigator.HowToScanScreen]: undefined;
  [AppNavigator.CameraPermissionScreen]: CameraPermissionScreenParams;
  [AppNavigator.BluetoothPermissionScreen]: BluetoothPermissionScreenParams;
  [AppNavigator.ScannerScreen]: undefined;
  [AppNavigator.ResultScreen]: undefined;
  [AppNavigator.BaseUnlockScreen]: UnlockStockScreenParams;
};

export type ReturnStackParamList = {
  [AppNavigator.SelectStockScreen]: StockLocationParams;
  [AppNavigator.ReturnProductsScreen]: undefined;
  [AppNavigator.HowToScanScreen]: undefined;
  [AppNavigator.CameraPermissionScreen]: CameraPermissionScreenParams;
  [AppNavigator.BluetoothPermissionScreen]: BluetoothPermissionScreenParams;
  [AppNavigator.ScannerScreen]: undefined;
  [AppNavigator.ResultScreen]: undefined;
  [AppNavigator.BaseUnlockScreen]: UnlockStockScreenParams;
};

export type ManageProductsStackParamList = {
  [AppNavigator.SelectStockScreen]: StockLocationParams;
  [AppNavigator.ManageProductsScreen]: undefined;
  [AppNavigator.HowToScanScreen]: undefined;
  [AppNavigator.CameraPermissionScreen]: CameraPermissionScreenParams;
  [AppNavigator.BluetoothPermissionScreen]: BluetoothPermissionScreenParams;
  [AppNavigator.ScannerScreen]: undefined;
  [AppNavigator.BaseUnlockScreen]: UnlockStockScreenParams;
};

export type CreateInvoiceParamList = {
  [AppNavigator.SelectProductJob]: undefined;
  [AppNavigator.ScannerScreen]: undefined;
  [AppNavigator.ResultScreen]: undefined;
  [AppNavigator.CreateInvoiceProductsScreen]: undefined;
  [AppNavigator.CameraPermissionScreen]: CameraPermissionScreenParams;
  [AppNavigator.HowToScanScreen]: undefined;
};

export type OrderDetailsScreenParams = { orderId: string };

export type OrdersParamsList = {
  [AppNavigator.OrdersScreen]: undefined;
  [AppNavigator.OrderDetailsScreen]: OrderDetailsScreenParams;
  [AppNavigator.BluetoothPermissionScreen]: BluetoothPermissionScreenParams;
  [AppNavigator.OrderByStockLocationScreen]: undefined;
  [AppNavigator.SelectStockScreen]: StockLocationParams;
  [AppNavigator.CreateOrderScreen]: undefined;
  [AppNavigator.ResultScreen]: undefined;
  [AppNavigator.BaseUnlockScreen]: UnlockStockScreenParams;
  [AppNavigator.ScannerScreen]: undefined;
  [AppNavigator.HowToScanScreen]: undefined;
  [AppNavigator.CameraPermissionScreen]: CameraPermissionScreenParams;
};

export enum LeftBarType {
  Back,
  Close,
  Drawer,
}

export enum RightBarType {
  Logout,
  QuestionMark,
}

export type BaseProductsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<
    ReturnStackParamList &
      RemoveStackParamList &
      ManageProductsStackParamList &
      OrdersParamsList,
    | AppNavigator.RemoveProductsScreen
    | AppNavigator.ReturnProductsScreen
    | AppNavigator.ManageProductsScreen
    | AppNavigator.CreateOrderScreen
  >,
  StackNavigationProp<HomeStackParamList>
>;

export type BaseResultScreenNavigationProp = StackNavigationProp<
  ReturnStackParamList & RemoveStackParamList,
  AppNavigator.ResultScreen
>;
