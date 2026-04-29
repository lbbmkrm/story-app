import RegisterPresenter from "./register-presenter";
import AuthModel from "../../data/auth-model";

class RegisterPage {
  #presenter;

  constructor() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: AuthModel,
    });
  }

  async render() {
    return `
      <div class="auth-container">
        <div class="auth-card">
          <section aria-labelledby="registerTitle">
            <h1 id="registerTitle">Daftar Akun</h1>
            <p class="auth-subtitle">Buat akun untuk mulai berbagi cerita</p>

            <form id="registerForm" class="auth-form" aria-label="Form Pendaftaran Akun">
              <div class="form-group">
                <label for="name">Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  aria-required="true"
                  placeholder="Masukkan nama lengkap Anda"
                />
                <div class="invalid-feedback">Nama tidak boleh kosong.</div>
              </div>

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
                  minlength="6"
                  placeholder="Masukkan password (min. 6 karakter)"
                />
                <div class="invalid-feedback">Password minimal 6 karakter.</div>
              </div>

              <div id="errorMessage" class="error-message" role="alert" aria-live="polite" style="display: none;"></div>
              <div id="successMessage" class="success-message" role="status" aria-live="polite" style="display: none;"></div>

              <button type="submit" id="registerBtn" class="btn btn-primary">
                Daftar Sekarang
              </button>
            </form>

            <p class="auth-footer">
              Sudah punya akun? <a href="#/login">Masuk di sini</a>
            </p>
          </section>
        </div>
      </div>
    `;
  }

  async afterRender() {
    const form = document.querySelector("#registerForm");
    const nameInput = document.querySelector("#name");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");

    // Name Validation
    nameInput.addEventListener("input", () => {
      if (nameInput.value.trim().length > 0) {
        nameInput.classList.remove("is-invalid");
      } else {
        nameInput.classList.add("is-invalid");
      }
    });

    // Email Validation
    emailInput.addEventListener("input", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(emailInput.value)) {
        emailInput.classList.remove("is-invalid");
      } else {
        emailInput.classList.add("is-invalid");
      }
    });

    // Password Validation
    passwordInput.addEventListener("input", () => {
      if (passwordInput.value.length >= 6) {
        passwordInput.classList.remove("is-invalid");
      } else {
        passwordInput.classList.add("is-invalid");
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.#presenter.register(nameInput.value, emailInput.value, passwordInput.value);
    });
  }

  showLoading() {
    const btn = document.querySelector("#registerBtn");
    btn.disabled = true;
    btn.textContent = "Memproses...";
  }

  hideLoading() {
    const btn = document.querySelector("#registerBtn");
    btn.disabled = false;
    btn.textContent = "Daftar Sekarang";
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

export default RegisterPage;
