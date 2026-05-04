import HomePresenter from "./home-presenter";
import StoryModel from "../../data/story-model";
import { formatDate } from "../../utils";
import AuthModel from "../../data/auth-model";

class HomePage {
  #presenter;
  #map;
  #markers = {};
  #selectedStoryId = null;

  constructor() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryModel,
    });
  }

  async render() {
    return `
      <div class="home-container">
        <div class="home-content">
          <!-- Area Peta di Atas -->
          <section class="map-section" aria-label="Peta Lokasi Cerita">
            <div id="map" class="map-container" role="application" aria-label="Peta Interaktif Cerita"></div>
          </section>

          <!-- Area Konten di Bawah -->
          <div class="container">
            <section class="stories-section" aria-label="Daftar Cerita Terbaru">
              <header class="stories-header">
                <h1>Daftar Cerita Terbaru</h1>
                <p>Jelajahi momen-momen menarik dari seluruh penjuru dunia</p>
                <div style="margin-top: 24px;">
                  <a href="#/add" class="btn btn-primary btn-lg" aria-label="Bagikan Cerita Baru">
                    &#43; Bagikan Cerita Anda
                  </a>
                </div>
              </header>
              
              <div id="storiesContainer" class="stories-list" role="region" aria-live="polite">
                <div id="loadingIndicator">Memuat data cerita...</div>
              </div>
              
              <div id="errorMessage" class="error-message" role="alert" aria-live="polite" style="display: none; margin: 24px 0;"></div>
            </section>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    // Validasi sesi pengguna sebelum memuat konten
    if (!AuthModel.isUserLoggedIn()) {
      window.location.hash = "#/login";
      return;
    }

    await this.#presenter.loadStories();
  }

  /**
   * Merender daftar cerita ke dalam DOM dan mendaftarkan event listener
   * @param {Array} stories - Array berisi objek cerita dari API
   */
  async renderStories(stories) {
    const container = document.querySelector("#storiesContainer");

    if (stories.length === 0) {
      container.innerHTML =
        "<p>Belum ada cerita tersedia. Mulailah berbagi cerita Anda!</p>";
      return;
    }

    // Ambil semua ID cerita favorit untuk pengecekan status tombol
    const favoriteStories = await StoryModel.getAllFavoriteStories();
    const favoriteIds = favoriteStories.map((s) => s.id);

    container.innerHTML = stories
      .map(
        (story) => {
          const isFavorite = favoriteIds.includes(story.id);
          return `
            <article class="story-card" data-story-id="${story.id}" tabindex="0" role="button" aria-label="Cerita dari ${story.name}">
              <div class="story-image-wrapper">
                <img 
                  src="${story.photoUrl}" 
                  alt="Foto cerita ${story.name}"
                  class="story-image"
                  loading="lazy"
                />
              </div>
              <div class="story-content">
                <div class="story-header-row">
                  <h3>${story.name}</h3>
                  <button 
                    class="btn-favorite" 
                    data-id="${story.id}" 
                    aria-label="${isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}"
                    title="${isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}"
                  >
                    ${isFavorite ? "❤️" : "🤍"}
                  </button>
                </div>
                <p class="story-description">${story.description}</p>
                <div class="story-meta">
                  <span class="story-location">📍 ${story.lat ? `${story.lat.toFixed(1)}, ${story.lon.toFixed(1)}` : "Lokasi tidak tersedia"}</span>
                  <span class="story-date">${formatDate(story.createdAt)}</span>
                </div>
                <div class="story-actions">
                  <button class="btn-focus-map" data-id="${story.id}" title="Lihat di Peta" aria-label="Lihat lokasi di peta">📍</button>
                </div>
              </div>
            </article>
          `;
        }
      )
      .join("");

    // Registrasi listener interaksi pada kartu cerita
    stories.forEach((story) => {
      const card = document.querySelector(`[data-story-id="${story.id}"]`);
      if (card) {
        card.addEventListener("click", () => {
          window.location.hash = `#/stories/${story.id}`;
        });

        const focusBtn = document.querySelector(
          `.btn-focus-map[data-id="${story.id}"]`,
        );
        if (focusBtn) {
          focusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.#presenter.onStorySelected(story.id);
          });
        }

        // Handle Klik Tombol Favorit
        const favoriteBtn = document.querySelector(
          `.btn-favorite[data-id="${story.id}"]`,
        );
        if (favoriteBtn) {
          favoriteBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const isCurrentlyFavorite = favoriteBtn.textContent.trim() === "❤️";
            
            if (isCurrentlyFavorite) {
              await StoryModel.deleteFavoriteStory(story.id);
              favoriteBtn.textContent = "🤍";
              favoriteBtn.setAttribute("aria-label", "Tambah ke favorit");
            } else {
              await StoryModel.putFavoriteStory(story);
              favoriteBtn.textContent = "❤️";
              favoriteBtn.setAttribute("aria-label", "Hapus dari favorit");
            }
          });
        }

        // Dukungan aksesibilitas navigasi keyboard
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            window.location.hash = `#/stories/${story.id}`;
          }
        });
      }
    });
  }

  /**
   * Inisialisasi instance peta Leaflet dan penempatan marker koordinat
   * @param {Array} stories - Array berisi objek cerita dengan lat/lon
   */
  initializeMap(stories) {
    // Membersihkan instance peta sebelumnya jika ada (Mencegah memory leak)
    const mapContainer = document.querySelector("#map");

    // Hapus paksa properti internal Leaflet jika elemen di-reuse
    if (mapContainer && mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
    }

    try {
      this.#map = L.map(mapContainer).setView([-2.5489, 118.0149], 5);
    } catch (error) {
      console.warn("Leaflet init warning:", error);
    }

    // Layer jalan raya standar
    const osmLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      },
    );

    // Layer satelit detail
    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "© Esri",
        maxZoom: 18,
      },
    );

    osmLayer.addTo(this.#map);

    // Kontrol penggantian tipe layer peta
    L.control
      .layers(
        {
          "Peta Jalan": osmLayer,
          Satelit: satelliteLayer,
        },
        {},
        { position: "topright" },
      )
      .addTo(this.#map);

    // Pembuatan marker untuk setiap cerita yang memiliki koordinat
    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon])
          .bindPopup(
            `
            <div class="marker-popup">
              <img src="${story.photoUrl}" alt="${story.name}" style="width: 100%; max-height: 150px; border-radius: 4px;" />
              <h4>${story.name}</h4>
              <p>${story.description.substring(0, 100)}...</p>
            </div>
          `,
          )
          .addTo(this.#map);

        this.#markers[story.id] = marker;

        marker.on("click", () => {
          this.#presenter.onStorySelected(story.id);
        });
      }
    });
  }

  /**
   * Memberikan efek visual pada kartu cerita yang dipilih
   * @param {string} storyId - ID cerita yang akan di-highlight
   */
  highlightStory(storyId) {
    document.querySelectorAll(".story-card").forEach((card) => {
      card.classList.remove("active");
    });

    const selectedCard = document.querySelector(`[data-story-id="${storyId}"]`);
    if (selectedCard) {
      selectedCard.classList.add("active");
      selectedCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    this.#selectedStoryId = storyId;
  }

  /**
   * Mengarahkan pandangan peta ke marker yang sesuai dengan ID cerita
   * @param {string} storyId - ID cerita target
   */
  focusMapMarker(storyId) {
    const marker = this.#markers[storyId];
    if (marker) {
      this.#map.setView(marker.getLatLng(), 12);
      marker.openPopup();

      // Memperbarui visual marker aktif
      marker.setIcon(
        L.icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      );

      // Reset marker lainnya ke status default
      Object.keys(this.#markers).forEach((id) => {
        if (id !== storyId) {
          this.#markers[id].setIcon(
            L.icon({
              iconUrl:
                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
              shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            }),
          );
        }
      });
    }
  }

  showLoading() {
    const container = document.querySelector("#storiesContainer");
    container.innerHTML = "<p>Memperbarui daftar cerita...</p>";
  }

  hideLoading() {
    // Dipanggil secara implisit setelah renderStories selesai
  }

  showError(message) {
    const errorDiv = document.querySelector("#errorMessage");
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
  }

  /**
   * Prosedur pembersihan instance peta saat perpindahan rute
   */
  onPageLeave() {
    if (this.#map) {
      try {
        this.#map.remove();
      } catch (error) {
        console.warn("Error removing map:", error);
      } finally {
        this.#map = null;
        this.#markers = {};
      }
    }
  }
}

export default HomePage;
