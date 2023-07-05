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
}

type CameraPermissionScreenParams = {
  nextRoute: keyof (RemoveStackParamList & ReturnStackParamList);
};

export type HomeStackParamList = {
  [AppNavigator.HomeScreen]: undefined;
  [AppNavigator.TermsScreen]: undefined;
  [AppNavigator.LanguageSelectScreen]: undefined;
  [AppNavigator.SelectSSOScreen]: undefined;
  [AppNavigator.RemoveProductsStack]: undefined;
  [AppNavigator.ReturnProductsStack]: undefined;
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

export enum LeftBarType {
  Back,
  Close,
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
