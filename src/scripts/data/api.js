const BASE_URL = "https://story-api.dicoding.dev/v1";

/**
 * StoryApi menyediakan layanan komunikasi dengan Story App API.
 * Menangani otentikasi dan pengelolaan data cerita.
 */
class StoryApi {
  /**
   * Mengambil token otentikasi dari penyimpanan lokal
   * @returns {string|null} Token JWT
   */
  static #getAuthToken() {
    return localStorage.getItem("authToken");
  }

  /**
   * Menangani pendaftaran pengguna baru
   * @param {string} name - Nama lengkap
   * @param {string} email - Alamat email unik
   * @param {string} password - Kata sandi (min. 6 karakter)
   */
  static async register(name, email, password) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const responseJson = await response.json();
    if (!response.ok) throw new Error(responseJson.message);
    return responseJson;
  }

  /**
   * Menangani proses login pengguna
   * @param {string} email - Alamat email terdaftar
   * @param {string} password - Kata sandi
   */
  static async login(email, password) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const responseJson = await response.json();
    if (!response.ok) throw new Error(responseJson.message);
    return responseJson;
  }

  /**
   * Mengambil daftar seluruh cerita yang tersedia dari server
   * @returns {Promise<Array>} Array objek cerita
   */
  static async getAllStories() {
    const token = this.#getAuthToken();
    const response = await fetch(`${BASE_URL}/stories`, {
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
    const token = this.#getAuthToken();
    const response = await fetch(`${BASE_URL}/stories`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const responseJson = await response.json();
    if (!response.ok) throw new Error(responseJson.message);
    return responseJson;
  }
}

export default StoryApi;
