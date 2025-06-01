// src/store/slices/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  currentPage: "home",
  notifications: [],
  theme: "light",
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const {
  setLoading,
  setCurrentPage,
  addNotification,
  removeNotification,
  toggleSidebar,
  toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
