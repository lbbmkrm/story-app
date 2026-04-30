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

  renderDetail(story) {
    const container = document.querySelector("#detailContent");
    container.innerHTML = `
      <article class="detail-article">
        <header class="detail-header">
          <h1 class="detail-title">${story.name}</h1>
          <div class="detail-meta">
            <span class="detail-date">📅 ${formatDate(story.createdAt)}</span>
            <span class="detail-location-text">📍 ${story.lat ? `${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}` : 'Lokasi tidak tersedia'}</span>
          </div>
        </header>

        <div class="detail-image-hero">
          <img src="${story.photoUrl}" alt="Foto dari ${story.name}" class="img-fluid rounded" />
        </div>

        <div class="detail-body">
          <h2 class="section-title">Cerita Lengkap</h2>
          <p class="detail-description">${story.description}</p>
        </div>

        ${story.lat && story.lon ? `
          <div class="detail-map-section">
            <h2 class="section-title">Lokasi di Peta</h2>
            <div id="miniMap" class="mini-map-container"></div>
          </div>
        ` : ''}
      </article>
    `;
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
