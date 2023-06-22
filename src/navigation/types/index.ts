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

  // RemoveProductsStack
  RemoveProductsStack = 'RemoveProductsStack',
  RemoveProductsScreen = 'RemoveProductsScreen',
  ResultScreen = 'ResultScreen',
  HowToScanScreen = 'HowToScanScreen',
  CameraPermissionScreen = 'CameraPermissionScreen',
  RemoveProductScannerScreen = 'RemoveProductScannerScreen',

  // ReturnProductsStack
  ReturnProductsStack = 'ReturnProductsStack',
  ReturnProductsScreen = 'ReturnProductsScreen',
}

export type ReturnStackParamList = {
  [AppNavigator.SelectStockScreen]: undefined;
  [AppNavigator.ReturnProductsScreen]: undefined;
};

export enum LeftBarType {
  Back,
  Close,
}

export enum RightBarType {
  Logout,
}
