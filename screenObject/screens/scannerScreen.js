import { element, by } from 'detox';

const ScannerScreen = {
  EnterCharacterInsteadOfScanner: element(
    by.label('Enter 5 character Repair Facility code instead'),
  ),

  async clickEnterCharacterInsteadOfScannerLink() {
    await ScannerScreen.EnterCharacterInsteadOfScanner.tap();
  },
};

export default ScannerScreen;
