import { element, by, expect } from 'detox';

class ScannerScreen {
  constructor() {
    this.enterCharacterInsteadOfScanner = element(
      by.label('Enter 5 character Repair Facility code instead'),
    );
    this.scannedProduct = element(by.label('flash'));
    this.listOfProduct = element(by.id('productListButton:button'));
    this.zoomIcon = element(by.label('zoomIcon'));
    this.scanBtn = element(by.label('Scan'));
    this.homeBtn = element(by.label('Home'));
  }

  async clickEnterCharacterInsteadOfScannerLink() {
    await this.enterCharacterInsteadOfScanner.tap();
  }

  async scanProduct() {
    await this.scannedProduct.tap();
  }

  async openListOfProducts() {
    await this.listOfProduct.tap();
  }

  async verifyVisibilityOfElements() {
    await expect(this.scannedProduct).toBeVisible();
    await expect(this.zoomIcon).toBeVisible();
  }

  async openModalEditAddedProductToList(productId) {
    await element(by.id(productId)).tap();
  }

  async verifyVisibilityOfElementsInList() {
    await expect(this.scanBtn).toBeVisible();
    await expect(this.homeBtn).toBeVisible();
  }
}

export default new ScannerScreen();
