import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StockModel } from 'src/modules/stocksList/stores/StocksStore';
import { OrderType } from 'src/constants/common.enum';
import { ProductModalType } from 'src/modules/productModal';
import { NativeStackScreenProps } from 'react-native-screens/native-stack';

export enum AppNavigator {
  // UnauthStack
  UnauthStack = 'UnauthStack',
  WelcomeScreen = 'WelcomeScreen',
  LoginViaCredentialsScreen = 'LoginViaCredentialsScreen',
  LoginViaPinScreen = 'LoginViaPinScreen',
  UpdateShopLocationScreen = 'UpdateShopLocationScreen',
  CreatePinScreen = 'CreatePinScreen',
  LoginWithPinScreen = 'LoginWithPinScreen',

  // HomeStack
  HomeStack = 'HomeStack',
  HomeScreen = 'HomeScreen',
  TermsScreen = 'TermsScreen',
  LanguageSelectScreen = 'LanguageSelectScreen',
  SelectSSOScreen = 'SelectSSOScreen',
  Drawer = 'Drawer',
  Settings = 'Settings',
  AlphaAlertScreen = 'AlphaAlertScreen',

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
  ReceiveBackorderScreen = 'ReceiveBackorderScreen',
  BackorderScannerScreen = 'BackorderScannerScreen',
  BackOrderResultScreen = 'BackOrderResultScreen',
}

type ScannerParams = { modalType?: ProductModalType };

type CameraPermissionScreenParams = {
  nextRoute: keyof (RemoveStackParamList &
    ReturnStackParamList &
    ConfigureDeviceStackParams);
} & ScannerParams;

type CreateOrderParams = {
  orderType?: OrderType;
  orderId?: string;
};

type BluetoothPermissionScreenParams = {
  nextRoute: AppNavigator.SelectStockScreen | AppNavigator.OrderDetailsScreen;
} & CreateOrderParams;

export type StockLocationParams = {
  succeedBluetooth?: boolean;
} & CreateOrderParams;

type SelectSSOScreenParams = {
  isUpdating?: boolean;
};

export type UnlockStockNextScreenParams =
  | AppNavigator.ReturnProductsScreen
  | AppNavigator.RemoveProductsScreen
  | AppNavigator.CreateOrderScreen
  | AppNavigator.ManageProductsScreen
  | AppNavigator.OrderByStockLocationScreen;

type UnlockStockScreenParams = {
  title?: string;
  masterlockId: string;
  nextNavigationGoBack?: boolean;
  nextScreen?: UnlockStockNextScreenParams;
};

type PinScreenParams = {
  username: string;
  b2cUserId: string;
  prevPin?: string;
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
  [AppNavigator.CreatePinScreen]: PinScreenParams;
  [AppNavigator.LoginWithPinScreen]: PinScreenParams;
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
  [AppNavigator.Settings]: undefined;
  [AppNavigator.AlphaAlertScreen]: undefined;
};

export type RemoveStackParamList = {
  [AppNavigator.SelectStockScreen]: StockLocationParams | undefined;
  [AppNavigator.RemoveProductsScreen]: undefined;
  [AppNavigator.HowToScanScreen]: undefined;
  [AppNavigator.CameraPermissionScreen]: CameraPermissionScreenParams;
  [AppNavigator.BluetoothPermissionScreen]:
    | BluetoothPermissionScreenParams
    | undefined;
  [AppNavigator.ScannerScreen]: ScannerParams | undefined;
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
  [AppNavigator.ScannerScreen]: ScannerParams | undefined;
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
  [AppNavigator.ScannerScreen]: ScannerParams | undefined;
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
  [AppNavigator.CreateOrderScreen]: CreateOrderParams | undefined;
  [AppNavigator.CreateOrderResultScreen]: CreateOrderParams | undefined;
  [AppNavigator.ResultScreen]: undefined;
  [AppNavigator.BaseUnlockScreen]: UnlockStockScreenParams;
  [AppNavigator.ScannerScreen]: ScannerParams | undefined;
  [AppNavigator.HowToScanScreen]: undefined;
  [AppNavigator.CameraPermissionScreen]: CameraPermissionScreenParams;
  [AppNavigator.ReceiveBackorderScreen]: undefined;
  [AppNavigator.BackorderScannerScreen]: undefined;
  [AppNavigator.BackOrderResultScreen]: undefined;
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

export type CameraPermissionScreenProps = NativeStackScreenProps<
  RemoveStackParamList &
    ReturnStackParamList &
    ManageProductsStackParamList &
    OrdersParamsList,
  AppNavigator.CameraPermissionScreen
>;

export type BluetoothPermissionScreenProps = NativeStackScreenProps<
  RemoveStackParamList &
    ReturnStackParamList &
    ManageProductsStackParamList &
    OrdersParamsList,
  AppNavigator.BluetoothPermissionScreen
>;
