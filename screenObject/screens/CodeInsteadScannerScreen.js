import { element, by } from 'detox';

class CodeInsteadScannerScreen {
  constructor() {
    this.codeInput = element(by.id('codeField'));
    this.submitBtn = element(by.label('Confirm Button'));
  }

  async enterCode(code) {
    await this.codeInput.typeText(code);
  }

  async clickSubmitButton() {
    await this.submitBtn.tap();
  }
}

export default new CodeInsteadScannerScreen();
