import AuthModel from "../../data/auth-model";

class LoginPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async login(email, password) {
    try {
      this.#view.showLoading();
      this.#view.hideError();

      await this.#model.login(email, password);
      this.#view.showSuccess("Login berhasil!");

      setTimeout(() => {
        window.location.hash = "#/";
      }, 1000);
    } catch (error) {
      this.#view.showError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}

export default LoginPresenter;
