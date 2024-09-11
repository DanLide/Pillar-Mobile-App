import { element, by } from 'detox';

class ShopLocationScreen {
  constructor() {
    this.searchShopInput = element(by.id('input:container'));
    this.foundShope = element(by.id('listItem.1'));
    this.logoutButton = element(by.id('rightBarButtonTestIdLogout:button'));
  }

  async verifySearchInputIsVisible() {
    await expect(this.searchShopInput).toBeVisible();
  }

  async searchShop(name) {
    await this.searchShopInput.typeText(name);
  }

  async verifySeekingShopIsVisible() {
    await expect(this.foundShope).toBeVisible();
  }

  async clickLogoutButton() {
    await this.logoutButton.tap();
  }
}
export default new ShopLocationScreen();
