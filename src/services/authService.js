/* eslint-disable no-unused-vars */
// src/services/authService.js
import { authApi } from "./api";
import Cookies from "js-cookie";
import { API_BASE_URL_Auth } from "../config/config";

// Constants for storage keys
const ACCESS_TOKEN_KEY = "access_token";
const USER_EMAIL_KEY = "user_email";
const USER_DATA_KEY = "user_data";
const REFRESH_TOKEN_COOKIE = "refresh_token";

// Token expiration time in milliseconds (58 minutes to refresh before the full 60 minutes)
const TOKEN_EXPIRY_TIME = 58 * 60 * 1000;

const authService = {
  register: async (userData) => {
    const response = await authApi.post("/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await authApi.post("/login", credentials);
    if (response.data.access_token) {
      // Store access token in localStorage
      localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access_token);
      // Store refresh token in cookies (HttpOnly would be better, but needs server setup)
      Cookies.set(REFRESH_TOKEN_COOKIE, response.data.refresh_token, {
        expires: 30, // 30 days
        // eslint-disable-next-line no-undef
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });

      // Store user email for refresh purposes
      if (credentials.email) {
        localStorage.setItem(USER_EMAIL_KEY, credentials.email);
      }

      // Set token creation time
      localStorage.setItem("token_created_at", Date.now().toString());
    }
    return response.data;
  },

  googleLogin: () => {
    // Google login URL
    window.location.href = `${API_BASE_URL_Auth}/google-login`;

    // Return a promise to make it compatible with dispatch
    return Promise.resolve();
  },

  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem("token_created_at");
    Cookies.remove(REFRESH_TOKEN_COOKIE);
  },

  refreshToken: async () => {
    try {
      const email = localStorage.getItem(USER_EMAIL_KEY);
      const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);

      if (!refreshToken || !email) {
        throw new Error("No refresh token available");
      }

      const response = await authApi.post(
        "/refresh",
        { email },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      if (
        response.data &&
        response.data.data &&
        response.data.data.access_token
      ) {
        localStorage.setItem(ACCESS_TOKEN_KEY, response.data.data.access_token);
        localStorage.setItem("token_created_at", Date.now().toString());
        return response.data.data.access_token;
      } else {
        throw new Error("Invalid refresh token response");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      // Force logout if refresh fails
      authService.logout();
      throw error;
    }
  },

  isTokenExpired: () => {
    const tokenCreatedAt = localStorage.getItem("token_created_at");
    if (!tokenCreatedAt) return true;

    const now = Date.now();
    const createdAt = parseInt(tokenCreatedAt);

    // Check if token is about to expire (58 minutes)
    return now - createdAt > TOKEN_EXPIRY_TIME;
  },

  getAccessToken: async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) return null;

    // Check if token is expired and refresh if needed
    if (authService.isTokenExpired()) {
      try {
        return await authService.refreshToken();
      } catch (error) {
        return null;
      }
    }

    return token;
  },

  getCurrentUser: () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const email = localStorage.getItem(USER_EMAIL_KEY);

    return token && email ? { token, email } : null;
  },

  isAuthenticated: async () => {
    try {
      const token = await authService.getAccessToken();
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // Delete account function
  deleteAccount: async () => {
    try {
      const response = await authApi.delete("/delete-account");
      authService.logout();
      return response.data;
    } catch (error) {
      console.error("Error deleting account:", error.response || error);
      throw new Error(
        error.response?.data?.message || "Failed to delete account"
      );
    }
  },

  // Password reset flow methods
  requestPasswordReset: async (email) => {
    const response = await authApi.post("/forgot-password", { email });
    return response.data;
  },

  verifyPasswordOtp: async (email, otp) => {
    const response = await authApi.post("/verify-password-otp", {
      email,
      otp,
    });
    return response.data;
  },

  resetPassword: async (email, otp, newPassword) => {
    const response = await authApi.post("/reset-password", {
      email,
      otp,
      new_password: newPassword,
    });
    return response.data;
  },
};

export default authService;
