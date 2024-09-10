import { element, by } from 'detox';

const AlphaBetaAgreementScreen = {
  CloseAgreementButton: element(by.id('rightBarButtonTestId:button')),
  async closeAgreementIfExist() {
    try {
      await expect(AlphaBetaAgreementScreen.CloseAgreementButton).toBeVisible();
      await AlphaBetaAgreementScreen.CloseAgreementButton.tap();
    } catch (error) {
      console.log('AlphaBetaAgreement is not shown. Skip closing step.');
    }
  },
};

export default AlphaBetaAgreementScreen;
