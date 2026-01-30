import AsyncStorage from "@react-native-async-storage/async-storage";
import apiService from "./api";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

export const authService = {
  // Token management
  async saveToken(token) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving token:", error);
      throw error;
    }
  },

  async getToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  async removeToken() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error("Error removing token:", error);
      throw error;
    }
  },

  // User data management
  async saveUserData(userData) {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving user data:", error);
      throw error;
    }
  },

  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  },

  // Authentication methods
  async register(userData) {
    try {
      const response = await apiService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await apiService.login(credentials);

      if (response.access_token) {
        await this.saveToken(response.access_token);

        // Fetch user profile after login
        const userProfile = await apiService.getUserProfile(
          response.access_token,
        );
        await this.saveUserData(userProfile);

        return {
          ...response,
          user: userProfile,
        };
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await this.removeToken();
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const token = await this.getToken();
      if (!token) return null;

      const userProfile = await apiService.getUserProfile(token);
      await this.saveUserData(userProfile);
      return userProfile;
    } catch (error) {
      console.error("Error getting current user:", error);
      // If token is invalid, remove it
      await this.removeToken();
      return null;
    }
  },

  async isAuthenticated() {
    try {
      const token = await this.getToken();
      if (!token) return false;

      // Try to fetch user profile to validate token
      await apiService.getUserProfile(token);
      return true;
    } catch (error) {
      // Token is invalid, remove it
      await this.removeToken();
      return false;
    }
  },

  async deleteAccount() {
    try {
      const token = await this.getToken();
      if (!token) throw new Error("No authentication token found");

      await apiService.deleteUser(token);
      await this.removeToken();
    } catch (error) {
      throw error;
    }
  },
};

// export const hashPassword = async (password) => {
//   return password;
// };

// export const verifyPassword = async (password, hashedPassword) => {
//   return password === hashedPassword;
// };

export const generateTemporaryPassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
