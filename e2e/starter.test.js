import { device } from 'detox';
import welcomeScreen from '../screenObject/screens/WelcomeScreen';
import loginScreen from '../screenObject/screens/LoginScreen';
import alphaBetaAgreementScreen from '../screenObject/screens/AlphaBetaAgreementScreen';
import shopLocationScreen from '../screenObject/screens/ShopLocationScreen';
import selectLanguageScreen from '../screenObject/screens/SelectLanguageScreen';
import scannerScreen from '../screenObject/screens/ScannerScreen';
import codeInsteadScannerScreen from '../screenObject/screens/CodeInsteadScannerScreen';
import updateDeviceNameAlert from '../screenObject/alerts/UpdateDeviceNameAlert.js';
import testData from '../testData/data.Config.json';

describe('Authentication Tests', () => {
  beforeEach(async () => {
    await device.clearKeychain();
    await device.launchApp({ delete: true, newInstance: true });
  });

  it('Login Via Credentials Test', async () => {
    await welcomeScreen.clickAdminDeviceLogin();
    await loginScreen.login(testData.user.username, testData.user.password);
    await selectLanguageScreen.clickSubmitButton();
    await alphaBetaAgreementScreen.closeAgreementIfExist();
    await shopLocationScreen.verifySearchInputIsVisible();
  });

  it('Search Shop Test', async () => {
    await welcomeScreen.clickAdminDeviceLogin();
    await loginScreen.login(testData.user.username, testData.user.password);
    await selectLanguageScreen.clickSubmitButton();
    await alphaBetaAgreementScreen.closeAgreementIfExist();
    await shopLocationScreen.searchShop(testData.sso.ssoName);
    await shopLocationScreen.verifySeekingShopIsVisible();
  });

  it('Logout Test', async () => {
    await welcomeScreen.clickAdminDeviceLogin();
    await loginScreen.login(testData.user.username, testData.user.password);
    await selectLanguageScreen.clickSubmitButton();
    await alphaBetaAgreementScreen.closeAgreementIfExist();
    await shopLocationScreen.clickLogoutButton();
    await welcomeScreen.verifyRedirectionToWelcomeScreen();
  });

  it('Configure Shop', async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { camera: 'YES' },
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
  });

  afterAll(async () => {
    await device.terminateApp();
  });
});
