import { device } from 'detox';
import WelcomeScreen from '../screenObject/screens/welcomeScreen.js';
import LoginScreen from '../screenObject/screens/loginScreen.js';
import AlphaBetaAgreementScreen from '../screenObject/screens/alphaBetaAgreementScreen.js';
import ShopLocationScreen from '../screenObject/screens/shopLocationScreen.js';
import SelectLanguageScreen from '../screenObject/screens/selectLanguageScreen.js';
import ScannerScreen from '../screenObject/screens/scannerScreen.js';
import CodeInsteadScannerScreen from '../screenObject/screens/codeInsteadScannerScreen.js';

describe('Authentication Tests', () => {
  it('Login Via Credentials Test', async () => {
    await device.launchApp();
    await WelcomeScreen.clickAdminDeviceLogin();
    await LoginScreen.login('Aadmin2', 'andriiQA111@');
    await SelectLanguageScreen.clickSubmitButton();
    await AlphaBetaAgreementScreen.closeAgreementIfExist();
    await ShopLocationScreen.verifySearchInputIsVisible();
    await device.terminateApp();
  });

  it.only('Search Shop Test', async () => {
    await device.launchApp();
    await WelcomeScreen.clickAdminDeviceLogin();
    await LoginScreen.login('Aadmin2', 'andriiQA111@');
    await ShopLocationScreen.searchShop('Autotest-BodyShop');
    await ShopLocationScreen.verifySeekingShopIsVisible();
    await device.terminateApp();
  });

  it('Logout Test', async () => {
    await device.launchApp();
    await WelcomeScreen.clickAdminDeviceLogin();
    await LoginScreen.login('Aadmin2', 'andriiQA111@');
    await ShopLocationScreen.clickLogoutButton();
    await WelcomeScreen.verifyRedirectionToWelcomeScreen();
    await device.terminateApp();
  });

  it('Configure Shop', async () => {
    await device.launchApp();
    await WelcomeScreen.clickUpdateDeviceNameButton();

    //  await element(by.text('Save')).tap();

    await WelcomeScreen.clickConfigureShopDevice();
    await LoginScreen.login('Aadmin2', 'andriiQA111@');
    await SelectLanguageScreen.clickSubmitButton();
    await AlphaBetaAgreementScreen.closeAgreementIfExist();
    await wait(3000); // Time to allow permission
    await ScannerScreen.clickEnterCharacterInsteadOfScannerLink();
    await CodeInsteadScannerScreen.enterCode('758ZD');
    await CodeInsteadScannerScreen.clickSubmitButton();
    // await device.terminateApp();
  });

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});
