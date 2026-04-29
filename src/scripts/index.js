// Import global stylesheet
import "../styles/styles.css";
import "../styles/validation.css";

import AuthModel from "./data/auth-model";
import App from "./pages/app";

/**
 * Inisialisasi utama aplikasi saat DOM telah siap
 */
document.addEventListener("DOMContentLoaded", async () => {
  // Inisialisasi orchestrator aplikasi
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
    skipLinkButton: document.querySelector("#skip-link"),
  });

  // Sinkronisasi status navigasi pada pemuatan awal
  updateNavigation();

  // Listener untuk perubahan rute berbasis hash
  window.addEventListener("hashchange", async () => {
    updateNavigation();
    await app.renderPage();
  });

  // Render halaman pertama kali
  await app.renderPage();

  // Delegasi event global untuk penanganan interaksi logout
  document.addEventListener("click", (event) => {
    const logoutBtn = event.target.closest("#logoutBtn");
    if (logoutBtn) {
      event.preventDefault();
      const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari aplikasi?");
      if (confirmLogout) {
        // Pembersihan kredensial sesi melalui Model
        AuthModel.logout();
        updateNavigation();
        window.location.hash = "#/login";
      }
    }
  });
});

/**
 * Memperbarui visibilitas elemen navigasi berdasarkan status otentikasi pengguna
 */
function updateNavigation() {
  const logoutBtn = document.querySelector("#logoutBtn");
  const loginLink = document.querySelector('a[href="#/login"]');
  const registerLink = document.querySelector('a[href="#/register"]');
  
  const loggedIn = AuthModel.isUserLoggedIn();

  if (logoutBtn) logoutBtn.style.display = loggedIn ? "block" : "none";
  if (loginLink) loginLink.parentElement.style.display = loggedIn ? "none" : "block";
  if (registerLink) registerLink.parentElement.style.display = loggedIn ? "none" : "block";
}
