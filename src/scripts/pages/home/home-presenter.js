import StoryModel from "../../data/story-model";
import AuthModel from "../../data/auth-model";

class HomePresenter {
  #view;
  #model;
  #stories = [];

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async loadStories() {
    try {
      if (!AuthModel.isUserLoggedIn()) {
        window.location.hash = "#/login";
        return;
      }
      this.#view.showLoading();
      this.#stories = await this.#model.getAllStories();
      this.#view.renderStories(this.#stories);
      this.#view.initializeMap(this.#stories);
    } catch (error) {
      this.#view.showError(error.message);
    }
  }

  getStories() {
    return this.#stories;
  }
  getStoryById(id) {
    return this.#stories.find((story) => story.id === id);
  }

  onStorySelected(storyId) {
    this.#view.highlightStory(storyId);
    this.#view.focusMapMarker(storyId);
  }
}

export default HomePresenter;
