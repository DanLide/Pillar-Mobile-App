import { element, by } from 'detox';

const WelcomeScreen = {
  ConfigureShopDevice: element(by.label('Configure shop device')),
  AdminDeviceLogin: element(by.label('Admin device login')),
  UpdateDeviceNameBtn: element(by.id('updateButton')),

  async clickAdminDeviceLogin() {
    await WelcomeScreen.AdminDeviceLogin.tap();
  },
  async clickConfigureShopDevice() {
    await WelcomeScreen.ConfigureShopDevice.tap();
  },
  async verifyRedirectionToWelcomeScreen() {
    await expect(WelcomeScreen.AdminDeviceLogin).toBeVisible();
    await expect(WelcomeScreen.ConfigureShopDevice).toBeVisible();
  },
  async clickUpdateDeviceNameButton() {
    await WelcomeScreen.UpdateDeviceNameBtn.tap();
  },
};

export default WelcomeScreen;
