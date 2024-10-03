import { element, by } from 'detox';

class LoginScreen {
  constructor() {
    this.userNameInput = element(by.label('Username Username'));
    this.passwordInput = element(by.label('Password Required Password'));
    this.loginButton = element(by.label('Login button'));
  }

  async login(username, password) {
    await this.userNameInput.replaceText(username);
    await this.passwordInput.replaceText(password);
    await this.passwordInput.tapReturnKey();
    await this.loginButton.tap();
  }
}

export default new LoginScreen();
