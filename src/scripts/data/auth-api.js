import CONFIG from "../config";

class Auth {
  static ENDPOINT = {
    REGISTER: `${CONFIG.BASE_URL}/register`,
    LOGIN: `${CONFIG.BASE_URL}/login`,
  };

  static async register(name, email, password) {
    try {
      const response = await fetch(this.ENDPOINT.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Gagal Register");
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const response = await fetch(this.ENDPOINT.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error("Email atau password salah!");
      }
      return result.loginResult;
    } catch (error) {
      throw error;
    }
  }

  static logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  }

  static isLogin() {
    return !!localStorage.getItem("authToken");
  }

  static getToken() {
    return localStorage.getItem("authToken");
  }

  static saveToken(token, userId) {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", userId);
  }

  static getUserId() {
    return localStorage.getItem("userId");
  }
}

export default Auth;
