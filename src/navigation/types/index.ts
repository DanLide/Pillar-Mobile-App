import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';

export enum AppNavigator {
  LoginScreen = 'LoginScreen',

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
}

type CameraPermissionScreenParams = {
  nextRoute: keyof (RemoveStackParamList & ReturnStackParamList);
};

export type AppStackParamList = {
  [AppNavigator.LoginScreen]: undefined;
  [AppNavigator.HomeStack]: undefined;
};

export type HomeStackParamList = {
  [AppNavigator.HomeScreen]: undefined;
  [AppNavigator.Drawer]: undefined;
  [AppNavigator.TermsScreen]: undefined;
  [AppNavigator.LanguageSelectScreen]: undefined;
  [AppNavigator.SelectSSOScreen]: undefined;
  [AppNavigator.RemoveProductsStack]: undefined;
  [AppNavigator.ReturnProductsStack]: undefined;
  [AppNavigator.ManageProductsStack]: undefined;
  [AppNavigator.CreateInvoiceStack]: undefined;
};

export type RemoveStackParamList = {
  [AppNavigator.SelectStockScreen]: undefined;
  [AppNavigator.RemoveProductsScreen]: undefined;
  [AppNavigator.HowToScanScreen]: undefined;
  [AppNavigator.CameraPermissionScreen]: CameraPermissionScreenParams;
  [AppNavigator.ScannerScreen]: undefined;
  [AppNavigator.ResultScreen]: undefined;
};

export type ReturnStackParamList = {
  [AppNavigator.SelectStockScreen]: undefined;
  [AppNavigator.ReturnProductsScreen]: undefined;
  [AppNavigator.HowToScanScreen]: undefined;
  [AppNavigator.CameraPermissionScreen]: CameraPermissionScreenParams;
  [AppNavigator.ScannerScreen]: undefined;
  [AppNavigator.ResultScreen]: undefined;
};

export type ManageProductsStackParamList = {
  [AppNavigator.SelectStockScreen]: undefined;
  [AppNavigator.ManageProductsScreen]: undefined;
};

export type CreateInvoiceParamList = {
  [AppNavigator.SelectProductJob]: undefined;
  [AppNavigator.ScannerScreen]: undefined;
  [AppNavigator.ResultScreen]: undefined;
  [AppNavigator.CreateInvoiceProductsScreen]: undefined;
  [AppNavigator.CameraPermissionScreen]: CameraPermissionScreenParams;
  [AppNavigator.HowToScanScreen]: undefined;
};

export enum LeftBarType {
  Back,
  Close,
  Drawer,
}

export enum RightBarType {
  Logout,
}

export type BaseProductsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<
    ReturnStackParamList & RemoveStackParamList,
    AppNavigator.RemoveProductsScreen | AppNavigator.ReturnProductsScreen
  >,
  StackNavigationProp<HomeStackParamList>
>;

export type BaseResultScreenNavigationProp = StackNavigationProp<
  ReturnStackParamList & RemoveStackParamList,
  AppNavigator.ResultScreen
>;
