import Auth from "./auth-api";

class AuthModel {
  static async login(email, password) {
    const loginResult = await Auth.login(email, password);
    Auth.saveToken(loginResult.token, loginResult.userId);
    return loginResult;
  }

  static async register(name, email, password) {
    return await Auth.register(name, email, password);
  }

  static logout() {
    Auth.logout();
  }

  static isUserLoggedIn() {
    return Auth.isLogin();
  }

  static getToken() {
    return Auth.getToken();
  }

  static getUserId() {
    return Auth.getUserId();
  }
}

export default AuthModel;
