import AuthModel from "../../data/auth-model";

class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async register(name, email, password) {
    try {
      this.#view.showLoading();
      this.#view.hideError();

      await this.#model.register(name, email, password);

      this.#view.showSuccess("Registrasi berhasil! Silakan login.");

      setTimeout(() => {
        window.location.hash = "#/login";
      }, 1500);
    } catch (error) {
      this.#view.showError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}

export default RegisterPresenter;
