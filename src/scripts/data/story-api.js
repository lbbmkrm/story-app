import CONFIG from "../config";
import Auth from "./auth-api";

/**
 * StoryApi menyediakan layanan komunikasi dengan Story App API.
 * Khusus untuk pengelolaan data cerita (Stories).
 */
class StoryApi {
  static ENDPOINT = {
    STORIES: `${CONFIG.BASE_URL}/stories`,
  };

  /**
   * Mengambil daftar seluruh cerita yang tersedia dari server
   * @returns {Promise<Array>} Array objek cerita
   */
  static async getAllStories() {
    const token = Auth.getToken();
    if (!token) throw new Error("Akses ditolak. Silakan login kembali.");

    const response = await fetch(this.ENDPOINT.STORIES, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const responseJson = await response.json();
    if (!response.ok) throw new Error(responseJson.message);
    return responseJson.listStory;
  }

  /**
   * Mengirim cerita baru ke server menggunakan format FormData
   * @param {FormData} formData - Berisi deskripsi, foto (blob), dan koordinat lokasi (opsional)
   */
  static async addStory(formData) {
    const token = Auth.getToken();
    if (!token) throw new Error("Akses ditolak. Silakan login kembali.");

    const response = await fetch(this.ENDPOINT.STORIES, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const responseJson = await response.json();
    if (!response.ok) throw new Error(responseJson.message);
    return responseJson;
  }
  /**
   * Mengambil detail cerita spesifik berdasarkan ID
   * @param {string} id - ID unik cerita
   * @returns {Promise<Object>} Objek detail cerita
   */
  static async getStoryDetail(id) {
    const token = Auth.getToken();
    if (!token) throw new Error("Akses ditolak. Silakan login kembali.");

    const response = await fetch(`${this.ENDPOINT.STORIES}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const responseJson = await response.json();
    if (!response.ok) throw new Error(responseJson.message);
    return responseJson.story;
  }
}

export default StoryApi;
