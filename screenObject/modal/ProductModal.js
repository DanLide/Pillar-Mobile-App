import { element, by, expect } from 'detox';

class ProductModal {
  constructor() {
    this.saveBtn = element(by.label('Save'));
    this.doneBtn = element(by.label('Done'));
    this.editBtn = element(by.label('Edit'));
    this.cancelBtn = element(by.label('Cancel'));
  }

  async clickDoneBtn() {
    await this.doneBtn.tap();
  }

  async clickSaveBtn() {
    await this.saveBtn.tap();
  }

  async clickEditBtn() {
    await this.editBtn.tap();
  }

  async clickCancelBtn() {
    await this.cancelBtn.tap();
  }

  async editProductCategory(nameCategory) {
    await element(by.label('Category')).tap();
    await element(by.label(nameCategory)).tap();
    await this.clickSaveBtn();
  }

  async verifyVisibilityOfElements() {
    if (this.editBtn && this.doneBtn) {
      await expect(this.editBtn).toBeVisible();
      await expect(this.doneBtn).toBeVisible();
    } else if (this.cancelBtn && this.saveBtn) {
      await expect(this.cancelBtn).toBeVisible();
      await expect(this.saveBtn).toBeVisible();
    } else {
      console.log('Elements do not exist');
    }
  }
}

export default new ProductModal();
