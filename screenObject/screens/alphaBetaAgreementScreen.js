import { element, by } from 'detox';

const AlphaBetaAgreementScreen = {
  CloseAgreementButton: element(by.id('leftBarButtonTestId:button')),
  async closeAgreement() {
    await AlphaBetaAgreementScreen.CloseAgreementButton.tap();
  },
};

export default AlphaBetaAgreementScreen;
