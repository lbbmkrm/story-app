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
    // Cari elemen logout baik berdasarkan ID container maupun class link
    const logoutBtn = event.target.closest("#logoutBtn, #logoutBtnMobile, .logout-link");
    if (logoutBtn && (logoutBtn.id === "logoutBtn" || logoutBtn.id === "logoutBtnMobile" || logoutBtn.classList.contains("logout-link"))) {
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
  const logoutBtnMobile = document.querySelector("#logoutBtnMobile");
  const guestActions = document.querySelector("#guestActions");
  const guestActionsMobile = document.querySelector("#guestActionsMobile");
  
  const loggedIn = AuthModel.isUserLoggedIn();

  if (logoutBtn) logoutBtn.style.display = loggedIn ? "block" : "none";
  if (logoutBtnMobile) logoutBtnMobile.style.display = loggedIn ? "block" : "none";
  
  if (guestActions) guestActions.style.display = loggedIn ? "none" : "flex";
  if (guestActionsMobile) guestActionsMobile.style.display = loggedIn ? "none" : "flex";
}
