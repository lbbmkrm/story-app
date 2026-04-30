import StoryApi from "./story-api";

/**
 * StoryModel menangani logika bisnis terkait pengelolaan cerita.
 * Bertanggung jawab untuk pengambilan dan pengiriman data cerita ke API.
 */
class StoryModel {
  static async getAllStories() {
    return await StoryApi.getAllStories();
  }

  static async addStory(formData) {
    return await StoryApi.addStory(formData);
  }
}

export default StoryModel;
