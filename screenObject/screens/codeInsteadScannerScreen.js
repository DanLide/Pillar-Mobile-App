import { element, by } from 'detox';

const CodeInsteadScannerScreen = {
  CodeInput: element(by.id('codeField')),
  SubmitBtn: element(by.label('Confirm Button')),

  async enterCode(code) {
    await CodeInsteadScannerScreen.CodeInput.typeText(code);
  },
  async clickSubmitButton() {
    await CodeInsteadScannerScreen.SubmitBtn.tap();
  },
};

export default CodeInsteadScannerScreen;
