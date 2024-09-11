import { element, by } from 'detox';

class WelcomeScreen {
  constructor() {
    this.configureShopDevice = element(by.label('Configure shop device'));
    this.adminDeviceLogin = element(by.label('Admin device login'));
    this.updateDeviceNameBtn = element(by.id('updateButton'));
  }

  async clickAdminDeviceLogin() {
    await this.adminDeviceLogin.tap();
  }

  async clickConfigureShopDevice() {
    await this.configureShopDevice.tap();
  }

  async verifyRedirectionToWelcomeScreen() {
    await expect(this.adminDeviceLogin).toBeVisible();
    await expect(this.configureShopDevice).toBeVisible();
  }

  async clickUpdateDeviceNameButton() {
    await this.updateDeviceNameBtn.tap();
  }
}

export default new WelcomeScreen();
