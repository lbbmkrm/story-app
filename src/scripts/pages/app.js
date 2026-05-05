import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { setupSkipContent, transitionToView } from "../utils";
import AuthModel from "../data/auth-model";
import StoryModel from "../data/story-model";
import {
  requestNotificationPermission,
  subscribePushNotification,
  unsubscribePushNotification,
  getSwRegistered,
  isSubscribed,
} from "../utils/push-notification";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #skipLinkButton = null;
  #currentPage = null;

  constructor({ navigationDrawer, drawerButton, content, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#skipLinkButton = skipLinkButton;

    this.#setupDrawer();
    this.#setupSkipContent();
    this.#setupPushSubscribeButton();
  }

  #setupSkipContent() {
    setupSkipContent(this.#skipLinkButton, this.#content);
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      const isOpen = this.#navigationDrawer.classList.toggle("open");
      this.#drawerButton.setAttribute("aria-expanded", isOpen);
    });

    document.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
        this.#drawerButton.setAttribute("aria-expanded", "false");
      }

      this.#navigationDrawer.querySelectorAll("a, button").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
          this.#drawerButton.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  #setupPushSubscribeButton() {
    const btn = document.getElementById("subscribeBtn");
    const btnMobile = document.getElementById("subscribeBtnMobile");

    if (btn) {
      btn.addEventListener("click", () => this.#handleSubscribeToggle());
    }
    if (btnMobile) {
      btnMobile.addEventListener("click", () => this.#handleSubscribeToggle());
    }
  }

  async #updateSubscribeButtonState() {
    const btn = document.getElementById("subscribeBtn");
    const btnMobile = document.getElementById("subscribeBtnMobile");

    if (!AuthModel.isUserLoggedIn()) {
      if (btn) btn.style.display = "none";
      if (btnMobile) btnMobile.style.display = "none";
      return;
    }

    if (btn) btn.style.display = "inline-flex";
    if (btnMobile) btnMobile.style.display = "inline-flex";

    try {
      const registration = await getSwRegistered();
      const subscribed = await isSubscribed(registration);

      const label = subscribed
        ? "🔕 Nonaktifkan Notifikasi"
        : "🔔 Aktifkan Notifikasi";

      if (btn) btn.textContent = label;
      if (btnMobile) btnMobile.textContent = label;
    } catch (error) {
      console.error("Gagal cek status subscribe:", error);
    }
  }

  async #handleSubscribeToggle() {
    try {
      const registration = await getSwRegistered();
      const subscribed = await isSubscribed(registration);

      if (subscribed) {
        const subscription = await registration.pushManager.getSubscription();
        await StoryModel.unsubscribePushNotification(subscription);
        await unsubscribePushNotification(registration);
        alert("Notifikasi telah dinonaktifkan.");
      } else {
        await requestNotificationPermission();
        const subscription = await subscribePushNotification(registration);
        await StoryModel.subscribePushNotification(subscription);
        alert("Notifikasi berhasil diaktifkan.");
      }

      await this.#updateSubscribeButtonState();
    } catch (error) {
      console.error("Kesalahan Push Notification:", error);
      alert(`Gagal memperbarui status notifikasi: ${error.message}`);
    }
  }

  async renderPage() {
    if (this.#currentPage && this.#currentPage.onPageLeave) {
      this.#currentPage.onPageLeave();
    }

    const url = getActiveRoute();
    const page = routes[url];

    if (!page) {
      console.warn(`Route not found: ${url}. Redirecting to home.`);
      window.location.hash = "#/";
      return;
    }

    this.#currentPage = page;

    const header = document.querySelector("header");
    const footer = document.querySelector("footer");

    if (url === "/login" || url === "/register") {
      if (header) header.style.display = "none";
      if (footer) footer.style.display = "none";
    } else {
      if (header) header.style.display = "block";
      if (footer) footer.style.display = "block";
    }

    this.#content.innerHTML = await page.render();
    await page.afterRender();

    await this.#updateSubscribeButtonState();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export default App;
