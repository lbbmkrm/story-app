import LoginPresenter from "./login-presenter";
import AuthModel from "../../data/auth-model";

class LoginPage {
  #presenter;

  constructor() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: AuthModel,
    });
  }

  async render() {
    return `
      <div class="auth-container">
        <div class="auth-card">
          <section aria-labelledby="loginTitle">
            <h1 id="loginTitle">Login</h1>
            <p class="auth-subtitle">Masuk ke akun Anda</p>

            <form id="loginForm" class="auth-form" aria-label="Form Login Akun">
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  aria-required="true"
                  placeholder="Masukkan email Anda"
                />
                <div class="invalid-feedback">Format email tidak valid.</div>
              </div>

              <div class="form-group">
                <label for="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  aria-required="true"
                  placeholder="Masukkan password"
                />
                <div class="invalid-feedback">Password tidak boleh kosong.</div>
              </div>

              <div id="errorMessage" class="error-message" role="alert" aria-live="polite" style="display: none;"></div>
              <div id="successMessage" class="success-message" role="status" aria-live="polite" style="display: none;"></div>

              <button type="submit" id="loginBtn" class="btn btn-primary">
                Login
              </button>
            </form>

            <p class="auth-footer">
              Belum punya akun? <a href="#/register">Daftar di sini</a>
            </p>
          </section>
        </div>
      </div>
    `;
  }

  async afterRender() {
    const form = document.querySelector("#loginForm");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");

    // Email Validation (Real-time)
    emailInput.addEventListener("input", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(emailInput.value)) {
        emailInput.classList.remove("is-invalid");
      } else {
        emailInput.classList.add("is-invalid");
      }
    });

    // Password Validation (Real-time)
    passwordInput.addEventListener("input", () => {
      if (passwordInput.value.length > 0) {
        passwordInput.classList.remove("is-invalid");
      } else {
        passwordInput.classList.add("is-invalid");
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.#presenter.login(emailInput.value, passwordInput.value);
    });
  }

  showLoading() {
    const btn = document.querySelector("#loginBtn");
    btn.disabled = true;
    btn.textContent = "Loading...";
  }

  hideLoading() {
    const btn = document.querySelector("#loginBtn");
    btn.disabled = false;
    btn.textContent = "Login";
  }

  showError(message) {
    const errorDiv = document.querySelector("#errorMessage");
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
  }

  hideError() {
    const errorDiv = document.querySelector("#errorMessage");
    errorDiv.style.display = "none";
  }

  showSuccess(message) {
    const successDiv = document.querySelector("#successMessage");
    successDiv.textContent = message;
    successDiv.style.display = "block";
  }
}

export default LoginPage;
