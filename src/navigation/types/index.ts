export enum AppNavigator {
  LoginScreen = 'LoginScreen',

  // HomeStack
  HomeStack = 'HomeStack',
  HomeScreen = 'HomeScreen',
  TermsScreen = 'TermsScreen',
  LanguageSelectScreen = 'LanguageSelectScreen',
  SelectSSOScreen = 'SelectSSOScreen',

  // RemoveProductsStack
  RemoveProductsStack = 'RemoveProductsStack',
  SelectStockScreen = 'SelectStockScreen',
  RemoveProductsScreen = 'RemoveProductsScreen',
  ResultScreen = 'ResultScreen',
  HowToScanScreen = 'HowToScanScreen',
  CameraPermissionScreen = 'CameraPermissionScreen',
  RemoveProductScannerScreen = 'RemoveProductScannerScreen',

  // ReturnProductsStack
  ReturnProductsStack = 'ReturnProductsStack',
}

export type ReturnStackParamList = {
  [AppNavigator.SelectStockScreen]: undefined;
};

export enum LeftBarType {
  Back,
  Close,
}

export enum RightBarType {
  Logout,
}
