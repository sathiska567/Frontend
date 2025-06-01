/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  X,
  Download,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Check,
  FileText,
  Info,
  Loader,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  fetchAlbumsWithDetails,
  deleteAlbum,
  selectAlbum,
} from "../../store/slices/albumSlice";
import SearchBar from "./SearchBar";
import PlatformSelectionModal from "../common/PlatformSelectionModal";
import imageService from "../../services/imageService";

function AlbumsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    albumsWithDetails,
    isLoading: reduxLoading,
    error,
  } = useSelector((state) => state.albums);

  // Local loading state with minimum duration
  const [isLoading, setIsLoading] = useState(true);
  const [displayIds, setDisplayIds] = useState(true);
  const [selectedAlbums, setSelectedAlbums] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [albumsPerPage] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);

  // Platform selection modal state
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    albumId: null,
    albumName: null,
    isMultiple: false,
    selectedAlbumIds: [],
  });
  const [isDownloadingCSV, setIsDownloadingCSV] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({
    current: 0,
    total: 0,
  });
  const [toastMessage, setToastMessage] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    searchInTitles: true,
    searchInDescriptions: true,
    searchInKeywords: true,
    searchInDates: false,
  });
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [noResultsFound, setNoResultsFound] = useState(false);

  // Fetch albums on component mount with enforced minimum loading time
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const startTime = Date.now();
      await dispatch(fetchAlbumsWithDetails());

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
    };

    fetchData();
  }, [dispatch]);

  // Update filtered albums when albums data or search parameters change
  useEffect(() => {
    if (!albumsWithDetails) {
      setFilteredAlbums([]);
      return;
    }

    if (!searchTerm) {
      setFilteredAlbums(albumsWithDetails);
      setNoResultsFound(false);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = albumsWithDetails.filter((album) => {
      // Search in album name
      if (
        searchFilters.searchInTitles &&
        album.album_name &&
        album.album_name.toLowerCase().includes(searchTermLower)
      ) {
        return true;
      }

      // Search in dates
      if (searchFilters.searchInDates && album.created_at) {
        const dateStr = formatDistanceToNow(new Date(album.created_at), {
          addSuffix: true,
        });
        if (dateStr.toLowerCase().includes(searchTermLower)) {
          return true;
        }
      }

      // Search in images descriptions and keywords
      if (album.images && album.images.length > 0) {
        // Search in descriptions
        if (searchFilters.searchInDescriptions) {
          const hasMatchingDescription = album.images.some(
            (image) =>
              image.description &&
              image.description.toLowerCase().includes(searchTermLower)
          );
          if (hasMatchingDescription) return true;
        }

        // Search in keywords
        if (searchFilters.searchInKeywords) {
          const hasMatchingKeywords = album.images.some(
            (image) =>
              image.keywords &&
              image.keywords.some((keyword) =>
                keyword.toLowerCase().includes(searchTermLower)
              )
          );
          if (hasMatchingKeywords) return true;
        }
      }

      return false;
    });

    setFilteredAlbums(filtered);
    setNoResultsFound(filtered.length === 0);

    // Reset to first page when search results change
    setPage(1);
  }, [albumsWithDetails, searchTerm, searchFilters]);

  // Show toast message
  const showToast = (message, type = "success") => {
    setToastMessage({ show: true, message, type });
    setTimeout(() => {
      setToastMessage({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Handle search
  const handleSearch = (term, filters) => {
    setSearchTerm(term);
    setSearchFilters(filters);
  };

  // Toggle dropdown menu for album actions
  const toggleDropdown = (id, e) => {
    if (e) e.stopPropagation();

    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  // Handle album deletion process
  const handleDeleteClick = (id, e) => {
    e.stopPropagation();
    setAlbumToDelete(id);
    setShowConfirmDelete(true);
    setActiveDropdown(null);
  };

  // Download keywords as CSV for a single album - Updated to use modal
  const handleDownloadCSV = async (albumId, e) => {
    if (e) e.stopPropagation();
    setActiveDropdown(null);

    // Find album name
    const album = albumsWithDetails.find((a) => a.album_id === albumId);
    const albumName = album?.album_name || `Album ${albumId.substring(0, 8)}`;

    setModalConfig({
      albumId,
      albumName,
      isMultiple: false,
      selectedAlbumIds: [albumId],
    });
    setShowPlatformModal(true);
  };

  // Download keywords as CSV for multiple selected albums - Updated to use modal
  const handleDownloadSelectedCSV = async () => {
    if (selectedAlbums.length === 0) {
      showToast("Please select at least one album first", "error");
      return;
    }

    setModalConfig({
      albumId: null,
      albumName: null,
      isMultiple: true,
      selectedAlbumIds: selectedAlbums,
    });
    setShowPlatformModal(true);
  };

  // Handle platform selection and CSV download
  const handlePlatformConfirm = async (platform) => {
    const { isMultiple, selectedAlbumIds, albumId, albumName } = modalConfig;

    setIsDownloadingCSV(true);

    try {
      if (isMultiple) {
        // Handle multiple albums
        setDownloadProgress({ current: 0, total: selectedAlbumIds.length });

        // Show initial progress message
        showToast(
          `Starting download of ${selectedAlbumIds.length} CSV files for ${platform}...`,
          "success"
        );

        // Progress callback to update the progress state
        const onProgress = (progress) => {
          console.log("Download progress:", progress); // Debug log
          setDownloadProgress({
            current: progress.current,
            total: progress.total,
          });
        };

        const result = await imageService.downloadMultipleAlbumsCSV(
          selectedAlbumIds,
          platform,
          onProgress
        );

        if (result.failed > 0) {
          const errorMessages = result.errors
            .map((e) => `Album ${e.albumId.substring(0, 8)}: ${e.error}`)
            .join("\n");

          showToast(
            `Downloaded ${result.successful}/${result.total} files successfully. ${result.failed} failed:\n${errorMessages}`,
            "error"
          );
        } else {
          showToast(
            `Successfully downloaded ${result.successful} CSV files for ${platform}!`
          );
        }

        // Show completion progress for a moment before closing
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        // Handle single album
        await imageService.downloadKeywordsCSV(
          albumId || selectedAlbumIds[0],
          platform
        );
        showToast(`Keywords CSV for ${platform} downloaded successfully`);
      }
    } catch (error) {
      console.error("Failed to download CSV:", error);

      // Handle specific error messages
      let errorMessage = "Failed to download CSV. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, "error");
    } finally {
      setIsDownloadingCSV(false);
      setDownloadProgress({ current: 0, total: 0 });
      setShowPlatformModal(false);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    if (!isDownloadingCSV) {
      setShowPlatformModal(false);
      setModalConfig({
        albumId: null,
        albumName: null,
        isMultiple: false,
        selectedAlbumIds: [],
      });
    }
  };

  // Confirm album deletion
  const confirmDelete = async () => {
    if (albumToDelete) {
      setIsProcessing(true);
      try {
        await dispatch(deleteAlbum(albumToDelete)).unwrap();
        setSelectedAlbums(selectedAlbums.filter((id) => id !== albumToDelete));
        showToast("Album deleted successfully");
      } catch (error) {
        console.error("Failed to delete album:", error);
        showToast("Failed to delete album. Please try again.", "error");
      } finally {
        setIsProcessing(false);
        setShowConfirmDelete(false);
        setAlbumToDelete(null);
      }
    }
  };

  // Cancel album deletion
  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setAlbumToDelete(null);
  };

  // Handle checkbox selection
  const handleCheckboxChange = (albumId, isChecked) => {
    if (isChecked) {
      setSelectedAlbums([...selectedAlbums, albumId]);
    } else {
      setSelectedAlbums(selectedAlbums.filter((id) => id !== albumId));
    }
  };

  // Handle "select all" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allAlbumIds = currentAlbums.map((album) => album.album_id);
      setSelectedAlbums(allAlbumIds);
    } else {
      setSelectedAlbums([]);
    }
  };

  // Handle deletion of selected albums
  const handleDeleteSelected = () => {
    if (selectedAlbums.length > 0) {
      // If we're deleting multiple, set the first one to delete and confirm
      setAlbumToDelete(selectedAlbums[0]);
      setShowConfirmDelete(true);
    }
  };

  // Navigate to album details
  const handleAlbumClick = (albumId) => {
    dispatch(selectAlbum(albumId));
    // Use React Router navigation instead of directly changing window.location
    navigate(`/albums/${albumId}`);
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

  // Pagination logic
  const indexOfLastAlbum = page * albumsPerPage;
  const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
  const currentAlbums = filteredAlbums.slice(
    indexOfFirstAlbum,
    indexOfLastAlbum
  );
  const totalPages = Math.ceil(filteredAlbums.length / albumsPerPage);

  // Handle pagination
  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

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

  // Helper to get a preview of the first image in an album
  const getAlbumPreview = (album) => {
    if (album.images && album.images.length > 0) {
      return album.images[0].image_link;
    }
    return null;
  };

  // Helper to get all keywords from an album's images
  const getAllKeywords = (album) => {
    if (!album.images) return [];

    const allKeywords = [];
    album.images.forEach((image) => {
      if (image.keywords) {
        image.keywords.forEach((keyword) => {
          if (!allKeywords.includes(keyword)) {
            allKeywords.push(keyword);
          }
        });
      }
    });

    // Return maximum 5 keywords
    return allKeywords.slice(0, 5);
  };

  // Skeleton component for loading state
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="p-4">
        <div className="flex items-center justify-center">
          <div className="h-4 w-4 bg-indigo-100 rounded"></div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 mr-4"></div>
          <div className="flex flex-col">
            <div className="h-3 bg-indigo-100 rounded w-16 mb-1"></div>
            <div className="h-4 bg-indigo-200 rounded w-32 mb-1"></div>
            <div className="h-3 bg-purple-100 rounded w-48"></div>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex justify-center">
          <div className="h-6 w-8 bg-indigo-100 rounded-full"></div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200"></div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1.5">
          <div className="h-6 w-16 bg-indigo-100 rounded-full"></div>
          <div className="h-6 w-20 bg-purple-100 rounded-full"></div>
          <div className="h-6 w-14 bg-indigo-200 rounded-full"></div>
        </div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-purple-100 rounded w-20"></div>
      </td>
      <td className="p-4">
        <div className="h-8 w-8 bg-indigo-100 rounded-full"></div>
      </td>
    </tr>
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
          {/* Header skeleton */}
          <div className="animate-pulse">
            <div className="h-12 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-indigo-100 rounded w-96 mx-auto mb-8"></div>
          </div>

          <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm">
            {/* Card background with glass effect */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/50 to-purple-200/50 rounded-2xl blur-sm opacity-50"></div>

            <div className="relative p-6">
              {/* Search bar skeleton */}
              <div className="animate-pulse mb-6">
                <div className="h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl mb-4"></div>
              </div>

              {/* Controls skeleton */}
              <div className="flex items-center mb-6 py-3 border-b border-gray-200 animate-pulse">
                <div className="flex items-center">
                  <div className="h-5 w-10 bg-indigo-200 rounded-full mr-3"></div>
                  <div className="h-4 w-32 bg-indigo-100 rounded"></div>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <div className="h-8 w-8 bg-indigo-100 rounded-full"></div>
                  <div className="h-8 w-8 bg-purple-100 rounded-full"></div>
                  <div className="flex">
                    <div className="h-8 w-8 bg-indigo-100 rounded-l-lg"></div>
                    <div className="h-8 w-8 bg-indigo-200"></div>
                    <div className="h-8 w-8 bg-purple-100 rounded-r-lg"></div>
                  </div>
                </div>
              </div>

              {/* Table skeleton */}
              <div className="rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-indigo-100/70 backdrop-blur-sm">
                    <tr className="text-left text-gray-700 border-b border-gray-200">
                      <th className="w-8 p-4 rounded-tl-xl">
                        <div className="flex items-center justify-center">
                          <div className="h-4 w-4 bg-indigo-200 rounded animate-pulse"></div>
                        </div>
                      </th>
                      <th className="p-4 w-1/4">Album</th>
                      <th className="p-4 w-16 text-center">Files</th>
                      <th className="p-4 w-20 text-center">Status</th>
                      <th className="p-4 w-1/4">Keywords</th>
                      <th className="p-4 w-1/6">Created</th>
                      <th className="p-4 w-16 rounded-tr-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[...Array(5)].map((_, index) => (
                      <SkeletonRow key={index} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination skeleton */}
              <div className="p-4 flex justify-between text-gray-600 animate-pulse">
                <div className="h-8 w-8 bg-indigo-100 rounded-lg"></div>
                <div className="flex items-center space-x-2">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className={`h-8 w-8 rounded-lg ${
                        index % 2 === 0 ? "bg-indigo-100" : "bg-purple-100"
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
      {toastMessage.show && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white shadow-lg z-[100] transition-all duration-300 ${
            toastMessage.type === "success" ? "bg-indigo-600" : "bg-red-600"
          }`}
        >
          {toastMessage.message}
        </div>
      )}

      {/* Download Progress Toast */}
      {isDownloadingCSV && downloadProgress.total > 1 && (
        <div className="fixed top-16 right-4 mt-2 px-4 py-2 rounded-lg text-white shadow-lg z-[100] bg-gradient-to-r from-indigo-600 to-purple-700">
          {downloadProgress.current === 0
            ? `Preparing to download ${downloadProgress.total} files...`
            : downloadProgress.current === downloadProgress.total
            ? `Completed ${downloadProgress.current} of ${downloadProgress.total} files!`
            : `Downloading ${downloadProgress.current} of ${downloadProgress.total} files...`}
        </div>
      )}

      <div className="w-full max-w-6xl relative">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
          Albums
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Check out your albums and manage them easily. You can search, filter,
          and delete albums as needed. The albums are displayed in a table
          format.
        </p>
        <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-500 opacity-100 scale-100">
          {/* Card background with glass effect */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl"></div>

          {/* Inner glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/50 to-purple-200/50 rounded-2xl blur-sm opacity-50"></div>

          <div className="relative p-6">
            {/* Search bar */}
            <SearchBar onSearch={handleSearch} initialValue={searchTerm} />

            <div className="flex items-center mb-6 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <div className="relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-300">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={displayIds}
                    onChange={() => setDisplayIds(!displayIds)}
                  />
                  <span
                    className={`pointer-events-none relative inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                      displayIds ? "translate-x-5" : "translate-x-0"
                    }`}
                  >
                    {displayIds && (
                      <span className="absolute inset-0 flex h-full w-full items-center justify-center text-indigo-500">
                        <Check size={10} />
                      </span>
                    )}
                  </span>
                </div>
                <span className="text-gray-800 ml-3 mr-2">
                  Display album IDs
                </span>
              </div>

              {selectedAlbums.length > 0 && (
                <div className="ml-6 px-2.5 py-1 bg-indigo-100 backdrop-blur-sm rounded-full text-xs font-medium text-indigo-700 border border-indigo-200">
                  {selectedAlbums.length} selected
                </div>
              )}

              <div className="ml-auto flex items-center space-x-2">
                <button
                  className="p-2 rounded-full hover:bg-indigo-100 transition-all duration-300 group"
                  title="Export selected albums as CSV"
                  onClick={handleDownloadSelectedCSV}
                  disabled={selectedAlbums.length === 0 || isDownloadingCSV}
                >
                  <Download
                    className={`${
                      selectedAlbums.length > 0 && !isDownloadingCSV
                        ? "text-gray-600 group-hover:text-gray-800"
                        : "text-gray-400"
                    } transition-all duration-300`}
                    size={18}
                  />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-indigo-100 transition-all duration-300 group"
                  title="Delete selected albums"
                  onClick={handleDeleteSelected}
                  disabled={selectedAlbums.length === 0}
                >
                  <Trash2
                    className={`${
                      selectedAlbums.length > 0
                        ? "text-gray-600 group-hover:text-red-600"
                        : "text-gray-400"
                    } transition-all duration-300`}
                    size={18}
                  />
                </button>
                <div className="flex ml-2">
                  <button
                    className="p-2 rounded-l-lg bg-white/70 hover:bg-white transition-all duration-300 group border border-gray-200 border-r-0"
                    onClick={goToPrevPage}
                    disabled={page === 1}
                  >
                    <ChevronLeft
                      className={`${
                        page > 1
                          ? "text-gray-600 group-hover:text-gray-800"
                          : "text-gray-400"
                      } transition-all duration-300`}
                      size={18}
                    />
                  </button>
                  <button
                    className="p-2 bg-white/70 hover:bg-white transition-all duration-300 group border border-gray-200 border-r-0"
                    onClick={goToNextPage}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight
                      className={`${
                        page < totalPages
                          ? "text-gray-600 group-hover:text-gray-800"
                          : "text-gray-400"
                      } transition-all duration-300`}
                      size={18}
                    />
                  </button>
                  <button
                    className="p-2 rounded-r-lg bg-white/70 hover:bg-white transition-all duration-300 group border border-gray-200"
                    onClick={() => setPage(totalPages)}
                    disabled={page >= totalPages}
                  >
                    <ChevronsRight
                      className={`${
                        page < totalPages
                          ? "text-gray-600 group-hover:text-gray-800"
                          : "text-gray-400"
                      } transition-all duration-300`}
                      size={18}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-100 text-red-700 border border-red-200 rounded-xl p-4 mb-6">
                <p>Error: {error}</p>
                <button
                  className="mt-2 px-3 py-1 bg-red-200 hover:bg-red-300 rounded-lg text-red-800 text-sm"
                  onClick={() => dispatch(fetchAlbumsWithDetails())}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!error && filteredAlbums.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-indigo-100 rounded-full p-5 mb-4">
                  {noResultsFound ? (
                    <Search className="text-indigo-600" size={32} />
                  ) : (
                    <Trash2 className="text-indigo-600" size={32} />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {noResultsFound ? "No Results Found" : "No Albums Found"}
                </h3>
                <p className="text-gray-600 max-w-md">
                  {noResultsFound
                    ? `No albums match your search for "${searchTerm}"`
                    : "You haven't created any albums yet. Upload some images to get started."}
                </p>
                {noResultsFound && (
                  <button
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}

            {/* Album table */}
            {!error && currentAlbums.length > 0 && (
              <div className="rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-indigo-100/70 backdrop-blur-sm">
                    <tr className="text-left text-gray-700 border-b border-gray-200">
                      <th className="w-8 p-4 rounded-tl-xl">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 cursor-pointer accent-indigo-500"
                            checked={
                              selectedAlbums.length === currentAlbums.length &&
                              currentAlbums.length > 0
                            }
                            onChange={handleSelectAll}
                          />
                        </div>
                      </th>
                      <th className="p-4 w-1/4">Album</th>
                      <th className="p-4 w-16 text-center">Files</th>
                      <th className="p-4 w-20 text-center">Status</th>
                      <th className="p-4 w-1/4">Keywords</th>
                      <th className="p-4 w-1/6">Created</th>
                      <th className="p-4 w-16 rounded-tr-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentAlbums.map((album, index) => (
                      <tr
                        key={album.album_id}
                        className={`text-gray-800 transition-all duration-300 group ${
                          hoveredRow === album.album_id
                            ? "bg-indigo-50/60 backdrop-blur-sm"
                            : ""
                        }`}
                        onMouseEnter={() => setHoveredRow(album.album_id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        onClick={() => handleAlbumClick(album.album_id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td
                          className="p-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 cursor-pointer accent-indigo-500"
                              checked={selectedAlbums.includes(album.album_id)}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  album.album_id,
                                  e.target.checked
                                )
                              }
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-200/60 to-purple-200/60 backdrop-blur-sm flex items-center justify-center mr-4 transition-all duration-300 group-hover:scale-105 border border-gray-200">
                              {getAlbumPreview(album) ? (
                                <img
                                  src={getAlbumPreview(album)}
                                  alt={album.album_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-purple-500">
                                  {album.album_name
                                    ? album.album_name.charAt(0).toUpperCase()
                                    : "A"}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-col">
                              {displayIds && (
                                <span className="text-xs text-gray-500 mb-0.5">
                                  #{album.album_id.substring(0, 8)}...
                                </span>
                              )}
                              <span className="text-sm text-gray-800 font-medium mb-1">
                                {album.album_name || "Untitled Album"}
                              </span>
                              <span className="text-xs text-gray-500 line-clamp-1">
                                {album.images && album.images[0]
                                  ? album.images[0].description?.substring(
                                      0,
                                      80
                                    ) + "..."
                                  : "No description available"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center">
                            <span className="bg-indigo-100 px-2.5 py-1 rounded-full text-sm border border-indigo-200 transition-colors duration-300 group-hover:bg-indigo-200">
                              {album.image_count || 0}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500/80 to-purple-500/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                              <Check size={14} className="text-white" />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1.5">
                            {getAllKeywords(album).map((keyword, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 bg-indigo-100 backdrop-blur-sm rounded-full text-xs border border-indigo-200 transition-all duration-300 hover:bg-indigo-200 hover:border-indigo-300 cursor-default"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSearchTerm(keyword);
                                }}
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {formatDate(album.created_at)}
                        </td>
                        <td
                          className="p-4 relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="p-2 rounded-full hover:bg-indigo-100 transition-all duration-300 group-hover:text-gray-800"
                            onClick={(e) => toggleDropdown(album.album_id, e)}
                          >
                            <MoreVertical
                              size={18}
                              className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300"
                            />
                          </button>

                          {activeDropdown === album.album_id && (
                            <div
                              className="absolute right-0 z-50 w-48 py-1 rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 animate-fadeIn shadow-xl"
                              style={{
                                top: "auto",
                                bottom: "auto",
                                [index >= currentAlbums.length - 1
                                  ? "bottom"
                                  : "top"]: "3rem",
                              }}
                            >
                              {/* Dropdown background with glass effect */}
                              <div className="absolute inset-0 bg-white/90 border border-gray-200"></div>

                              <div className="relative flex flex-col divide-y divide-gray-100">
                                <button
                                  className="flex items-center px-4 py-3 hover:bg-indigo-50 text-gray-700 text-left cursor-pointer transition-all duration-300"
                                  onClick={(e) =>
                                    handleDownloadCSV(album.album_id, e)
                                  }
                                  disabled={isDownloadingCSV}
                                >
                                  <FileText
                                    size={16}
                                    className="mr-3 text-gray-500"
                                  />
                                  {isDownloadingCSV
                                    ? "Exporting..."
                                    : "Export CSV"}
                                </button>
                                <button
                                  className="flex items-center px-4 py-3 hover:bg-red-50 text-gray-700 text-left cursor-pointer transition-all duration-300"
                                  onClick={(e) =>
                                    handleDeleteClick(album.album_id, e)
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!error && filteredAlbums.length > 0 && (
              <div className="p-4 flex justify-between text-gray-600">
                <button
                  className={`p-2 rounded-lg ${
                    page > 1
                      ? "bg-white/70 hover:bg-white border border-gray-200"
                      : "bg-gray-100 cursor-not-allowed border border-gray-200"
                  } transition-all duration-300 disabled:opacity-50`}
                  onClick={goToPrevPage}
                  disabled={page <= 1}
                >
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNumber;

                    if (totalPages <= 5) {
                      // If we have 5 or fewer pages, show all
                      pageNumber = i + 1;
                    } else if (page <= 3) {
                      // If we're on one of the first 3 pages
                      if (i < 4) {
                        pageNumber = i + 1;
                      } else {
                        pageNumber = totalPages;
                      }
                    } else if (page >= totalPages - 2) {
                      // If we're on one of the last 3 pages
                      if (i === 0) {
                        pageNumber = 1;
                      } else {
                        pageNumber = totalPages - 4 + i;
                      }
                    } else {
                      // We're somewhere in the middle
                      if (i === 0) {
                        pageNumber = 1;
                      } else if (i === 4) {
                        pageNumber = totalPages;
                      } else {
                        pageNumber = page - 1 + i;
                      }
                    }

                    // Special case: we need an ellipsis instead of a button
                    if (
                      (i === 1 && pageNumber !== 2 && page > 3) ||
                      (i === 3 &&
                        pageNumber !== totalPages - 1 &&
                        page < totalPages - 2)
                    ) {
                      return (
                        <span key={i} className="text-gray-500">
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setPage(pageNumber)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                          page === pageNumber
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 backdrop-blur-sm text-white font-medium"
                            : "hover:bg-indigo-50 text-gray-600 hover:text-gray-800 transition-all duration-300"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                <button
                  className={`p-2 rounded-lg ${
                    page < totalPages
                      ? "bg-white/70 hover:bg-white border border-gray-200"
                      : "bg-gray-100 cursor-not-allowed border border-gray-200"
                  } transition-all duration-300 disabled:opacity-50`}
                  onClick={goToNextPage}
                  disabled={page >= totalPages}
                >
                  <ChevronRight size={18} className="text-gray-600" />
                </button>
              </div>
            )}

            {/* Search statistics */}
            {searchTerm && !error && (
              <div className="flex justify-center mt-4">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <Info size={14} className="text-indigo-500" />
                  <span>
                    {noResultsFound
                      ? `No albums match "${searchTerm}"`
                      : `Showing ${filteredAlbums.length} ${
                          filteredAlbums.length === 1 ? "album" : "albums"
                        } matching "${searchTerm}"`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Platform Selection Modal */}
      <PlatformSelectionModal
        isOpen={showPlatformModal}
        onClose={handleModalClose}
        onConfirm={handlePlatformConfirm}
        isLoading={isDownloadingCSV}
        albumId={modalConfig.albumId}
        albumName={modalConfig.albumName}
        isMultiple={modalConfig.isMultiple}
        selectedCount={modalConfig.selectedAlbumIds.length}
      />

      {/* Delete confirmation modal */}
      {showConfirmDelete && (
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
                Are you sure you want to delete this album? This action cannot
                be undone.
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

export default AlbumsPage;
