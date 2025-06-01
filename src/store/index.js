// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import albumReducer from "./slices/albumSlice";
import imageReducer from "./slices/imageSlice";
import uiReducer from "./slices/uiSlice";

// Configure persist for specific slices
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["isLoggedIn", "user"], // only persist these fields
};

// Configure persist for album and image slices (optional but useful)
const albumPersistConfig = {
  key: "albums",
  storage,
  whitelist: ["albums", "albumsWithDetails", "lastFetched"],
};

const imagePersistConfig = {
  key: "images",
  storage,
  whitelist: ["uploadedBatchImages", "currentImage"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  user: userReducer,
  albums: persistReducer(albumPersistConfig, albumReducer),
  images: persistReducer(imagePersistConfig, imageReducer),
  ui: uiReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types (persist/FLUSH, etc.)
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export default { store, persistor };
