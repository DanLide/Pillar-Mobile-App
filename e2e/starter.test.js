import { device } from 'detox';
import WelcomeScreen from '../screenObject/screens/welcomeScreen.js';
import LoginScreen from '../screenObject/screens/loginScreen.js';
import AlphaBetaAgreementScreen from '../screenObject/screens/alphaBetaAgreementScreen.js';
import ShopLocationScreen from '../screenObject/screens/shopLocationScreen.js';

describe('Authentication Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it.only('Login Via Credentials Test', async () => {
    await WelcomeScreen.clickAdminDeviceLogin();
    await LoginScreen.login('Aadmin2', 'andriiQA111@');
    await AlphaBetaAgreementScreen.closeAgreement();
    await ShopLocationScreen.verifySearchInputIsVisible();
  });

  it('Search Shop Test', async () => {
    await WelcomeScreen.clickAdminDeviceLogin();
    await LoginScreen.login('Aadmin2', 'andriiQA111@');
    await AlphaBetaAgreementScreen.closeAgreement();
    await ShopLocationScreen.searchShop('Honda Body Shop 1');
    await ShopLocationScreen.verifySeekingShopIsVisible();
  });

  it('Logout Test', async () => {
    await WelcomeScreen.clickAdminDeviceLogin();
    await LoginScreen.login('Aadmin2', 'andriiQA111@');
    await AlphaBetaAgreementScreen.closeAgreement();
    await ShopLocationScreen.clickLogoutButton();
    await WelcomeScreen.verifyRedirectionToWelcomeScreen();
  });

  afterAll(async () => {
    await device.terminateApp();
  });
});
