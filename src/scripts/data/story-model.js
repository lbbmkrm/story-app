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

  static async getStoryDetail(id) {
    return await StoryApi.getStoryDetail(id);
  }

  static async subscribePushNotification(subscription) {
    return await StoryApi.subscribePushNotification(subscription);
  }

  static async unsubscribePushNotification(subscription) {
    return await StoryApi.unsubscribePushNotification(subscription);
  }
}

export default StoryModel;
