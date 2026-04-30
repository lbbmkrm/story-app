import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { setupSkipContent, transitionToView } from "../utils";

/**
 * Class App bertindak sebagai orchestrator utama SPA.
 * Mengelola rendering halaman, routing, dan komponen global (drawer).
 */
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
  }

  /**
   * Menghubungkan fungsi skip-link untuk aksesibilitas keyboard
   */
  #setupSkipContent() {
    setupSkipContent(this.#skipLinkButton, this.#content);
  }

  /**
   * Mengatur interaksi navigation drawer dan ARIA attributes
   */
  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      const isOpen = this.#navigationDrawer.classList.toggle("open");
      this.#drawerButton.setAttribute("aria-expanded", isOpen);
    });

    // Menangani penutupan drawer saat interaksi di luar elemen atau pada link navigasi
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

  /**
   * Prosedur utama rendering halaman berdasarkan rute aktif.
   * Mendukung siklus hidup halaman (onPageLeave) dan View Transition API.
   */
  async renderPage() {
    // Menjalankan cleanup pada halaman aktif sebelum diganti
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

    // Logika menyembunyikan header dan footer pada halaman Login/Register
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    
    if (url === "/login" || url === "/register") {
      if (header) header.style.display = "none";
      if (footer) footer.style.display = "none";
    } else {
      if (header) header.style.display = "block";
      if (footer) footer.style.display = "block";
    }

    // Eksekusi rendering dengan animasi transisi visual
    await transitionToView(async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export default App;
