import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Edit,
  Save,
  X,
  PlusCircle,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader,
} from "lucide-react";
import {
  deleteImage,
  deleteKeyword,
  addKeyword,
  updateImageTitle,
  updateImageDescription,
  regenerateTags,
  setCurrentImage,
} from "../../store/slices/imageSlice";
import { fetchAlbumDetails } from "../../store/slices/albumSlice";
import { formatDistanceToNow } from "date-fns";

function ImageDetailsPage() {
  const { imageId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedAlbumDetails } = useSelector((state) => state.albums);
  const { isUploading, error } = useSelector((state) => state.images);

  const [currentImage, setCurrentImageState] = useState(null);
  const [albumId, setAlbumId] = useState(null); // Store album ID separately for navigation
  const [imageIndex, setImageIndex] = useState(0);
  const [editMode, setEditMode] = useState({
    title: false,
    description: false,
  });
  const [editedValues, setEditedValues] = useState({
    title: "",
    description: "",
  });
  const [newKeyword, setNewKeyword] = useState("");
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Show toast message
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Get album ID from URL if we came from an album page
  useEffect(() => {
    // This gets the previous URL path if available
    const referrer = document.referrer;
    if (referrer && referrer.includes("/albums/")) {
      const albumIdFromUrl = referrer.split("/albums/")[1].split("/")[0];
      if (albumIdFromUrl) {
        setAlbumId(albumIdFromUrl);
        localStorage.setItem(`image_${imageId}_albumId`, albumIdFromUrl);
      }
    }
  }, [imageId]);

  // Check if we need to fetch album details
  useEffect(() => {
    if (imageId) {
      // Always try to get album ID from localStorage first
      const cachedAlbumId = localStorage.getItem(`image_${imageId}_albumId`);

      if (cachedAlbumId) {
        setAlbumId(cachedAlbumId);

        // If we don't have album details or they're empty, fetch them
        if (!selectedAlbumDetails || selectedAlbumDetails.length === 0) {
          dispatch(fetchAlbumDetails(cachedAlbumId));
        }
      }
    }
  }, [imageId, selectedAlbumDetails, dispatch]);

  // Find the current image and its index in the album with enforced minimum loading time
  useEffect(() => {
    setIsLoading(true);
    const startTime = Date.now();

    const findImage = () => {
      if (selectedAlbumDetails && selectedAlbumDetails.length > 0 && imageId) {
        const index = selectedAlbumDetails.findIndex(
          (img) => img.image_id === imageId
        );
        if (index !== -1) {
          const foundImage = selectedAlbumDetails[index];
          setCurrentImageState(foundImage);
          setImageIndex(index);

          // Store album ID separately for navigation and cache it
          if (foundImage.album_id) {
            setAlbumId(foundImage.album_id);
            localStorage.setItem(
              `image_${imageId}_albumId`,
              foundImage.album_id
            );
          }

          setEditedValues({
            title: foundImage.title || "",
            description: foundImage.description || "",
          });

          // Apply minimum loading time
          const elapsedTime = Date.now() - startTime;
          const minimumLoadingTime = 1000; // 1 second minimum

          if (elapsedTime < minimumLoadingTime) {
            const remainingTime = minimumLoadingTime - elapsedTime;
            setTimeout(() => {
              setIsLoading(false);
            }, remainingTime);
          } else {
            setIsLoading(false);
          }
        } else {
          // If the image isn't in the current album details
          setTimeout(() => {
            setIsLoading(false);
          }, 500); // Add a slight delay for better UX
        }
      } else if (!selectedAlbumDetails || selectedAlbumDetails.length === 0) {
        // We need to check if we can find the image by directly requesting it
        // This would require an API to fetch a single image by ID
        // For now, we'll just set isLoading to false after a delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    findImage();

    // Cleanup function to clear any intervals
    return () => {
      const allIntervals = window.setInterval(function () {}, 0) - 1;
      for (let i = 0; i <= allIntervals; i++) {
        clearInterval(i);
      }
    };
  }, [selectedAlbumDetails, imageId]);

  // Handle navigation back to album
  const handleBackToAlbum = () => {
    // First check if we have an albumId in state
    if (albumId) {
      navigate(`/albums/${albumId}`);
      return;
    }

    // Then try to use the album ID from current image
    if (currentImage && currentImage.album_id) {
      navigate(`/albums/${currentImage.album_id}`);
      return;
    }

    // Then try to get from localStorage as a final fallback
    const cachedAlbumId = localStorage.getItem(`image_${imageId}_albumId`);
    if (cachedAlbumId) {
      navigate(`/albums/${cachedAlbumId}`);
      return;
    }

    // Last resort, go to albums list
    navigate("/albums");
    console.warn(
      "Album ID not available for navigation, redirecting to albums list"
    );
  };

  // Handle image deletion
  const handleDeleteImage = () => {
    setShowDeleteConfirm(true);
  };

  // Confirm delete image
  const confirmDelete = async () => {
    if (currentImage) {
      setIsProcessing(true);
      const navigateToAlbumId =
        currentImage.album_id ||
        albumId ||
        localStorage.getItem(`image_${imageId}_albumId`);

      try {
        await dispatch(
          deleteImage({
            imageId: currentImage.image_id,
            albumId: navigateToAlbumId,
          })
        ).unwrap();
        showToast("Image deleted successfully");

        // Navigate back to album details
        if (navigateToAlbumId) {
          navigate(`/albums/${navigateToAlbumId}`);
        } else {
          navigate("/albums");
        }
      } catch (error) {
        console.error("Failed to delete image:", error);
        showToast("Failed to delete image", "error");
      } finally {
        setIsProcessing(false);
        setShowDeleteConfirm(false);
      }
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setShowRegenerateConfirm(false);
  };

  // Navigate to previous/next image in album
  const navigateImages = (direction) => {
    if (!selectedAlbumDetails || selectedAlbumDetails.length <= 1) return;

    let newIndex;
    if (direction === "prev") {
      newIndex =
        imageIndex <= 0 ? selectedAlbumDetails.length - 1 : imageIndex - 1;
    } else {
      newIndex =
        imageIndex >= selectedAlbumDetails.length - 1 ? 0 : imageIndex + 1;
    }

    const newImage = selectedAlbumDetails[newIndex];
    navigate(`/images/${newImage.image_id}`);
  };

  // Toggle edit mode for title/description
  const toggleEditMode = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

    // Reset edited value if canceling edit
    if (editMode[field]) {
      setEditedValues((prev) => ({
        ...prev,
        [field]: currentImage[field] || "",
      }));
    }
  };

  // Save edited title
  const saveTitle = async () => {
    if (currentImage && editedValues.title.trim() !== currentImage.title) {
      setIsProcessing(true);
      try {
        await dispatch(
          updateImageTitle({
            imageId: currentImage.image_id,
            title: editedValues.title,
          })
        ).unwrap();
        showToast("Title updated successfully");
        setCurrentImageState((prev) => ({
          ...prev,
          title: editedValues.title,
        }));
      } catch (error) {
        console.error("Failed to update title:", error);
        showToast("Failed to update title", "error");
      } finally {
        setIsProcessing(false);
        toggleEditMode("title");
      }
    } else {
      toggleEditMode("title");
    }
  };

  // Save edited description
  const saveDescription = async () => {
    if (
      currentImage &&
      editedValues.description.trim() !== currentImage.description
    ) {
      setIsProcessing(true);
      try {
        await dispatch(
          updateImageDescription({
            imageId: currentImage.image_id,
            description: editedValues.description,
          })
        ).unwrap();
        showToast("Description updated successfully");
        setCurrentImageState((prev) => ({
          ...prev,
          description: editedValues.description,
        }));
      } catch (error) {
        console.error("Failed to update description:", error);
        showToast("Failed to update description", "error");
      } finally {
        setIsProcessing(false);
        toggleEditMode("description");
      }
    } else {
      toggleEditMode("description");
    }
  };

  // Add new keyword
  const handleAddKeyword = async () => {
    if (!newKeyword.trim() || isAddingKeyword) return;

    setIsAddingKeyword(true);

    try {
      const currentAlbumId =
        currentImage.album_id ||
        albumId ||
        localStorage.getItem(`image_${imageId}_albumId`);

      await dispatch(
        addKeyword({
          keyword_name: newKeyword.trim(),
          image_id: currentImage.image_id,
          album_id: currentAlbumId,
        })
      ).unwrap();

      showToast("Keyword added successfully");
      // Update local state
      setCurrentImageState((prev) => ({
        ...prev,
        keywords: [...(prev.keywords || []), newKeyword.trim()],
      }));
      setNewKeyword("");
    } catch (error) {
      console.error("Error adding keyword:", error);
      showToast("Failed to add keyword", "error");
    } finally {
      setIsAddingKeyword(false);
    }
  };

  // Delete keyword
  const handleDeleteKeyword = async (keyword) => {
    setIsProcessing(true);
    try {
      const currentAlbumId =
        currentImage.album_id ||
        albumId ||
        localStorage.getItem(`image_${imageId}_albumId`);

      await dispatch(
        deleteKeyword({
          keyword_name: keyword,
          image_id: currentImage.image_id,
          album_id: currentAlbumId,
        })
      ).unwrap();

      showToast("Keyword removed successfully");
      // Update local state
      setCurrentImageState((prev) => ({
        ...prev,
        keywords: prev.keywords.filter((k) => k !== keyword),
      }));
    } catch (error) {
      console.error("Error removing keyword:", error);
      showToast("Failed to remove keyword", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Regenerate tags
  const handleRegenerateTags = () => {
    setShowRegenerateConfirm(true);
  };

  // Confirm regenerate tags
  const confirmRegenerate = async () => {
    if (currentImage) {
      setIsProcessing(true);
      try {
        const result = await dispatch(
          regenerateTags({
            imageId: currentImage.image_id,
            prompt: "",
          })
        ).unwrap();

        showToast("Tags regenerated successfully");
        // Update local state with new tags from the response
        if (result && result.keywords) {
          setCurrentImageState((prev) => ({
            ...prev,
            keywords: result.keywords,
          }));
        }
      } catch (error) {
        console.error("Failed to regenerate tags:", error);
        showToast("Failed to regenerate tags", "error");
      } finally {
        setIsProcessing(false);
        setShowRegenerateConfirm(false);
      }
    }
  };

  // Format creation date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-8 flex justify-center">
        {/* Background decorative elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"></div>

          <div
            className="absolute w-full h-full bg-grid-pattern opacity-[0.03]"
            style={{
              backgroundSize: "30px 30px",
              backgroundImage:
                "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
            }}
          ></div>
        </div>

        <div className="w-full max-w-6xl relative">
          {/* Back button and navigation skeleton */}
          <div className="flex items-center mb-6 animate-pulse">
            <div className="mr-4 p-2 rounded-full bg-indigo-100 w-10 h-10"></div>

            <div className="flex-1">
              <div className="h-8 bg-gradient-to-r from-indigo-200 to-purple-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-indigo-100 rounded w-64"></div>
            </div>

            <div className="flex space-x-2">
              <div className="h-10 w-10 bg-indigo-100 rounded-full"></div>
              <div className="h-10 w-10 bg-purple-100 rounded-full"></div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Image preview skeleton */}
            <div className="md:w-1/2 animate-pulse">
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-2xl blur-sm opacity-30"></div>

                <div className="relative aspect-square bg-gradient-to-br from-indigo-100 to-purple-100"></div>

                <div className="p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm">
                  <div className="h-4 bg-indigo-100 rounded w-32"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-indigo-100 rounded-full"></div>
                    <div className="h-8 w-8 bg-purple-100 rounded-full"></div>
                    <div className="h-8 w-8 bg-indigo-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image details skeleton */}
            <div className="md:w-1/2 animate-pulse">
              <div className="rounded-2xl overflow-hidden backdrop-blur-sm border border-gray-200 shadow-xl relative">
                {/* Card background with glass effect */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/50 to-purple-200/50 rounded-2xl blur-sm opacity-50"></div>

                <div className="relative p-6">
                  {/* Title section skeleton */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 bg-indigo-200 rounded w-16"></div>
                      <div className="h-6 w-6 bg-indigo-100 rounded-full"></div>
                    </div>
                    <div className="h-6 bg-indigo-200 rounded w-3/4"></div>
                  </div>

                  {/* Description section skeleton */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 bg-purple-200 rounded w-20"></div>
                      <div className="h-6 w-6 bg-purple-100 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-purple-100 rounded w-full"></div>
                      <div className="h-4 bg-indigo-100 rounded w-5/6"></div>
                      <div className="h-4 bg-purple-100 rounded w-3/4"></div>
                    </div>
                  </div>

                  {/* Keywords section skeleton */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-4 bg-indigo-200 rounded w-18"></div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center px-3 py-1.5 bg-indigo-100 rounded-full">
                        <div className="h-4 w-16 bg-indigo-200 rounded"></div>
                      </div>
                      <div className="flex items-center px-3 py-1.5 bg-purple-100 rounded-full">
                        <div className="h-4 w-12 bg-purple-200 rounded"></div>
                      </div>
                      <div className="flex items-center px-3 py-1.5 bg-indigo-200 rounded-full">
                        <div className="h-4 w-20 bg-indigo-300 rounded"></div>
                      </div>
                      <div className="flex items-center px-3 py-1.5 bg-purple-200 rounded-full">
                        <div className="h-4 w-14 bg-purple-300 rounded"></div>
                      </div>
                    </div>

                    {/* Add keyword input skeleton */}
                    <div className="flex items-center">
                      <div className="flex-1 h-10 bg-indigo-100 rounded-l-lg"></div>
                      <div className="h-10 w-12 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-r-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add keyframes for animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes scaleIn {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }

          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out forwards;
          }

          .animation-delay-150 {
            animation-delay: 150ms;
          }

          .animation-delay-300 {
            animation-delay: 300ms;
          }
        `}</style>
      </div>
    );
  }

  if (!currentImage) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-8 flex justify-center">
        <div className="w-full max-w-6xl">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg border border-red-200">
            <h2 className="text-xl font-bold mb-2">Image Not Found</h2>
            <p>
              The requested image could not be found. It may have been deleted
              or you don't have permission to view it.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors"
              onClick={() => navigate("/albums")}
            >
              Back to Albums
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-8 flex justify-center">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"></div>

        <div
          className="absolute w-full h-full bg-grid-pattern opacity-[0.03]"
          style={{
            backgroundSize: "30px 30px",
            backgroundImage:
              "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
          }}
        ></div>
      </div>

      {/* Toast notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white shadow-lg z-50 transition-all duration-300 ${
            toast.type === "success" ? "bg-indigo-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-6xl relative">
        {/* Back button and navigation - FIXED: Increased z-index and made sure no overlapping elements */}
        <div className="flex items-center mb-6 relative z-20">
          <button
            className="mr-4 p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer shadow-sm"
            onClick={handleBackToAlbum}
            style={{ position: "relative", zIndex: 30 }}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
              Image Details
            </h1>
            <p className="text-gray-600 text-sm">
              From album • Created {formatDate(currentImage.created_at)}
            </p>
          </div>

          <div
            className="flex space-x-2"
            style={{ position: "relative", zIndex: 30 }}
          >
            <button
              onClick={() => navigateImages("prev")}
              className="p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer shadow-sm"
              disabled={selectedAlbumDetails?.length <= 1}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => navigateImages("next")}
              className="p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer shadow-sm"
              disabled={selectedAlbumDetails?.length <= 1}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Image preview */}
          <div className="md:w-1/2">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl relative">
              {/* Inner glow effect - FIXED: moved below to prevent overlap */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-2xl blur-sm opacity-30 pointer-events-none"></div>

              <div className="relative aspect-square bg-white">
                <img
                  src={currentImage.image_link}
                  alt={currentImage.title || "Image"}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm relative z-10">
                <div className="text-gray-800 text-sm">
                  Image ID:{" "}
                  <span className="text-gray-600">{currentImage.image_id}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-2 rounded-full hover:bg-indigo-100 text-gray-700 transition-colors cursor-pointer"
                    title="Download image"
                  >
                    <Download size={18} />
                  </button>
                  <a
                    href={currentImage.image_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-indigo-100 text-gray-700 transition-colors cursor-pointer"
                    title="Open in new tab"
                  >
                    <ExternalLink size={18} />
                  </a>
                  <button
                    onClick={handleDeleteImage}
                    className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                    title="Delete image"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Image details */}
          <div className="md:w-1/2">
            <div className="rounded-2xl overflow-hidden backdrop-blur-sm border border-gray-200 shadow-xl relative">
              {/* Card background with glass effect */}
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl pointer-events-none"></div>

              {/* Inner glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/50 to-purple-200/50 rounded-2xl blur-sm opacity-50 pointer-events-none"></div>

              <div className="relative p-6">
                {/* Title */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-600 text-sm uppercase tracking-wider">
                      Title
                    </h3>
                    {!editMode.title ? (
                      <button
                        onClick={() => toggleEditMode("title")}
                        className="p-1 rounded-full hover:bg-indigo-100 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                        style={{ position: "relative", zIndex: 20 }}
                      >
                        <Edit size={16} />
                      </button>
                    ) : (
                      <div
                        className="flex space-x-1"
                        style={{ position: "relative", zIndex: 20 }}
                      >
                        <button
                          onClick={saveTitle}
                          className="p-1 rounded-full hover:bg-green-100 text-green-600 transition-colors cursor-pointer"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            <Save size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => toggleEditMode("title")}
                          className="p-1 rounded-full hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                          disabled={isProcessing}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {!editMode.title ? (
                    <p className="text-gray-800 text-lg">
                      {currentImage.title || (
                        <span className="text-gray-500 italic">No title</span>
                      )}
                    </p>
                  ) : (
                    <input
                      type="text"
                      value={editedValues.title}
                      onChange={(e) =>
                        setEditedValues((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full bg-white border border-gray-200 text-gray-800 p-2 rounded-lg focus:border-indigo-500 focus:outline-none relative z-10"
                      placeholder="Enter a title for this image"
                      disabled={isProcessing}
                    />
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-600 text-sm uppercase tracking-wider">
                      Description
                    </h3>
                    {!editMode.description ? (
                      <button
                        onClick={() => toggleEditMode("description")}
                        className="p-1 rounded-full hover:bg-indigo-100 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                        style={{ position: "relative", zIndex: 20 }}
                      >
                        <Edit size={16} />
                      </button>
                    ) : (
                      <div
                        className="flex space-x-1"
                        style={{ position: "relative", zIndex: 20 }}
                      >
                        <button
                          onClick={saveDescription}
                          className="p-1 rounded-full hover:bg-green-100 text-green-600 transition-colors cursor-pointer"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            <Save size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => toggleEditMode("description")}
                          className="p-1 rounded-full hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                          disabled={isProcessing}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {!editMode.description ? (
                    <p className="text-gray-700">
                      {currentImage.description || (
                        <span className="text-gray-500 italic">
                          No description
                        </span>
                      )}
                    </p>
                  ) : (
                    <textarea
                      value={editedValues.description}
                      onChange={(e) =>
                        setEditedValues((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full bg-white border border-gray-200 text-gray-800 p-2 rounded-lg focus:border-indigo-500 focus:outline-none min-h-[100px] resize-none relative z-10"
                      placeholder="Enter a description for this image"
                      disabled={isProcessing}
                    />
                  )}
                </div>

                {/* Keywords */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 text-sm uppercase tracking-wider">
                      Keywords
                    </h3>
                    {/* <button
                      onClick={handleRegenerateTags}
                      className=" px-3 py-1 text-xs rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
                      style={{ position: "relative", zIndex: 20 }}
                    >
                      Regenerate Tags
                    </button> */}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                    {currentImage.keywords &&
                    currentImage.keywords.length > 0 ? (
                      currentImage.keywords.map((keyword, idx) => (
                        <div
                          key={idx}
                          className="flex items-center px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-gray-700 rounded-full border border-indigo-200 transition-colors group relative z-10"
                        >
                          <span>{keyword}</span>
                          <button
                            onClick={() => handleDeleteKeyword(keyword)}
                            className="ml-2 opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-600 transition-all cursor-pointer"
                            disabled={isProcessing}
                            style={{ position: "relative", zIndex: 20 }}
                          >
                            {isProcessing ? (
                              <Loader size={14} className="animate-spin" />
                            ) : (
                              <X size={14} />
                            )}
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No keywords</p>
                    )}
                  </div>

                  {/* Add keyword input */}
                  <div className="flex items-center relative z-10">
                    <input
                      type="text"
                      placeholder="Add a new keyword"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      className="flex-1 bg-white text-gray-800 p-2 rounded-l-lg border border-gray-200 focus:border-indigo-500 focus:outline-none"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddKeyword()
                      }
                      disabled={isAddingKeyword}
                    />
                    <button
                      onClick={handleAddKeyword}
                      disabled={!newKeyword.trim() || isAddingKeyword}
                      className={`px-3 py-2 rounded-r-lg border border-l-0 border-gray-200 cursor-pointer ${
                        !newKeyword.trim() || isAddingKeyword
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                      } transition-colors`}
                      style={{ position: "relative", zIndex: 20 }}
                    >
                      {isAddingKeyword ? (
                        <div className="w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
                      ) : (
                        <PlusCircle size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn backdrop-blur-sm">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={cancelDelete}
          ></div>
          <div className="relative max-w-md w-full mx-4 transform transition-all duration-300 animate-scaleIn">
            {/* Modal background with glass effect */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl pointer-events-none"></div>

            {/* Inner glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-200/50 to-indigo-200/50 rounded-2xl blur-sm opacity-70 pointer-events-none"></div>

            <div className="relative p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this image? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all duration-300 cursor-pointer"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 flex items-center cursor-pointer"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regenerate tags confirmation modal */}
      {showRegenerateConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn backdrop-blur-sm">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={cancelDelete}
          ></div>
          <div className="relative max-w-md w-full mx-4 transform transition-all duration-300 animate-scaleIn">
            {/* Modal background with glass effect */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl pointer-events-none"></div>

            {/* Inner glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/50 to-purple-200/50 rounded-2xl blur-sm opacity-70 pointer-events-none"></div>

            <div className="relative p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Regenerate Tags
              </h3>
              <p className="text-gray-600 mb-6">
                This will replace all existing keywords with new AI-generated
                tags. Are you sure you want to continue?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all duration-300 cursor-pointer"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRegenerate}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all duration-300 flex items-center cursor-pointer"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Regenerate"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add keyframes for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }

        .animation-delay-150 {
          animation-delay: 150ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
}

export default ImageDetailsPage;
