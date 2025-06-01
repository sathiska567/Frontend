/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  ExternalLink,
  Download,
  MoreVertical,
  Edit,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Loader,
  FileText,
} from "lucide-react";
import { fetchAlbumDetails, deleteAlbum } from "../../store/slices/albumSlice";
import { deleteImage, setCurrentImage } from "../../store/slices/imageSlice";
import { formatDistanceToNow } from "date-fns";
import PlatformSelectionModal from "../common/PlatformSelectionModal";
import imageService from "../../services/imageService";

function AlbumDetailsPage() {
  const { albumId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectedAlbumDetails,
    isLoading: reduxLoading,
    error,
  } = useSelector((state) => state.albums);

  // Local loading state with minimum duration
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [showDeleteAlbumConfirm, setShowDeleteAlbumConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(12);
  const [deleteType, setDeleteType] = useState(""); // "image" or "album"
  const [isProcessing, setIsProcessing] = useState(false);

  // Platform selection modal state
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Show toast message
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Fetch album details on component mount with enforced minimum loading time
  useEffect(() => {
    if (albumId) {
      setIsLoading(true);
      const startTime = Date.now();

      dispatch(fetchAlbumDetails(albumId)).then(() => {
        // Ensure loading spinner shows for at least 1 second
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
      });
    }
  }, [dispatch, albumId]);

  // Reset selected images when album changes
  useEffect(() => {
    setSelectedImages([]);
    setActiveDropdown(null);
  }, [albumId]);

  // Handle image selection
  const toggleImageSelection = (imageId, event) => {
    event.stopPropagation();
    if (selectedImages.includes(imageId)) {
      setSelectedImages(selectedImages.filter((id) => id !== imageId));
    } else {
      setSelectedImages([...selectedImages, imageId]);
    }
  };

  // Handle view image
  const handleViewImage = (image) => {
    dispatch(setCurrentImage(image));
    navigate(`/images/${image.image_id}`);
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

  // Toggle dropdown menu
  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  // Handle delete image click
  const handleDeleteImageClick = (imageId, event) => {
    event.stopPropagation();
    setImageToDelete(imageId);
    setDeleteType("image");
    setShowDeleteConfirm(true);
    setActiveDropdown(null);
  };

  // Handle delete album click
  const handleDeleteAlbumClick = () => {
    setDeleteType("album");
    setShowDeleteAlbumConfirm(true);
  };

  // Export keywords as CSV - Updated to use platform selection modal
  const handleExportCSV = async () => {
    if (!albumId) {
      showToast("Album ID not found. Cannot export keywords.", "error");
      return;
    }

    console.log("Opening platform modal for album:", albumId); // Debug log
    setShowPlatformModal(true);
  };

  // Handle platform selection and CSV download
  const handlePlatformConfirm = async (platform) => {
    console.log("Platform selected:", platform, "for album:", albumId); // Debug log

    if (!albumId) {
      showToast("Album ID not found. Cannot export keywords.", "error");
      setShowPlatformModal(false);
      return;
    }

    setIsExportingCSV(true);

    try {
      await imageService.downloadKeywordsCSV(albumId, platform);
      showToast(`Keywords CSV for ${platform} downloaded successfully`);
    } catch (error) {
      console.error("Failed to download CSV:", error);

      // Handle specific error messages
      let errorMessage = "Failed to download CSV. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, "error");
    } finally {
      setIsExportingCSV(false);
      setShowPlatformModal(false);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    console.log("Closing platform modal, isExportingCSV:", isExportingCSV); // Debug log
    if (!isExportingCSV) {
      setShowPlatformModal(false);
    }
  };

  // Confirm delete (image or album)
  const confirmDelete = async () => {
    setIsProcessing(true);
    try {
      if (deleteType === "image" && imageToDelete) {
        await dispatch(
          deleteImage({ imageId: imageToDelete, albumId })
        ).unwrap();
        // Refresh album details after deletion
        dispatch(fetchAlbumDetails(albumId));
        setSelectedImages(selectedImages.filter((id) => id !== imageToDelete));
        showToast("Image deleted successfully");
      } else if (deleteType === "selected" && selectedImages.length > 0) {
        // Delete all selected images one by one
        for (const imageId of selectedImages) {
          await dispatch(deleteImage({ imageId, albumId })).unwrap();
        }
        // Refresh album details after deletion
        dispatch(fetchAlbumDetails(albumId));
        setSelectedImages([]);
        showToast(`${selectedImages.length} images deleted successfully`);
      } else if (deleteType === "album") {
        await dispatch(deleteAlbum(albumId)).unwrap();
        navigate("/albums");
        showToast("Album deleted successfully");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      showToast("Failed to delete. Please try again.", "error");
    } finally {
      setIsProcessing(false);
      setShowDeleteConfirm(false);
      setShowDeleteAlbumConfirm(false);
      setImageToDelete(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setShowDeleteAlbumConfirm(false);
    setImageToDelete(null);
  };

  // Handle deletion of selected images
  const handleDeleteSelected = () => {
    if (selectedImages.length > 0) {
      // If we're deleting multiple, set the first one to delete and confirm
      setDeleteType("selected");
      setShowDeleteConfirm(true);
    }
  };

  // Get album details
  const album =
    selectedAlbumDetails && selectedAlbumDetails.length > 0
      ? {
          id: albumId,
          name: selectedAlbumDetails[0]?.album_name || "Untitled Album",
          imageCount: selectedAlbumDetails.length,
          createdAt:
            selectedAlbumDetails[0]?.created_at || new Date().toISOString(),
        }
      : null;

  // Calculate pagination
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = selectedAlbumDetails
    ? selectedAlbumDetails.slice(indexOfFirstImage, indexOfLastImage)
    : [];
  const totalPages = selectedAlbumDetails
    ? Math.ceil(selectedAlbumDetails.length / imagesPerPage)
    : 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Debug: Monitor modal state changes
  useEffect(() => {
    console.log("Platform modal state changed:", showPlatformModal);
  }, [showPlatformModal]);

  // Skeleton component for image cards
  const ImageCardSkeleton = () => (
    <div className="group relative rounded-xl overflow-hidden bg-white border border-gray-200 animate-pulse">
      {/* Image skeleton */}
      <div className="relative aspect-square">
        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100"></div>

        {/* Selection checkbox skeleton */}
        <div className="absolute top-2 left-2 z-10">
          <div className="w-6 h-6 rounded-full bg-indigo-200"></div>
        </div>

        {/* Action menu skeleton */}
        <div className="absolute top-2 right-2 z-10">
          <div className="w-8 h-8 rounded-full bg-indigo-100"></div>
        </div>
      </div>

      {/* Image info skeleton */}
      <div className="p-3">
        <div className="h-4 bg-indigo-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-purple-100 rounded w-full mb-1"></div>
        <div className="h-3 bg-indigo-100 rounded w-2/3 mb-3"></div>

        {/* Keywords skeleton */}
        <div className="flex flex-wrap gap-1">
          <div className="h-5 w-12 bg-indigo-100 rounded-full"></div>
          <div className="h-5 w-16 bg-purple-100 rounded-full"></div>
          <div className="h-5 w-14 bg-indigo-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  // If loading, show skeleton instead of spinner
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
          {/* Back button and album header skeleton */}
          <div className="flex items-center mb-6 animate-pulse">
            <div className="mr-4 p-2 rounded-full bg-indigo-100 w-10 h-10"></div>

            <div className="flex-1">
              <div className="h-8 bg-gradient-to-r from-indigo-200 to-purple-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-indigo-100 rounded w-96"></div>
            </div>

            <div className="flex space-x-2">
              <div className="h-8 w-24 bg-indigo-100 rounded-lg"></div>
              <div className="h-8 w-20 bg-purple-100 rounded-lg"></div>
              <div className="h-8 w-24 bg-indigo-200 rounded-lg"></div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm">
            {/* Card background with glass effect */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/50 to-purple-200/50 rounded-2xl blur-sm opacity-50"></div>

            <div className="relative p-6">
              {/* Images grid skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {[...Array(12)].map((_, index) => (
                  <ImageCardSkeleton key={index} />
                ))}
              </div>

              {/* Pagination skeleton */}
              <div className="flex justify-center items-center space-x-4 pt-4 border-t border-gray-200 animate-pulse">
                <div className="h-8 w-8 bg-indigo-100 rounded-lg"></div>

                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-lg ${
                        index === 2
                          ? "bg-gradient-to-r from-indigo-200 to-purple-200"
                          : index % 2 === 0
                          ? "bg-indigo-100"
                          : "bg-purple-100"
                      }`}
                    ></div>
                  ))}
                </div>

                <div className="h-8 w-8 bg-purple-100 rounded-lg"></div>
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
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white shadow-lg z-[100] transition-all duration-300 ${
            toast.type === "success" ? "bg-indigo-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-6xl relative">
        {/* Back button and album header */}
        <div className="flex items-center mb-6">
          <button
            className="mr-4 p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 text-gray-700 hover:text-gray-900 transition-colors shadow-sm"
            onClick={() => navigate("/albums")}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
              {album ? album.name : ""}
            </h1>
            {album && (
              <p className="text-gray-600 text-sm">
                {album.imageCount} {album.imageCount === 1 ? "image" : "images"}{" "}
                • Created {formatDate(album.createdAt)}
                {" • "}
                <span className="text-gray-500 text-xs">{albumId}</span>
              </p>
            )}
          </div>

          <div className="flex space-x-2">
            {selectedImages.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors border border-red-200"
              >
                <Trash2 size={16} className="mr-1.5" />
                Delete {selectedImages.length} selected
              </button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleExportCSV();
              }}
              className="flex items-center px-3 py-1.5 bg-white/70 hover:bg-white border border-gray-200 text-gray-700 hover:text-gray-900 rounded-lg transition-colors backdrop-blur-sm"
              disabled={isExportingCSV}
            >
              <FileText size={16} className="mr-1.5" />
              {isExportingCSV ? "Exporting..." : "Export CSV"}
            </button>
            <button
              onClick={handleDeleteAlbumClick}
              className="flex items-center px-3 py-1.5 bg-white/70 hover:bg-white border border-gray-200 text-gray-700 hover:text-gray-900 rounded-lg transition-colors backdrop-blur-sm"
            >
              <Trash2 size={16} className="mr-1.5" />
              Delete Album
            </button>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-500 opacity-100 scale-100">
          {/* Card background with glass effect */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl"></div>

          {/* Inner glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/50 to-purple-200/50 rounded-2xl blur-sm opacity-50"></div>

          <div className="relative p-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-100 text-red-700 border border-red-200 rounded-xl p-4 mb-6">
                <p>Error: {error}</p>
                <button
                  className="mt-2 px-3 py-1 bg-red-200 hover:bg-red-300 rounded-lg text-red-800 text-sm"
                  onClick={() => dispatch(fetchAlbumDetails(albumId))}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!error &&
              (!selectedAlbumDetails || selectedAlbumDetails.length === 0) && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-indigo-100 rounded-full p-5 mb-4">
                    <Trash2 className="text-indigo-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Images Found
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    This album doesn't contain any images or may have been
                    deleted.
                  </p>
                  <button
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white"
                    onClick={() => navigate("/albums")}
                  >
                    Back to Albums
                  </button>
                </div>
              )}

            {/* Images grid */}
            {!error &&
              selectedAlbumDetails &&
              selectedAlbumDetails.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {currentImages.map((image) => (
                      <div
                        key={image.image_id}
                        className={`group relative rounded-xl overflow-hidden bg-white border transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 ${
                          selectedImages.includes(image.image_id)
                            ? "border-indigo-500 shadow-[0_0_0_2px_rgba(99,102,241,0.4)]"
                            : "border-gray-200 hover:border-indigo-300"
                        }`}
                        onClick={() => handleViewImage(image)}
                      >
                        {/* Image */}
                        <div className="relative aspect-square">
                          <img
                            src={image.image_link}
                            alt={image.title || "Image"}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          {/* Selection checkbox */}
                          <div
                            className="absolute top-2 left-2 z-10"
                            onClick={(e) =>
                              toggleImageSelection(image.image_id, e)
                            }
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 cursor-pointer ${
                                selectedImages.includes(image.image_id)
                                  ? "bg-indigo-500 border-indigo-500"
                                  : "bg-white/80 backdrop-blur-sm border-gray-300 opacity-70 group-hover:opacity-100"
                              }`}
                            >
                              {selectedImages.includes(image.image_id) && (
                                <Check size={14} className="text-white" />
                              )}
                            </div>
                          </div>

                          {/* Action menu */}
                          <div className="absolute top-2 right-2 z-10">
                            <button
                              className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-300 border border-gray-200"
                              onClick={(e) => toggleDropdown(image.image_id, e)}
                            >
                              <MoreVertical size={16} />
                            </button>

                            {activeDropdown === image.image_id && (
                              <div className="absolute right-0 top-10 z-50 w-48 py-1.5 rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 animate-fadeIn shadow-xl">
                                {/* Dropdown background with glass effect */}
                                <div className="absolute inset-0 bg-white/90 border border-gray-200"></div>
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-xl blur-sm opacity-30"></div>

                                <div className="relative flex flex-col divide-y divide-gray-100">
                                  <button
                                    className="flex items-center px-4 py-3 hover:bg-indigo-50 text-gray-700 text-left cursor-pointer transition-all duration-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewImage(image);
                                    }}
                                  >
                                    <ExternalLink
                                      size={16}
                                      className="mr-3 text-gray-500"
                                    />
                                    View image
                                  </button>
                                  <button className="flex items-center px-4 py-3 hover:bg-indigo-50 text-gray-700 text-left cursor-pointer transition-all duration-300">
                                    <Download
                                      size={16}
                                      className="mr-3 text-gray-500"
                                    />
                                    Download
                                  </button>
                                  <button className="flex items-center px-4 py-3 hover:bg-indigo-50 text-gray-700 text-left cursor-pointer transition-all duration-300">
                                    <Edit
                                      size={16}
                                      className="mr-3 text-gray-500"
                                    />
                                    Edit tags
                                  </button>
                                  <button
                                    className="flex items-center px-4 py-3 hover:bg-red-50 text-gray-700 text-left cursor-pointer transition-all duration-300"
                                    onClick={(e) =>
                                      handleDeleteImageClick(image.image_id, e)
                                    }
                                  >
                                    <Trash2
                                      size={16}
                                      className="mr-3 text-red-500"
                                    />
                                    <span className="text-red-500">Delete</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Image info */}
                        <div className="p-3">
                          <h3 className="text-gray-800 font-medium line-clamp-1">
                            {image.title || "Untitled Image"}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                            {image.description?.substring(0, 100) ||
                              "No description"}
                          </p>

                          {/* Keywords */}
                          {image.keywords && image.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {image.keywords
                                .slice(0, 3)
                                .map((keyword, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-indigo-100 border border-indigo-200 rounded-full text-xs text-gray-700"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              {image.keywords.length > 3 && (
                                <span className="px-2 py-0.5 bg-indigo-100 border border-indigo-200 rounded-full text-xs text-gray-700">
                                  +{image.keywords.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg ${
                          currentPage > 1
                            ? "bg-white/70 hover:bg-white border border-gray-200"
                            : "bg-gray-100 cursor-not-allowed border border-gray-200"
                        } transition-all duration-300`}
                      >
                        <ChevronLeft
                          size={18}
                          className={`${
                            currentPage > 1 ? "text-gray-700" : "text-gray-400"
                          }`}
                        />
                      </button>

                      <div className="flex items-center">
                        {[...Array(totalPages)].map((_, idx) => {
                          // If total pages <= 5, show all page numbers
                          if (totalPages <= 5) {
                            return (
                              <button
                                key={idx}
                                onClick={() => setCurrentPage(idx + 1)}
                                className={`w-8 h-8 mx-1 rounded-lg flex items-center justify-center ${
                                  currentPage === idx + 1
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                                    : "bg-white/70 text-gray-700 hover:bg-white border border-gray-200"
                                } transition-all duration-300`}
                              >
                                {idx + 1}
                              </button>
                            );
                          }

                          // Otherwise, show first, last, current, and surrounding pages
                          const pageNum = idx + 1;

                          // Always show first and last pages
                          if (pageNum === 1 || pageNum === totalPages) {
                            return (
                              <button
                                key={idx}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-8 h-8 mx-1 rounded-lg flex items-center justify-center ${
                                  currentPage === pageNum
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                                    : "bg-white/70 text-gray-700 hover:bg-white border border-gray-200"
                                } transition-all duration-300`}
                              >
                                {pageNum}
                              </button>
                            );
                          }

                          // Show current page and adjacent pages
                          if (
                            pageNum === currentPage ||
                            pageNum === currentPage - 1 ||
                            pageNum === currentPage + 1
                          ) {
                            return (
                              <button
                                key={idx}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-8 h-8 mx-1 rounded-lg flex items-center justify-center ${
                                  currentPage === pageNum
                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                                    : "bg-white/70 text-gray-700 hover:bg-white border border-gray-200"
                                } transition-all duration-300`}
                              >
                                {pageNum}
                              </button>
                            );
                          }

                          // Show ellipsis when needed
                          if (
                            (pageNum === 2 && currentPage > 3) ||
                            (pageNum === totalPages - 1 &&
                              currentPage < totalPages - 2)
                          ) {
                            return (
                              <span key={idx} className="text-gray-500 mx-1">
                                ...
                              </span>
                            );
                          }

                          return null;
                        })}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg ${
                          currentPage < totalPages
                            ? "bg-white/70 hover:bg-white border border-gray-200"
                            : "bg-gray-100 cursor-not-allowed border border-gray-200"
                        } transition-all duration-300`}
                      >
                        <ChevronRight
                          size={18}
                          className={`${
                            currentPage < totalPages
                              ? "text-gray-700"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                  )}
                </>
              )}
          </div>
        </div>
      </div>

      {/* Platform Selection Modal */}
      <PlatformSelectionModal
        isOpen={showPlatformModal}
        onClose={handleModalClose}
        onConfirm={handlePlatformConfirm}
        isLoading={isExportingCSV}
        albumId={albumId}
        albumName={album?.name || `Album ${albumId?.substring(0, 8)}`}
        isMultiple={false}
      />

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn backdrop-blur-sm">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={cancelDelete}
          ></div>
          <div className="relative max-w-md w-full mx-4 transform transition-all duration-300 animate-scaleIn">
            {/* Modal background with glass effect */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl"></div>

            {/* Inner glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-200/50 to-indigo-200/50 rounded-2xl blur-sm opacity-70"></div>

            <div className="relative p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                {deleteType === "selected"
                  ? `Are you sure you want to delete ${selectedImages.length} selected images? This action cannot be undone.`
                  : "Are you sure you want to delete this image? This action cannot be undone."}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all duration-300"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 flex items-center"
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

      {/* Delete album confirmation modal */}
      {showDeleteAlbumConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn backdrop-blur-sm">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={cancelDelete}
          ></div>
          <div className="relative max-w-md w-full mx-4 transform transition-all duration-300 animate-scaleIn">
            {/* Modal background with glass effect */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl"></div>

            {/* Inner glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-200/50 to-indigo-200/50 rounded-2xl blur-sm opacity-70"></div>

            <div className="relative p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Delete Album
              </h3>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this entire album and all its
                contents? This action cannot be undone.
              </p>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 mb-6">
                <div className="flex items-center text-red-700">
                  <div className="mr-3 p-2 bg-red-100 rounded-full">
                    <Trash2 size={18} />
                  </div>
                  <div>
                    <p className="font-medium">{album?.name}</p>
                    <p className="text-sm">
                      {album?.imageCount || 0} images will be permanently
                      deleted
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all duration-300"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 flex items-center"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Delete Album"
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

export default AlbumDetailsPage;
