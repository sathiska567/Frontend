// src/services/userService.js
import { userApi } from "./api";

const userService = {
  getProfile: async () => {
    try {
      const response = await userApi.get("/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error.response || error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await userApi.put("/profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error.response || error);
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  },
};

export default userService;
