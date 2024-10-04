import { element, by } from 'detox';

class BluetoothPermissionScreen {
  constructor() {
    this.continueBtn = element(by.label('continue'));
  }

  async clickContinueBtn() {
    await this.continueBtn.tap();
  }
}

export default new BluetoothPermissionScreen();
