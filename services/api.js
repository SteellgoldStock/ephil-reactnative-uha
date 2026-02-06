const API_BASE_URL = "https://api.penderlin.fr";

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { message: text };
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        password: userData.password,
      }),
    });
  }

  async login(credentials) {
    return this.makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
  }

  // User endpoints
  async getUserProfile(token) {
    return this.makeRequest("/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteUser(token) {
    return this.makeRequest("/user/me", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new ApiService();
