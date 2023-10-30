import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StockModel } from 'src/modules/stocksList/stores/StocksStore';

export enum AppNavigator {
  // UnauthStack
  UnauthStack = 'UnauthStack',
  WelcomeScreen = 'WelcomeScreen',
  LoginViaCredentialsScreen = 'LoginViaCredentialsScreen',
  LoginViaPinScreen = 'LoginViaPinScreen',
  UpdateShopLocationScreen = 'UpdateShopLocationScreen',

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
  CreateOrderResultScreen = 'CreateOrderResultScreen',

  //Configure device
  ConfigureDeviceStack = 'ConfigureDeviceStack',
  BaseShopSetupScreen = 'BaseShopSetupScreen',
  ScanShopCodeScreen = 'ScanShopCodeScreen',
  SelectStockLocationsScreen = 'SelectStockLocationsScreen',
  DeviceConfigCompletedScreen = 'DeviceConfigCompletedScreen',
  EnterShopCodeScreen = 'EnterShopCodeScreen',
}

type CameraPermissionScreenParams = {
  nextRoute: keyof (RemoveStackParamList &
    ReturnStackParamList &
    ConfigureDeviceStackParams);
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

export enum LoginType {
  ConfigureShopDevice,
  LoginShopDevice,
}

export type AppStackParamList = {
  [AppNavigator.UnauthStack]: undefined;
  [AppNavigator.HomeStack]: undefined;
};

export type UnauthStackParamsList = {
  [AppNavigator.WelcomeScreen]: undefined;
  [AppNavigator.LoginViaCredentialsScreen]: { type: LoginType } | undefined;
  [AppNavigator.LoginViaPinScreen]: undefined;
  [AppNavigator.UpdateShopLocationScreen]: undefined;
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
  [AppNavigator.ConfigureDeviceStack]: undefined;
};

export type RemoveStackParamList = {
  [AppNavigator.SelectStockScreen]: StockLocationParams | undefined;
  [AppNavigator.RemoveProductsScreen]: undefined;
  [AppNavigator.HowToScanScreen]: undefined;
  [AppNavigator.CameraPermissionScreen]: CameraPermissionScreenParams;
  [AppNavigator.BluetoothPermissionScreen]:
    | BluetoothPermissionScreenParams
    | undefined;
  [AppNavigator.ScannerScreen]: undefined;
  [AppNavigator.ResultScreen]: undefined;
  [AppNavigator.BaseUnlockScreen]: UnlockStockScreenParams;
};

export type ReturnStackParamList = {
  [AppNavigator.SelectStockScreen]: StockLocationParams | undefined;
  [AppNavigator.ReturnProductsScreen]: undefined;
  [AppNavigator.HowToScanScreen]: undefined;
  [AppNavigator.CameraPermissionScreen]: CameraPermissionScreenParams;
  [AppNavigator.BluetoothPermissionScreen]:
    | BluetoothPermissionScreenParams
    | undefined;
  [AppNavigator.ScannerScreen]: undefined;
  [AppNavigator.ResultScreen]: undefined;
  [AppNavigator.BaseUnlockScreen]: UnlockStockScreenParams;
};

export type ManageProductsStackParamList = {
  [AppNavigator.SelectStockScreen]: StockLocationParams | undefined;
  [AppNavigator.ManageProductsScreen]: undefined;
  [AppNavigator.HowToScanScreen]: undefined;
  [AppNavigator.CameraPermissionScreen]: CameraPermissionScreenParams;
  [AppNavigator.BluetoothPermissionScreen]:
    | BluetoothPermissionScreenParams
    | undefined;
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
  [AppNavigator.BluetoothPermissionScreen]:
    | BluetoothPermissionScreenParams
    | undefined;
  [AppNavigator.OrderByStockLocationScreen]: undefined;
  [AppNavigator.SelectStockScreen]: StockLocationParams | undefined;
  [AppNavigator.CreateOrderScreen]: undefined;
  [AppNavigator.CreateOrderResultScreen]: undefined;
  [AppNavigator.ResultScreen]: undefined;
  [AppNavigator.BaseUnlockScreen]: UnlockStockScreenParams;
  [AppNavigator.ScannerScreen]: undefined;
  [AppNavigator.HowToScanScreen]: undefined;
  [AppNavigator.CameraPermissionScreen]: CameraPermissionScreenParams;
};

export type ConfigureDeviceStackParams = {
  [AppNavigator.BaseShopSetupScreen]: undefined;
  [AppNavigator.ScanShopCodeScreen]: undefined;
  [AppNavigator.SelectStockLocationsScreen]: undefined;
  [AppNavigator.DeviceConfigCompletedScreen]: { stocks: StockModel[] };
  [AppNavigator.EnterShopCodeScreen]: undefined;
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
      ConfigureDeviceStackParams &
      OrdersParamsList,
    | AppNavigator.RemoveProductsScreen
    | AppNavigator.ReturnProductsScreen
    | AppNavigator.ManageProductsScreen
    | AppNavigator.CreateOrderScreen
    | AppNavigator.BaseShopSetupScreen
  >,
  StackNavigationProp<HomeStackParamList>
>;

export type BaseResultScreenNavigationProp = StackNavigationProp<
  ReturnStackParamList & RemoveStackParamList,
  AppNavigator.ResultScreen
>;
