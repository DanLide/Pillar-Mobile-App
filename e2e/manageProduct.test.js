import { device, element, by, expect } from 'detox';
import welcomeScreen from '../screenObject/screens/WelcomeScreen';
import loginScreen from '../screenObject/screens/LoginScreen';
import alphaBetaAgreementScreen from '../screenObject/screens/AlphaBetaAgreementScreen';
import selectLanguageScreen from '../screenObject/screens/SelectLanguageScreen';
import scannerScreen from '../screenObject/screens/ScannerScreen';
import codeInsteadScannerScreen from '../screenObject/screens/CodeInsteadScannerScreen';
import updateDeviceNameAlert from '../screenObject/alerts/UpdateDeviceNameAlert';
import bluetoothPermissionScreen from '../screenObject/screens/BluetoothPermissionScreen';
import selectStockLocationScreen from '../screenObject/screens/SelectStockLocationScreen';
import productModal from '../screenObject/modal/ProductModal';
import testData from '../testData/data.Config.json';
import shopManagementScreen from '../screenObject/screens/ShopManagementScreen';
import Helper from '../screenObject/helpers/Helper';

describe('Authentication Tests', () => {
  beforeEach(async () => {
    await device.clearKeychain();
  });

  it('Manage Product Category', async () => {
    await device.launchApp({
      permissions: { camera: 'YES', location: 'always' },
    });
    await welcomeScreen.clickUpdateDeviceNameButton();
    await updateDeviceNameAlert.updateDeviceName(testData.sso.deviceCode);
    await welcomeScreen.clickConfigureShopDevice();
    await loginScreen.login(testData.user.username, testData.user.password);
    await selectLanguageScreen.clickSubmitButton();
    await alphaBetaAgreementScreen.closeAgreementIfExist();
    await scannerScreen.clickEnterCharacterInsteadOfScannerLink();
    await codeInsteadScannerScreen.enterCode(testData.sso.ssoCode);
    await codeInsteadScannerScreen.clickSubmitButton();
    await shopManagementScreen.verifyShopManagementOptions();

    await shopManagementScreen.openManageProductOption();
    await bluetoothPermissionScreen.clickContinueBtn();
    await selectStockLocationScreen.selectStockLocation(
      testData.stockLocation.stockName,
    );

    await scannerScreen.verifyVisibilityOfElements();
    await scannerScreen.scanProduct();
    await productModal.verifyVisibilityOfElements();
    await productModal.clickEditBtn();
    await productModal.editProductCategory(
      testData.productSettings.mainCategory,
    );

    const initialNameOfElement = await Helper.getElementName(
      testData.productSettings.mainCategory,
      'label',
    );

    await productModal.clickDoneBtn();
    await scannerScreen.openListOfProducts();
    await scannerScreen.verifyVisibilityOfElementsInList();
    await scannerScreen.openModalEditAddedProductToList(
      testData.productSettings.productId,
    );
    await productModal.clickEditBtn();

    await expect(
      element(by.label(testData.productSettings.mainCategory)),
    ).toHaveText(initialNameOfElement);

    await productModal.editProductCategory(
      testData.productSettings.secondaryCategory,
    );
    await productModal.clickDoneBtn();
  });

  afterAll(async () => {
    await device.terminateApp();
  });
});
