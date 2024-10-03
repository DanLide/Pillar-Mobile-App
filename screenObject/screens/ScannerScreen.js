import { element, by } from 'detox';

class ScannerScreen {
  constructor() {
    this.enterCharacterInsteadOfScanner = element(
      by.label('Enter 5 character Repair Facility code instead'),
    );
  }

  async clickEnterCharacterInsteadOfScannerLink() {
    await this.enterCharacterInsteadOfScanner.tap();
  }
}
export default new ScannerScreen();
