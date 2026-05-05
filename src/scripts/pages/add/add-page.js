import AddPresenter from "./add-presenter";
import StoryModel from "../../data/story-model";

export default class AddPage {
  #presenter;
  #stream = null;
  #map = null;
  #marker = null;
  #selectedLocation = null;
  #selectedFile = null;

  constructor() {
    this.#presenter = new AddPresenter({
      view: this,
      model: StoryModel,
    });
  }

  async render() {
    return `
      <div class="add-story-container">
        <div class="container">
          <div class="add-card">
            <nav class="breadcrumb" style="margin-bottom: 24px;">
              <a href="#/" class="back-link" style="display: inline-flex; align-items: center; gap: 4px;">
                <span class="material-icons-outlined" style="font-size: 18px;">arrow_back</span>
                Kembali ke Beranda
              </a>
            </nav>

            <section aria-labelledby="addTitle">
              <h1 id="addTitle" class="section-title">Bagikan Cerita Anda</h1>
              <p class="auth-subtitle">Bagikan momen dan lokasimu sekarang untuk dunia</p>
  
              <form id="addStoryForm" class="auth-form" aria-label="Form Tambah Cerita">
                <div class="form-group">
                  <label for="description">Ceritakan momenmu</label>
                  <textarea 
                    id="description" 
                    name="description" 
                    required 
                    aria-required="true"
                    placeholder="Tuliskan sesuatu yang menarik..." 
                    style="min-height: 120px;"
                  ></textarea>
                </div>
  
                <div class="form-group">
                  <label>Foto Cerita</label>
                  <div class="camera-wrapper" role="region" aria-label="Kamera dan Preview Foto">
                    <video id="video" class="camera-video" autoplay playsinline aria-label="Tampilan kamera langsung"></video>
                    <canvas id="canvas" style="display: none;"></canvas>
                    <img id="photoPreview" class="camera-preview" alt="Preview foto" style="display: none;" />
                    
                    <div class="camera-controls">
                      <button type="button" id="captureBtn" class="btn btn-primary btn-capture" aria-label="Ambil Foto" style="display: flex; align-items: center; justify-content: center;">
                        <span class="material-icons-outlined" style="font-size: 24px;">photo_camera</span>
                      </button>
                      <button type="button" id="retakeBtn" class="btn btn-outline" aria-label="Ganti Foto" style="display: none; background: white;">Ganti Foto</button>
                    </div>
                  </div>
  
                  <div style="text-align: center;">
                    <input type="file" id="fileInput" name="photo" accept="image/*" style="display: none;">
                    <button type="button" id="browseBtn" class="btn btn-outline" style="width: 100%;" aria-label="Pilih foto dari galeri perangkat">Pilih dari Galeri</button>
                  </div>
                </div>
  
                <div class="form-group">
                  <label for="mapPickerSearch" id="mapPickerLabel">Lokasi Cerita (Ketuk di Peta)</label>
                  <p id="mapInstruction" style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">Opsional: Tandai lokasi di mana momen ini terjadi</p>
                  <input type="text" id="mapPickerSearch" aria-hidden="true">
                  <div id="mapPicker" class="map-picker-container" role="application" aria-labelledby="mapPickerLabel" aria-describedby="mapInstruction"></div>
                  <input type="hidden" id="lat" name="lat">
                  <input type="hidden" id="lon" name="lon">
                </div>
  
                <div id="errorMessage" class="error-message" role="alert" aria-live="polite" style="display: none; margin-bottom: 20px;"></div>
                <div id="successMessage" class="success-message" role="status" aria-live="polite" style="display: none; margin-bottom: 20px; padding: 12px; background: #f0fdf4; color: #166534; border-radius: 8px; border: 1px solid #bbf7d0;"></div>
  
                <div style="display: flex; gap: 16px; margin-top: 32px;">
                  <a href="#/" class="btn btn-outline" style="flex: 1;">Batal</a>
                  <button type="submit" id="submitBtn" class="btn btn-primary" style="flex: 2;">Bagikan Sekarang</button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    this.#initCamera();
    this.#initMapPicker();

    const form = document.querySelector("#addStoryForm");
    form.addEventListener("submit", (e) => this.#handleSubmit(e));

    const descriptionInput = document.querySelector("#description");
    descriptionInput.addEventListener("input", () => {
      if (descriptionInput.value.trim().length > 0) {
        descriptionInput.classList.remove("is-invalid");
      } else {
        descriptionInput.classList.add("is-invalid");
      }
    });

    document.querySelector("#captureBtn").addEventListener("click", () => this.#capturePhoto());
    document.querySelector("#retakeBtn").addEventListener("click", () => this.#retakePhoto());
    
    const fileInput = document.querySelector("#fileInput");
    const browseBtn = document.querySelector("#browseBtn");
    
    browseBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => this.#handleFileChange(e));
  }

  async #initCamera() {
    try {
      this.#stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      const video = document.querySelector("#video");
      video.srcObject = this.#stream;
    } catch (err) {
      console.warn("Camera access failed or denied:", err);
    }
  }

  #handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      this.#selectedFile = file;
      const reader = new FileReader();
      reader.onload = (event) => {
        this.#showPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  #capturePhoto() {
    const video = document.querySelector("#video");
    const canvas = document.querySelector("#canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    const imgData = canvas.toDataURL("image/jpeg");
    this.#selectedFile = null;
    this.#showPreview(imgData);
  }

  #showPreview(src) {
    const video = document.querySelector("#video");
    const photoPreview = document.querySelector("#photoPreview");
    const captureBtn = document.querySelector("#captureBtn");
    const retakeBtn = document.querySelector("#retakeBtn");
    const browseBtn = document.querySelector("#browseBtn");

    photoPreview.src = src;
    video.style.display = "none";
    photoPreview.style.display = "block";
    captureBtn.style.display = "none";
    retakeBtn.style.display = "block";
    browseBtn.style.display = "none";

    this.#stopCamera();
  }

  #retakePhoto() {
    const video = document.querySelector("#video");
    const photoPreview = document.querySelector("#photoPreview");
    const captureBtn = document.querySelector("#captureBtn");
    const retakeBtn = document.querySelector("#retakeBtn");
    const browseBtn = document.querySelector("#browseBtn");
    const fileInput = document.querySelector("#fileInput");

    video.style.display = "block";
    photoPreview.style.display = "none";
    captureBtn.style.display = "block";
    retakeBtn.style.display = "none";
    browseBtn.style.display = "block";
    fileInput.value = ""; 
    this.#selectedFile = null;

    this.#initCamera();
  }

  #stopCamera() {
    if (this.#stream) {
      this.#stream.getTracks().forEach(track => track.stop());
      this.#stream = null;
    }
  }

  #initMapPicker() {
    const mapContainer = document.querySelector("#mapPicker");
    
    if (mapContainer && mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
    }

    try {
      this.#map = L.map(mapContainer).setView([-2.5489, 118.0149], 5);
    } catch (error) {
      console.warn("Leaflet picker init warning:", error);
    }
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    }).addTo(this.#map);

    this.#map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (this.#marker) {
        this.#marker.setLatLng(e.latlng);
      } else {
        this.#marker = L.marker(e.latlng).addTo(this.#map);
      }
      this.#selectedLocation = { lat, lng };
      document.querySelector("#lat").value = lat;
      document.querySelector("#lon").value = lng;
    });

    setTimeout(() => this.#map.invalidateSize(), 100);
  }

  async #handleSubmit(e) {
    e.preventDefault();
    const description = document.querySelector("#description").value;
    const photoPreview = document.querySelector("#photoPreview");

    if (photoPreview.style.display === "none") {
      this.showError("Harap pilih atau ambil foto terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    
    if (this.#selectedLocation) {
      formData.append("lat", this.#selectedLocation.lat);
      formData.append("lon", this.#selectedLocation.lng);
    }

    if (this.#selectedFile) {
      formData.append("photo", this.#selectedFile);
      await this.#presenter.addStory(formData);
    } else {
      const canvas = document.querySelector("#canvas");
      canvas.toBlob(async (blob) => {
        formData.append("photo", blob, "camera-photo.jpg");
        await this.#presenter.addStory(formData);
      }, "image/jpeg");
    }
  }

  showLoading() {
    const btn = document.querySelector("#submitBtn");
    btn.disabled = true;
    btn.textContent = "Mengunggah...";
  }

  hideLoading() {
    const btn = document.querySelector("#submitBtn");
    btn.disabled = false;
    btn.textContent = "Bagikan Cerita";
  }

  showError(message) {
    const err = document.querySelector("#errorMessage");
    err.textContent = message;
    err.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  showSuccess(message) {
    const success = document.querySelector("#successMessage");
    success.textContent = message;
    success.style.display = "block";
    document.querySelector("#errorMessage").style.display = "none";
  }

  onPageLeave() {
    this.#stopCamera();
    if (this.#map) {
      try {
        this.#map.remove();
      } catch (error) {
        console.warn("Error removing picker map:", error);
      } finally {
        this.#map = null;
      }
    }
  }
}
