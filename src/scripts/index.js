import "../styles/styles.css";
import "../styles/validation.css";
import { registerSW } from "virtual:pwa-register";

import AuthModel from "./data/auth-model";
import App from "./pages/app";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
    skipLinkButton: document.querySelector("#skip-link"),
  });

  updateNavigation();

  window.addEventListener("hashchange", async () => {
    updateNavigation();
    await app.renderPage();
  });

  await app.renderPage();

  document.addEventListener("click", (event) => {
    const logoutBtn = event.target.closest(
      "#logoutBtn, #logoutBtnMobile, .logout-link",
    );
    if (
      logoutBtn &&
      (logoutBtn.id === "logoutBtn" ||
        logoutBtn.id === "logoutBtnMobile" ||
        logoutBtn.classList.contains("logout-link"))
    ) {
      event.preventDefault();
      const confirmLogout = confirm(
        "Apakah Anda yakin ingin keluar dari aplikasi?",
      );
      if (confirmLogout) {
        AuthModel.logout();
        updateNavigation();
        window.location.hash = "#/login";
      }
    }
  });
});

function updateNavigation() {
  const logoutBtn = document.querySelector("#logoutBtn");
  const logoutBtnMobile = document.querySelector("#logoutBtnMobile");
  const guestActions = document.querySelector("#guestActions");
  const guestActionsMobile = document.querySelector("#guestActionsMobile");

  const loggedIn = AuthModel.isUserLoggedIn();

  if (logoutBtn) logoutBtn.style.display = loggedIn ? "block" : "none";
  if (logoutBtnMobile)
    logoutBtnMobile.style.display = loggedIn ? "block" : "none";

  if (guestActions) guestActions.style.display = loggedIn ? "none" : "flex";
  if (guestActionsMobile)
    guestActionsMobile.style.display = loggedIn ? "none" : "flex";
}

const updateSW = registerSW({
  onNeedRefresh() {
    console.log("SW: ada pembaruan tersedia");
  },

  onOfflineReady() {
    console.log("SW: aplikasi siap digunakan offline");
  },
  onRegistered(registration) {
    console.log("SW: terdaftar dengan scope : ", registration.scope);
  },
  onRegisterError(error) {
    console.log("SW: gagal mendaftar", error);
  },
});
