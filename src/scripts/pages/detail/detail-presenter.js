import StoryModel from "../../data/story-model";
import AuthModel from "../../data/auth-model";
import { parseActivePathname } from "../../routes/url-parser";

class DetailPresenter {
  #view;
  #model;
  #storyId;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async loadDetail() {
    try {
      if (!AuthModel.isUserLoggedIn()) {
        window.location.hash = "#/login";
        return;
      }

      const { id } = parseActivePathname();
      this.#storyId = id;

      if (!this.#storyId) {
        throw new Error("ID Cerita tidak ditemukan di URL.");
      }

      this.#view.showLoading();
      const story = await this.#model.getStoryDetail(this.#storyId);
      await this.#view.renderDetail(story);
      
      if (story.lat !== null && story.lon !== null) {
        this.#view.initializeMiniMap(story.lat, story.lon, story.name);
      }
    } catch (error) {
      this.#view.showError(error.message);
    }
  }
}

export default DetailPresenter;
