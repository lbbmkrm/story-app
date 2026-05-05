import StoryApi from "./story-api";
import FavoriteStoryIdb from "./favorite-story-idb";

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

  static async getAllFavoriteStories() {
    return await FavoriteStoryIdb.getAllStories();
  }

  static async getFavoriteStory(id) {
    return await FavoriteStoryIdb.getStory(id);
  }

  static async putFavoriteStory(story) {
    return await FavoriteStoryIdb.putStory(story);
  }

  static async deleteFavoriteStory(id) {
    return await FavoriteStoryIdb.deleteStory(id);
  }

  static async searchFavoriteStories(query) {
    return await FavoriteStoryIdb.searchStories(query);
  }

  static async subscribePushNotification(subscription) {
    return await StoryApi.subscribePushNotification(subscription);
  }

  static async unsubscribePushNotification(subscription) {
    return await StoryApi.unsubscribePushNotification(subscription);
  }
}

export default StoryModel;
