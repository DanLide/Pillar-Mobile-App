import { element, by } from 'detox';

class AlphaBetaAgreementScreen {
  constructor() {
    this.closeAgreementButton = element(by.id('rightBarButtonTestId:button'));
  }

  async closeAgreementIfExist() {
    try {
      await expect(this.closeAgreementButton).toBeVisible();
      await this.closeAgreementButton.tap();
    } catch (error) {
      console.log('AlphaBetaAgreement is not shown. Skip closing step.');
    }
  }
}
export default new AlphaBetaAgreementScreen();
