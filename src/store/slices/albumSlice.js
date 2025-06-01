// src/store/slices/albumSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import imageService from "../../services/imageService";

// Async thunks for album actions
export const fetchAlbums = createAsyncThunk(
  "albums/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await imageService.getAlbums();
      return response.albums;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch albums"
      );
    }
  }
);

export const fetchAlbumsWithDetails = createAsyncThunk(
  "albums/fetchWithDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await imageService.getAlbumsWithDetails();
      return response.albums;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch album details"
      );
    }
  }
);

export const fetchAlbumDetails = createAsyncThunk(
  "albums/fetchById",
  async (albumId, { rejectWithValue }) => {
    try {
      const response = await imageService.getAlbumDetails(albumId);
      return { albumId, images: response.images };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch album details"
      );
    }
  }
);

export const deleteAlbum = createAsyncThunk(
  "albums/delete",
  async (albumId, { rejectWithValue }) => {
    try {
      await imageService.deleteAlbum(albumId);
      return albumId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete album"
      );
    }
  }
);

const initialState = {
  albums: [],
  albumsWithDetails: [],
  selectedAlbumDetails: null,
  selectedAlbumId: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

const albumSlice = createSlice({
  name: "albums",
  initialState,
  reducers: {
    selectAlbum: (state, action) => {
      state.selectedAlbumId = action.payload;
    },
    resetAlbumState: (state) => {
      state.error = null;
      state.isLoading = false;
    },
    resetAlbumData: (state) => {
      state.albums = [];
      state.albumsWithDetails = [];
      state.selectedAlbumDetails = null;
      state.selectedAlbumId = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all albums
      .addCase(fetchAlbums.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.isLoading = false;
        state.albums = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch albums with details
      .addCase(fetchAlbumsWithDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAlbumsWithDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.albumsWithDetails = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAlbumsWithDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch album by id
      .addCase(fetchAlbumDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAlbumDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedAlbumDetails = action.payload.images;
        state.selectedAlbumId = action.payload.albumId;
      })
      .addCase(fetchAlbumDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete album
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        const albumId = action.payload;
        state.albums = state.albums.filter(
          (album) => album.album_id !== albumId
        );
        state.albumsWithDetails = state.albumsWithDetails.filter(
          (album) => album.album_id !== albumId
        );
        if (state.selectedAlbumId === albumId) {
          state.selectedAlbumId = null;
          state.selectedAlbumDetails = null;
        }
      })
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { selectAlbum, resetAlbumState, resetAlbumData } =
  albumSlice.actions;

export default albumSlice.reducer;
