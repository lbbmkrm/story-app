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
      this.#view.showError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}

export default AddPresenter;
