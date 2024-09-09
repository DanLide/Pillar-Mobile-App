import { element, by } from 'detox';

const ShopLocationScreen = {
  SearchShopInput: element(by.id('input:container')),
  FoundShope: element(by.id('listItem.1')),
  LogoutButton: element(by.id('rightBarButtonTestId:button')),

  async verifySearchInputIsVisible() {
    await expect(ShopLocationScreen.SearchShopInput).toBeVisible();
  },
  async searchShop(name) {
    await ShopLocationScreen.SearchShopInput.typeText(name);
  },
  async verifySeekingShopIsVisible() {
    await expect(ShopLocationScreen.FoundShope).toBeVisible();
  },
  async clickLogoutButton() {
    await ShopLocationScreen.LogoutButton.tap();
  },
};

export default ShopLocationScreen;
