import StoryModel from "../../data/story-model";

class AddPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async addStory(formData) {
    try {
      this.#view.showLoading();
      await this.#model.addStory(formData);
      
      this.#view.showSuccess("Cerita berhasil dibagikan!");
      setTimeout(() => {
        window.location.hash = "#/";
      }, 2000);
    } catch (error) {
      if (!navigator.onLine) {
        this.#view.showSuccess(
          "Anda sedang offline. Cerita telah disimpan secara lokal dan akan otomatis diunggah saat koneksi internet tersedia."
        );
        setTimeout(() => {
          window.location.hash = "#/";
        }, 4000);
      } else {
        this.#view.showError(error.message || "Gagal membagikan cerita. Silakan coba lagi.");
      }
    } finally {
      this.#view.hideLoading();
    }
  }
}

export default AddPresenter;
