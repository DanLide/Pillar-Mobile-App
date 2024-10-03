import { element, by } from 'detox';

class ShopManagementScreen {
  constructor() {
    this.removeProductOption = element(by.label('Remove Products'));
    this.returnProductOption = element(by.label('Return Products'));
    this.createInvoiceOption = element(by.label('Create Invoice'));
    this.manageProductOption = element(by.label('Manage Products'));
    this.manageOrderOption = element(by.label('Manage Orders'));
  }

  async verifyShopManagementOptions() {
    await expect(this.removeProductOption).toBeVisible();
    await expect(this.returnProductOption).toBeVisible();
    await expect(this.createInvoiceOption).toBeVisible();
    await expect(this.manageProductOption).toBeVisible();
    await expect(this.manageOrderOption).toBeVisible();
  }
}

export default new ShopManagementScreen();
