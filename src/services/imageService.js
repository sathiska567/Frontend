// src/services/imageService.js
import { imageApi } from "./api";
import authService from "./authService";
import { API_BASE_URL_Image } from "../config/config";

const imageService = {
  // Single image upload
  uploadImage: async (formData) => {
    try {
      const response = await imageApi.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error during image upload:", error.response || error);

      // Rethrow the error with response data if available
      if (error.response && error.response.data) {
        error.message = error.response.data.message || "Failed to upload image";
        throw error; // This preserves the error.response object
      }

      throw new Error("Failed to upload image");
    }
  },

  // Batch image upload with streaming progress
  uploadBatchImages: async (formData, onProgress) => {
    try {
      // Get access token
      const token = await authService.getAccessToken();

      if (!token) {
        throw new Error("No access token available");
      }

      // Use fetch for streaming response
      const response = await fetch(
        `${API_BASE_URL_Image}/batch-upload-stream`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type for FormData, let browser set it with boundary
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || "Failed to upload images");
        error.response = { data: errorData };
        throw error;
      }

      // Check if response body exists
      if (!response.body) {
        throw new Error("ReadableStream not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finalResult = null;

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });

          // Process complete lines in the buffer
          let lines = buffer.split("\n");
          buffer = lines.pop(); // Keep incomplete line in buffer

          for (let line of lines) {
            line = line.trim();

            // Handle Server-Sent Events format: "data: {json}"
            if (line.startsWith("data: ")) {
              const jsonStr = line.substring(6).trim(); // Remove "data: " prefix

              if (jsonStr) {
                try {
                  const data = JSON.parse(jsonStr);

                  // Check if this is a progress update or final result
                  if (
                    data.total !== undefined &&
                    data.processed !== undefined &&
                    data.remaining !== undefined
                  ) {
                    // This is a progress update
                    if (onProgress) {
                      onProgress({
                        total: data.total,
                        processed: data.processed,
                        remaining: data.remaining,
                        percentage: Math.round(
                          (data.processed / data.total) * 100
                        ),
                      });
                    }
                  } else if (data.complete !== undefined && data.result) {
                    // This is the final result
                    finalResult = data;
                  }
                } catch (parseError) {
                  console.warn(
                    "Failed to parse SSE JSON:",
                    jsonStr,
                    parseError
                  );
                }
              }
            }
            // Handle plain JSON lines (fallback)
            else if (line.startsWith("{") && line.endsWith("}")) {
              try {
                const data = JSON.parse(line);

                if (
                  data.total !== undefined &&
                  data.processed !== undefined &&
                  data.remaining !== undefined
                ) {
                  if (onProgress) {
                    onProgress({
                      total: data.total,
                      processed: data.processed,
                      remaining: data.remaining,
                      percentage: Math.round(
                        (data.processed / data.total) * 100
                      ),
                    });
                  }
                } else if (data.complete !== undefined && data.result) {
                  finalResult = data;
                }
              } catch (parseError) {
                console.warn("Failed to parse JSON line:", line, parseError);
              }
            }
          }
        }

        // Process any remaining data in buffer
        if (buffer.trim()) {
          const remainingLine = buffer.trim();

          // Handle SSE format in remaining buffer
          if (remainingLine.startsWith("data: ")) {
            const jsonStr = remainingLine.substring(6).trim();
            if (jsonStr) {
              try {
                const data = JSON.parse(jsonStr);
                if (data.complete !== undefined && data.result) {
                  finalResult = data;
                }
              } catch (parseError) {
                console.warn(
                  "Failed to parse final SSE buffer:",
                  jsonStr,
                  parseError
                );
              }
            }
          }
          // Handle plain JSON in remaining buffer
          else if (
            remainingLine.startsWith("{") &&
            remainingLine.endsWith("}")
          ) {
            try {
              const data = JSON.parse(remainingLine);
              if (data.complete !== undefined && data.result) {
                finalResult = data;
              }
            } catch (parseError) {
              console.warn(
                "Failed to parse final JSON buffer:",
                remainingLine,
                parseError
              );
            }
          }
        }

        if (!finalResult || !finalResult.result) {
          throw new Error("No final result received from server");
        }

        return finalResult.result;
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error("Error during batch upload:", error);

      // If we have a response with data, preserve it for the caller
      if (error.response && error.response.data) {
        error.message =
          error.response.data.message || "Failed to upload images";
        throw error; // This preserves the error.response object with all the data
      }

      throw new Error(error.message || "Failed to upload images");
    }
  },

  // Get all albums
  getAlbums: async () => {
    try {
      const response = await imageApi.get("/albums");
      return response.data;
    } catch (error) {
      console.error("Error fetching albums:", error.response || error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch albums"
      );
    }
  },

  // Get all albums with details (images, keywords, etc.)
  getAlbumsWithDetails: async () => {
    try {
      const response = await imageApi.get("/albums/details");
      return response.data;
    } catch (error) {
      console.error("Error fetching album details:", error.response || error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch album details"
      );
    }
  },

  // Get specific album details
  getAlbumDetails: async (albumId) => {
    try {
      const response = await imageApi.get(`/albums/${albumId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching album ${albumId} details:`,
        error.response || error
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch album details"
      );
    }
  },

  // Add keyword to image
  addKeyword: async (data) => {
    try {
      const response = await imageApi.post("/keywords", data);
      return response.data;
    } catch (error) {
      console.error("Error adding keyword:", error.response || error);
      throw new Error(error.response?.data?.message || "Failed to add keyword");
    }
  },

  // Delete keyword from image
  deleteKeyword: async (data) => {
    try {
      const response = await imageApi.delete("/keywords", { data });
      return response.data;
    } catch (error) {
      console.error("Error deleting keyword:", error.response || error);
      throw new Error(
        error.response?.data?.message || "Failed to delete keyword"
      );
    }
  },

  // Delete album
  deleteAlbum: async (albumId) => {
    try {
      const response = await imageApi.delete(`/albums/${albumId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error deleting album ${albumId}:`,
        error.response || error
      );
      throw new Error(
        error.response?.data?.message || "Failed to delete album"
      );
    }
  },

  // Delete image
  deleteImage: async (imageId) => {
    try {
      const response = await imageApi.delete(`/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error deleting image ${imageId}:`,
        error.response || error
      );
      throw new Error(
        error.response?.data?.message || "Failed to delete image"
      );
    }
  },

  // Update image title
  updateImageTitle: async (imageId, title) => {
    try {
      const response = await imageApi.patch(`/images/${imageId}`, { title });
      return response.data;
    } catch (error) {
      console.error(
        `Error updating image ${imageId} title:`,
        error.response || error
      );
      throw new Error(
        error.response?.data?.message || "Failed to update image title"
      );
    }
  },

  // Update image description
  updateImageDescription: async (imageId, description) => {
    try {
      const response = await imageApi.patch(`/images/${imageId}`, {
        description,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error updating image ${imageId} description:`,
        error.response || error
      );
      throw new Error(
        error.response?.data?.message || "Failed to update image description"
      );
    }
  },

  // Regenerate tags for an image
  regenerateTags: async (imageId, prompt = "") => {
    try {
      const response = await imageApi.post(`/images/${imageId}/regenerate`, {
        prompt,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error regenerating tags for image ${imageId}:`,
        error.response || error
      );
      throw new Error(
        error.response?.data?.message || "Failed to regenerate tags"
      );
    }
  },

  // Download keywords as CSV - Updated to include platform selection
  downloadKeywordsCSV: async (albumId, platform = "shutterstock") => {
    try {
      const response = await imageApi.post(
        "/keywords/csv",
        {
          album_id: albumId,
          platform: platform,
        },
        { responseType: "blob" } // Important for binary responses
      );

      // Create a blob and trigger download
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute(
        "download",
        `album-keywords-${platform}-${albumId.substring(0, 8)}.csv`
      );
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Error downloading keywords CSV:", error.response || error);

      // Handle specific error messages
      let errorMessage = "Failed to download keywords CSV";

      if (error.response) {
        const { status, data } = error.response;

        // Try to extract error message from response
        if (data) {
          // If response is blob, convert to text first
          if (data instanceof Blob) {
            try {
              const text = await data.text();
              const errorData = JSON.parse(text);
              errorMessage = errorData.message || errorMessage;
            } catch (parseError) {
              // If can't parse, use default message
              console.warn("Could not parse error response:", parseError);
            }
          } else if (data.message) {
            errorMessage = data.message;
          }
        }

        // Handle specific status codes
        switch (status) {
          case 401:
            errorMessage = "Session expired. Please login again.";
            break;
          case 404:
            errorMessage = "Album not found.";
            break;
          case 403:
            errorMessage = "You don't have permission to access this album.";
            break;
          case 400:
            errorMessage = "Invalid request. Please check album ID.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
        }
      }

      const customError = new Error(errorMessage);
      customError.response = error.response;
      throw customError;
    }
  },

  // Download keywords as CSV for multiple albums
  downloadMultipleAlbumsCSV: async (
    albumIds,
    platform = "shutterstock",
    onProgress = null
  ) => {
    const results = [];
    const errors = [];

    for (let i = 0; i < albumIds.length; i++) {
      const albumId = albumIds[i];

      // Update progress callback if provided
      if (onProgress) {
        onProgress({
          current: i,
          total: albumIds.length,
          albumId: albumId,
        });
      }

      try {
        // Short delay between downloads to prevent browser blocking and allow users to see progress
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }

        await imageService.downloadKeywordsCSV(albumId, platform);
        results.push({ albumId, success: true });

        // Update progress after successful download
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: albumIds.length,
            albumId: albumId,
          });
        }
      } catch (error) {
        console.error(`Failed to download CSV for album ${albumId}:`, error);
        errors.push({
          albumId,
          error: error.message || "Failed to download CSV",
        });

        // Still update progress even if download failed
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: albumIds.length,
            albumId: albumId,
            error: error.message,
          });
        }
      }
    }

    return {
      successful: results.length,
      failed: errors.length,
      total: albumIds.length,
      errors,
    };
  },
};

export default imageService;
