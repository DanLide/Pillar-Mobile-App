import { element, by } from 'detox';

class UpdateDeviceNameAlert {
  constructor() {
    this.inputDeviceName = element(by.text('Default Device Name'));
    this.saveButton = element(by.text('Save'));
  }

  async updateDeviceName(deviceName) {
    await this.inputDeviceName.replaceText(deviceName);
    await this.saveButton.tap();
  }
}

export default new UpdateDeviceNameAlert();
