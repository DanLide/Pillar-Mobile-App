import { element, by } from 'detox';

const SelectLanguageScreen = {
  SubmitBtn: element(by.label('Submit Button')),

  async clickSubmitButton() {
    try {
      await expect(SelectLanguageScreen.SubmitBtn).toBeVisible();
      await SelectLanguageScreen.SubmitBtn.tap();
    } catch (error) {
      console.log('Select Language Options is not shown. Skip closing step.');
    }
  },
};

export default SelectLanguageScreen;
