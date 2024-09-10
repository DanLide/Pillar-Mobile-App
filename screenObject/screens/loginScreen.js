import { element, by } from 'detox';

const LoginScreen = {
  UserNameInput: element(by.label('Username Username')),
  PasswordInput: element(by.label('Password Required Password')),
  LoginButton: element(by.label('Login button')),

  async login(username, password) {
    await LoginScreen.UserNameInput.typeText(username);
    // await LoginScreen.PasswordInput.tap();
    await LoginScreen.PasswordInput.typeText(password);
    await LoginScreen.PasswordInput.tapReturnKey();
    await LoginScreen.LoginButton.tap();
  },
};

export default LoginScreen;
