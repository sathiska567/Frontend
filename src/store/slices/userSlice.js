// src/store/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

const initialState = {
  profile: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.error = null;
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserState, clearUserProfile } = userSlice.actions;

export default userSlice.reducer;
