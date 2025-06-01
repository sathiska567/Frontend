// src/store/slices/imageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import imageService from "../../services/imageService";

// Async thunks for image actions
export const uploadImage = createAsyncThunk(
  "images/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await imageService.uploadImage(formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload image"
      );
    }
  }
);

export const uploadBatchImages = createAsyncThunk(
  "images/uploadBatch",
  async ({ formData, onProgress }, { rejectWithValue }) => {
    try {
      const response = await imageService.uploadBatchImages(
        formData,
        onProgress
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload images"
      );
    }
  }
);

export const deleteImage = createAsyncThunk(
  "images/delete",
  async ({ imageId, albumId }, { rejectWithValue }) => {
    try {
      await imageService.deleteImage(imageId);
      return { imageId, albumId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete image"
      );
    }
  }
);

export const addKeyword = createAsyncThunk(
  "images/addKeyword",
  async ({ keyword_name, image_id, album_id }, { rejectWithValue }) => {
    try {
      const response = await imageService.addKeyword({
        keyword_name,
        image_id,
        album_id,
      });
      return {
        keyword: keyword_name,
        imageId: image_id,
        albumId: album_id,
        response,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add keyword"
      );
    }
  }
);

export const deleteKeyword = createAsyncThunk(
  "images/deleteKeyword",
  async ({ keyword_name, image_id, album_id }, { rejectWithValue }) => {
    try {
      const response = await imageService.deleteKeyword({
        keyword_name,
        image_id,
        album_id,
      });
      return {
        keyword: keyword_name,
        imageId: image_id,
        albumId: album_id,
        response,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete keyword"
      );
    }
  }
);

export const updateImageTitle = createAsyncThunk(
  "images/updateTitle",
  async ({ imageId, title }, { rejectWithValue }) => {
    try {
      const response = await imageService.updateImageTitle(imageId, title);
      return { imageId, title, response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update image title"
      );
    }
  }
);

export const updateImageDescription = createAsyncThunk(
  "images/updateDescription",
  async ({ imageId, description }, { rejectWithValue }) => {
    try {
      const response = await imageService.updateImageDescription(
        imageId,
        description
      );
      return { imageId, description, response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update image description"
      );
    }
  }
);

export const regenerateTags = createAsyncThunk(
  "images/regenerateTags",
  async ({ imageId, prompt }, { rejectWithValue }) => {
    try {
      const response = await imageService.regenerateTags(imageId, prompt || "");
      return { imageId, keywords: response.keywords, response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to regenerate tags"
      );
    }
  }
);

const initialState = {
  uploadedImage: null,
  uploadedBatchImages: [],
  isUploading: false,
  uploadSuccess: false,
  currentImage: null,
  uploadProgress: null, // Add progress tracking
  error: null,
};

const imageSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    resetImageState: (state) => {
      state.error = null;
      state.isUploading = false;
      state.uploadSuccess = false;
      state.uploadProgress = null;
    },
    setCurrentImage: (state, action) => {
      state.currentImage = action.payload;
    },
    clearUploadedImages: (state) => {
      state.uploadedImage = null;
      state.uploadedBatchImages = [];
      state.uploadSuccess = false;
      state.uploadProgress = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload single image
      .addCase(uploadImage.pending, (state) => {
        state.isUploading = true;
        state.error = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadedImage = action.payload.image;
        state.uploadSuccess = true;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload;
        state.uploadSuccess = false;
      })

      // Upload batch images
      .addCase(uploadBatchImages.pending, (state) => {
        state.isUploading = true;
        state.error = null;
        state.uploadSuccess = false;
        state.uploadProgress = null;
      })
      .addCase(uploadBatchImages.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadedBatchImages = action.payload.images;
        state.uploadSuccess = true;
        state.uploadProgress = null;
      })
      .addCase(uploadBatchImages.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload;
        state.uploadSuccess = false;
        state.uploadProgress = null;
      })

      // Delete image
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.uploadSuccess = true;
        if (
          state.currentImage &&
          state.currentImage.image_id === action.payload.imageId
        ) {
          state.currentImage = null;
        }
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Add keyword
      .addCase(addKeyword.fulfilled, (state, action) => {
        if (
          state.currentImage &&
          state.currentImage.image_id === action.payload.imageId
        ) {
          if (!state.currentImage.keywords) {
            state.currentImage.keywords = [];
          }
          if (!state.currentImage.keywords.includes(action.payload.keyword)) {
            state.currentImage.keywords.push(action.payload.keyword);
          }
        }
      })
      .addCase(addKeyword.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete keyword
      .addCase(deleteKeyword.fulfilled, (state, action) => {
        if (
          state.currentImage &&
          state.currentImage.image_id === action.payload.imageId
        ) {
          state.currentImage.keywords = state.currentImage.keywords.filter(
            (keyword) => keyword !== action.payload.keyword
          );
        }
      })
      .addCase(deleteKeyword.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update image title
      .addCase(updateImageTitle.fulfilled, (state, action) => {
        if (
          state.currentImage &&
          state.currentImage.image_id === action.payload.imageId
        ) {
          state.currentImage.title = action.payload.title;
        }
      })
      .addCase(updateImageTitle.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update image description
      .addCase(updateImageDescription.fulfilled, (state, action) => {
        if (
          state.currentImage &&
          state.currentImage.image_id === action.payload.imageId
        ) {
          state.currentImage.description = action.payload.description;
        }
      })
      .addCase(updateImageDescription.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Regenerate tags
      .addCase(regenerateTags.fulfilled, (state, action) => {
        if (
          state.currentImage &&
          state.currentImage.image_id === action.payload.imageId
        ) {
          state.currentImage.keywords = action.payload.keywords;
        }
      })
      .addCase(regenerateTags.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  resetImageState,
  setCurrentImage,
  clearUploadedImages,
  setUploadProgress,
} = imageSlice.actions;

export default imageSlice.reducer;
