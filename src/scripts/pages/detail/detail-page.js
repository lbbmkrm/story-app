import DetailPresenter from "./detail-presenter";
import StoryModel from "../../data/story-model";
import { formatDate } from "../../utils";

class DetailPage {
  #presenter;
  #map;

  constructor() {
    this.#presenter = new DetailPresenter({
      view: this,
      model: StoryModel,
    });
  }

  async render() {
    return `
      <div class="detail-container">
        <div class="container">
          <div class="detail-content-wrapper">
            <nav class="breadcrumb" aria-label="Breadcrumb">
              <a href="#/" class="back-link">← Kembali ke Daftar Cerita</a>
            </nav>

            <div id="detailContent" class="detail-card">
              <div class="detail-loading">Memuat detail cerita...</div>
            </div>

            <div id="errorMessage" class="error-message" style="display: none; margin: 20px 0;"></div>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    await this.#presenter.loadDetail();
  }

  async renderDetail(story) {
    const container = document.querySelector("#detailContent");
    
    const favoriteStory = await StoryModel.getFavoriteStory(story.id);
    const isFavorite = !!favoriteStory;

    container.innerHTML = `
      <article class="detail-article">
        <header class="detail-header">
          <div class="detail-title-row" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
            <h1 class="detail-title" style="margin: 0;">${story.name}</h1>
            <button 
              id="favoriteBtnDetail" 
              class="btn-favorite" 
              aria-label="${isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}"
              title="${isFavorite ? "Hapus dari favorit" : "Tambah ke favorit"}"
              style="display: flex; align-items: center; justify-content: center; background: none; border: none; cursor: pointer;"
            >
              ${isFavorite ? '<span class="material-icons-outlined" style="font-size: 2.5rem; color: #ef4444;">favorite</span>' : '<span class="material-icons-outlined" style="font-size: 2.5rem;">favorite_border</span>'}
            </button>
          </div>
          <div class="detail-meta" style="display: flex; flex-wrap: wrap; gap: 16px; margin-top: 12px;">
            <span class="detail-date" style="display: inline-flex; align-items: center; gap: 6px;">
              <span class="material-icons-outlined" style="font-size: 18px;">event</span>
              ${formatDate(story.createdAt)}
            </span>
            <span class="detail-location-text" style="display: inline-flex; align-items: center; gap: 6px;">
              <span class="material-icons-outlined" style="font-size: 18px;">place</span>
              ${story.lat !== null && story.lon !== null ? `${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}` : 'Lokasi tidak tersedia'}
            </span>
          </div>
        </header>

        <div class="detail-image-hero">
          <img src="${story.photoUrl}" alt="Foto dari ${story.name}" class="img-fluid rounded" />
        </div>

        <div class="detail-body">
          <h2 class="section-title">Cerita Lengkap</h2>
          <p class="detail-description">${story.description}</p>
        </div>

        ${story.lat !== null && story.lon !== null ? `
          <div class="detail-map-section">
            <h2 class="section-title">Lokasi di Peta</h2>
            <div id="miniMap" class="mini-map-container"></div>
          </div>
        ` : ''}
      </article>
    `;

    const favoriteBtn = document.querySelector("#favoriteBtnDetail");
    favoriteBtn.addEventListener("click", async () => {
      const iconElement = favoriteBtn.querySelector(".material-icons-outlined");
      const isCurrentlyFavorite = iconElement.textContent === "favorite";
      
      if (isCurrentlyFavorite) {
        await StoryModel.deleteFavoriteStory(story.id);
        iconElement.textContent = "favorite_border";
        iconElement.style.color = "";
        favoriteBtn.setAttribute("aria-label", "Tambah ke favorit");
      } else {
        await StoryModel.putFavoriteStory(story);
        iconElement.textContent = "favorite";
        iconElement.style.color = "#ef4444";
        favoriteBtn.setAttribute("aria-label", "Hapus dari favorit");
      }
    });
  }

  initializeMiniMap(lat, lon, name) {
    const mapElement = document.querySelector("#miniMap");
    if (!mapElement) return;

    this.#map = L.map(mapElement).setView([lat, lon], 13);
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.#map);

    L.marker([lat, lon])
      .addTo(this.#map)
      .bindPopup(`<b>${name}</b> ada di sini.`)
      .openPopup();
  }

  showLoading() {
    const container = document.querySelector("#detailContent");
    container.innerHTML = '<div class="detail-loading">Menyelami cerita...</div>';
  }

  showError(message) {
    const errorDiv = document.querySelector("#errorMessage");
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    
    const container = document.querySelector("#detailContent");
    container.innerHTML = '';
  }

  onPageLeave() {
    if (this.#map) {
      this.#map.remove();
      this.#map = null;
    }
  }
}

export default DetailPage;
