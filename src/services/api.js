// src/services/api.js
import axios from "axios";
import authService from "./authService";
import {
  API_BASE_URL_Auth,
  API_BASE_URL_User,
  API_BASE_URL_Image,
  API_BASE_URL_Payment,
} from "../config/config";

// Base URLs for different microservices
const AUTH_API_URL = `${API_BASE_URL_Auth}`;
const USER_API_URL = `${API_BASE_URL_User}`;
const IMAGE_API_URL = `${API_BASE_URL_Image}`;
const PAYMENT_API_URL = `${API_BASE_URL_Payment}`;

// Create API instances for each service
const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const userApi = axios.create({
  baseURL: USER_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const imageApi = axios.create({
  baseURL: IMAGE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const paymentApi = axios.create({
  baseURL: PAYMENT_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// Request interceptor to add auth token to requests
const setupInterceptors = () => {
  // Update config with current token
  const updateConfig = async (config) => {
    try {
      const token = await authService.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error setting auth header:", error);
    }
    return config;
  };

  userApi.interceptors.request.use(updateConfig);
  imageApi.interceptors.request.use(updateConfig);
  paymentApi.interceptors.request.use(updateConfig);

  // Response interceptor to handle common errors
  const handleResponse = (response) => response;

  const handleError = async (error) => {
    const originalRequest = error.config;

    // Handle 401 unauthorized errors (expired token)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const newToken = await authService.refreshToken();

        if (newToken) {
          // Update the header with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          // Retry the original request with the new token
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error("Token refresh failed:", refreshError);
        window.dispatchEvent(new CustomEvent("auth:sessionExpired"));
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  };

  userApi.interceptors.response.use(handleResponse, handleError);
  imageApi.interceptors.response.use(handleResponse, handleError);
  authApi.interceptors.response.use(handleResponse, handleError);
  paymentApi.interceptors.response.use(handleResponse, handleError);
};

// Initialize interceptors
setupInterceptors();

export { authApi, userApi, imageApi, paymentApi };
