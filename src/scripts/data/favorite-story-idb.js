import { openDB } from "idb";
import CONFIG from "../config";

const { DATABASE_NAME, DATABASE_VERSION, OBJECT_STORE_NAME } = {
  DATABASE_NAME: "story-app-db",
  DATABASE_VERSION: 1,
  OBJECT_STORE_NAME: "favorites",
};

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    db.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
  },
});

const FavoriteStoryIdb = {
  async getStory(id) {
    if (!id) return;
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async putStory(story) {
    if (!story.hasOwnProperty("id")) return;
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },

  async deleteStory(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },

  // Fitur Pencarian (Untuk kriteria Skilled)
  async searchStories(query) {
    const allStories = await this.getAllStories();
    return allStories.filter((story) => 
      story.name.toLowerCase().includes(query.toLowerCase()) ||
      story.description.toLowerCase().includes(query.toLowerCase())
    );
  },
};

export default FavoriteStoryIdb;
