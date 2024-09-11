import { element, by } from 'detox';

class SelectLanguageScreen {
  constructor() {
    this.submitBtn = element(by.label('Submit Button'));
  }

  async clickSubmitButton() {
    try {
      await expect(this.submitBtn).toBeVisible();
      await this.submitBtn.tap();
    } catch (error) {
      console.log('Select Language Options is not shown. Skip closing step.');
    }
  }
}

export default new SelectLanguageScreen();
