// pages/UserProfilePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Edit2,
  Camera,
  Mail,
  Briefcase,
  Save,
  X,
  Tag,
  Image,
  Plus,
  RefreshCw,
  Eye,
  Trash2,
  CreditCard,
} from "lucide-react";
import userService from "../../services/userService";
import authService from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlbumsWithDetails } from "../../store/slices/albumSlice";
import { addNotification } from "../../store/slices/uiSlice";

// Skeleton Loading Components
const SkeletonCard = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg h-full"></div>
  </div>
);

const SkeletonText = ({ width = "w-full", height = "h-4" }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-indigo-100 to-purple-100 rounded ${width} ${height}`}
  ></div>
);

const SkeletonAvatar = () => (
  <div className="relative mx-auto sm:mx-0">
    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full blur opacity-70"></div>
    <div className="relative rounded-full p-1 bg-gradient-to-r from-indigo-300 to-purple-300">
      <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full border-2 border-white/20 bg-gradient-to-br from-indigo-50 to-purple-50 animate-pulse"></div>
    </div>
  </div>
);

const SkeletonImageCard = () => (
  <div className="relative">
    {/* Outer border container */}
    <div className="relative rounded-lg border-2 border-indigo-200 overflow-hidden bg-white/90 backdrop-blur-sm shadow-md">
      {/* Subtle glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-lg blur-sm opacity-50 -z-10"></div>

      {/* Image skeleton */}
      <div className="h-28 xs:h-32 sm:h-36 bg-gradient-to-br from-indigo-100 to-purple-100 animate-pulse"></div>
      {/* Content skeleton */}
      <div className="p-2 sm:p-3">
        <SkeletonText width="w-3/4" height="h-3" />
        <div className="flex gap-1 mt-2">
          <SkeletonText width="w-12" height="h-4" />
          <SkeletonText width="w-16" height="h-4" />
        </div>
      </div>
    </div>
  </div>
);

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
  actionType,
}) => {
  if (!isOpen) return null;

  // Determine button text based on action type and loading state
  let buttonText = "Confirm";
  let loadingText = "Processing...";

  if (actionType === "save") {
    buttonText = "Save";
    loadingText = "Saving...";
  } else if (actionType === "delete") {
    buttonText = "Delete";
    loadingText = "Deleting...";
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm w-full max-w-md">
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm border border-indigo-200 rounded-2xl shadow-xl"></div>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/50 to-purple-200/50 rounded-2xl blur-sm opacity-50"></div>

        <div className="relative p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
            {title}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
            {message}
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-gray-100 transition-all duration-300 ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md transition-all duration-300 flex items-center ${
                isLoading
                  ? "opacity-90 cursor-wait"
                  : "hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-600/20"
              }`}
            >
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-1.5 h-3 w-3 sm:h-4 sm:w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoading ? loadingText : buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get albums from Redux store
  const { albumsWithDetails } = useSelector((state) => state.albums);

  // User data state
  const [userData, setUserData] = useState({
    f_name: "",
    l_name: "",
    email: "",
    package_name: "",
    credits: 0,
  });

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  // Temporary state for editing
  const [editData, setEditData] = useState({ ...userData });
  // Loading state for smooth transitions
  const [isLoading, setIsLoading] = useState(true);

  // Loading states for actions
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Confirmation modals state
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await userService.getProfile();
        setUserData(profile);
        setEditData(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        dispatch(
          addNotification({
            type: "error",
            message: "Failed to load user profile",
          })
        );
      } finally {
        // Add minimum loading time for better UX
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    fetchUserProfile();
  }, [dispatch]);

  // Fetch albums data
  useEffect(() => {
    dispatch(fetchAlbumsWithDetails());
  }, [dispatch]);

  // Extract images from all albums for display
  const allImages = albumsWithDetails
    .flatMap((album) => album.images || [])
    .slice(0, 5);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  // Handle save button click - show confirmation modal
  const handleSaveClick = () => {
    setShowEditConfirmModal(true);
  };

  // Handle confirm save
  const handleConfirmSave = async () => {
    try {
      setIsSaving(true);

      await userService.updateProfile({
        f_name: editData.f_name,
        l_name: editData.l_name,
      });

      setUserData({
        ...userData,
        f_name: editData.f_name,
        l_name: editData.l_name,
      });
      setIsEditing(false);

      dispatch(
        addNotification({
          type: "success",
          message: "Profile updated successfully",
        })
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      dispatch(
        addNotification({
          type: "error",
          message: "Failed to update profile",
        })
      );
    } finally {
      setIsSaving(false);
      setShowEditConfirmModal(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  // Handle delete account button click - show confirmation modal
  const handleDeleteAccountClick = () => {
    setShowDeleteConfirmModal(true);
  };

  // Handle confirm delete account
  const handleConfirmDeleteAccount = async () => {
    try {
      setIsDeleting(true);

      await authService.deleteAccount();

      // Logout user after account deletion
      authService.logout();

      // Redirect to login page
      navigate("/login");

      dispatch(
        addNotification({
          type: "success",
          message: "Account deleted successfully",
        })
      );
    } catch (error) {
      console.error("Error deleting account:", error);
      dispatch(
        addNotification({
          type: "error",
          message: "Failed to delete account",
        })
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-3 sm:p-4 md:p-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-64 sm:w-96 h-64 sm:h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div
          className="absolute inset-0 bg-grid-pattern opacity-[0.03]"
          style={{
            backgroundSize: "30px 30px",
            backgroundImage:
              "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
          }}
        ></div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showEditConfirmModal}
        title="Save Profile Changes"
        message="Are you sure you want to save these changes to your profile?"
        onConfirm={handleConfirmSave}
        onCancel={() => !isSaving && setShowEditConfirmModal(false)}
        isLoading={isSaving}
        actionType="save"
      />

      <ConfirmationModal
        isOpen={showDeleteConfirmModal}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost."
        onConfirm={handleConfirmDeleteAccount}
        onCancel={() => !isDeleting && setShowDeleteConfirmModal(false)}
        isLoading={isDeleting}
        actionType="delete"
      />

      {/* Content Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header with skeleton loading */}
        {isLoading ? (
          <div className="text-center mb-4 sm:mb-8">
            <SkeletonText width="w-96 mx-auto" height="h-12" />
            <div className="mt-4">
              <SkeletonText width="w-64 mx-auto" height="h-4" />
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-2 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
              User Profile
            </h1>
            <p className="text-center text-gray-600 text-sm sm:text-base mb-4 sm:mb-8 max-w-2xl mx-auto px-2">
              Manage your profile information and AI-tagged images
            </p>
          </>
        )}

        {/* Main Content */}
        <div
          className={`transition-all duration-500 ${
            isLoading ? "opacity-60" : "opacity-100"
          }`}
        >
          <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm">
            {/* Card background */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-2xl shadow-xl"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/50 to-purple-200/50 rounded-2xl blur-sm opacity-50"></div>

            {/* Profile Header */}
            <div className="relative w-full h-28 sm:h-36 md:h-48 bg-gradient-to-r from-indigo-200/60 to-purple-200/60 overflow-hidden">
              <div className="absolute inset-0 backdrop-blur-sm"></div>
              <div
                className="absolute inset-0 bg-grid-pattern opacity-[0.1]"
                style={{
                  backgroundSize: "20px 20px",
                  backgroundImage:
                    "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
                }}
              ></div>
            </div>

            <div className="relative px-3 sm:px-6 py-4">
              {/* Profile Image and Edit Button */}
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <div className="flex flex-col sm:flex-row sm:items-end -mt-16 sm:-mt-16 md:-mt-16">
                  {/* Avatar with skeleton */}
                  {isLoading ? (
                    <SkeletonAvatar />
                  ) : (
                    <div className="relative mx-auto sm:mx-0">
                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-70"></div>
                      <div className="relative rounded-full p-1 bg-gradient-to-r from-indigo-500 to-purple-500">
                        <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full border-2 border-white/20 bg-white flex items-center justify-center">
                          <User size={40} className="text-gray-500 sm:hidden" />
                          <User
                            size={48}
                            className="text-gray-500 hidden sm:block md:hidden"
                          />
                          <User
                            size={64}
                            className="text-gray-500 hidden md:block"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User details with skeleton */}
                  <div className="mt-3 sm:mt-0 sm:ml-4 md:ml-6 sm:pb-2 text-center sm:text-left">
                    {isLoading ? (
                      <>
                        <SkeletonText width="w-48" height="h-6" />
                        <div className="mt-2">
                          <SkeletonText width="w-32" height="h-4" />
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-words">
                          {userData.f_name} {userData.l_name}
                        </h2>
                        <div className="flex items-center justify-center sm:justify-start mt-2">
                          <span
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-sm cursor-pointer"
                            onClick={() => navigate("/pricing")}
                          >
                            {userData.package_name}
                          </span>
                          <span className="ml-2 flex items-center text-xs sm:text-sm text-gray-600">
                            <CreditCard size={12} className="mr-1 sm:hidden" />
                            <CreditCard
                              size={14}
                              className="mr-1 hidden sm:block"
                            />
                            {userData.credits} credits
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Action buttons with skeleton */}
                <div className="mt-4 sm:mt-0 text-center sm:text-right">
                  {isLoading ? (
                    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                      <SkeletonText width="w-16" height="h-8" />
                      <SkeletonText width="w-24" height="h-8" />
                    </div>
                  ) : isEditing ? (
                    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                      <button
                        onClick={handleSaveClick}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-indigo-600/20 transition-all duration-300"
                      >
                        <Save size={16} className="mr-2" /> Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                      >
                        <X size={16} className="mr-2" /> Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-indigo-600/20 transition-all duration-300"
                      >
                        <Edit2 size={16} className="mr-2" /> Edit
                      </button>
                      <button
                        onClick={handleDeleteAccountClick}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-red-600/20 transition-all duration-300"
                      >
                        <Trash2 size={16} className="mr-2" /> Delete Account
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
                {/* User info in first column */}
                <div className="md:col-span-1">
                  <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm h-full">
                    {/* Card background */}
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm border border-indigo-200 rounded-2xl shadow-lg"></div>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-2xl blur-sm opacity-50"></div>

                    <div className="relative p-4 sm:p-6">
                      {isLoading ? (
                        <>
                          <SkeletonText width="w-32" height="h-5" />
                          <div className="mt-4 space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className="flex items-start space-x-3"
                              >
                                <SkeletonText width="w-5" height="h-5" />
                                <SkeletonText width="w-full" height="h-4" />
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4 border-b border-indigo-200 pb-2 flex justify-between items-center">
                            Personal Information
                            <User size={16} className="text-indigo-500" />
                          </h3>
                          <ul className="space-y-3 sm:space-y-4">
                            <li className="flex items-start">
                              <Mail className="h-5 w-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm sm:text-base break-all">
                                {userData.email}
                              </span>
                            </li>
                            <li className="flex items-start">
                              <User className="h-5 w-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="f_name"
                                  value={editData.f_name}
                                  onChange={handleChange}
                                  className="flex-1 text-sm sm:text-base text-gray-700 bg-transparent border-b border-indigo-500 focus:outline-none focus:border-purple-500 transition-colors"
                                  placeholder="First Name"
                                />
                              ) : (
                                <span className="text-gray-700 text-sm sm:text-base">
                                  {userData.f_name}
                                </span>
                              )}
                            </li>
                            <li className="flex items-start">
                              <User className="h-5 w-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="l_name"
                                  value={editData.l_name}
                                  onChange={handleChange}
                                  className="flex-1 text-sm sm:text-base text-gray-700 bg-transparent border-b border-indigo-500 focus:outline-none focus:border-purple-500 transition-colors"
                                  placeholder="Last Name"
                                />
                              ) : (
                                <span className="text-gray-700 text-sm sm:text-base">
                                  {userData.l_name}
                                </span>
                              )}
                            </li>
                            <li className="flex items-start">
                              <Briefcase className="h-5 w-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm sm:text-base">
                                <span
                                  className="cursor-pointer text-indigo-500"
                                  onClick={() => navigate("/pricing")}
                                >
                                  {userData.package_name}
                                </span>{" "}
                                Plan
                              </span>
                            </li>
                            <li className="flex items-start">
                              <CreditCard className="h-5 w-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm sm:text-base">
                                {userData.credits} credits available
                              </span>
                            </li>
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Image Gallery in second and third columns */}
                <div className="md:col-span-2">
                  <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm h-full">
                    {/* Card background */}
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm border border-indigo-200 rounded-2xl shadow-lg"></div>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-2xl blur-sm opacity-50"></div>

                    <div className="relative p-4 sm:p-6">
                      {isLoading ? (
                        <>
                          <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-indigo-200 pb-2">
                            <SkeletonText width="w-32" height="h-5" />
                            <SkeletonText width="w-16" height="h-6" />
                          </div>
                          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                              <SkeletonImageCard key={i} />
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-indigo-200 pb-2">
                            <h3 className="text-base sm:text-lg font-medium text-gray-800 flex items-center">
                              <span>Your Tagged Images</span>
                              <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500 ml-2" />
                            </h3>

                            <button
                              onClick={() => navigate("/upload")}
                              className="inline-flex items-center px-2 sm:px-3 py-1 text-xs font-medium rounded-full text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-sm hover:shadow-indigo-600/20 transition-all duration-300"
                            >
                              <Plus size={12} className="mr-1" /> Add New
                            </button>
                          </div>

                          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {allImages.length > 0 ? (
                              allImages.map((image, index) => (
                                <div
                                  key={image.image_id || index}
                                  className="relative group transition-all duration-300 hover:scale-[1.02]"
                                >
                                  {/* Outer border container */}
                                  <div className="relative rounded-lg border-2 border-indigo-200 group-hover:border-indigo-300 transition-colors duration-300 overflow-hidden bg-white/90 backdrop-blur-sm shadow-md">
                                    {/* Subtle glow effect */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-lg blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>

                                    {/* Image section */}
                                    <div className="h-28 xs:h-32 sm:h-36 overflow-hidden">
                                      <img
                                        src={image.image_link}
                                        alt={image.title}
                                        className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110 filter brightness-105 saturate-110 contrast-105 group-hover:brightness-110 group-hover:saturate-125"
                                      />
                                    </div>
                                    {/* Content section */}
                                    <div className="p-2 sm:p-3">
                                      <h4 className="text-gray-800 text-xs sm:text-sm font-medium mb-1 sm:mb-2 truncate">
                                        {image.title}
                                      </h4>
                                      <div className="flex flex-wrap gap-1 mb-1">
                                        {(image.keywords || [])
                                          .slice(0, 2)
                                          .map((tag, idx) => (
                                            <span
                                              key={idx}
                                              className="bg-gradient-to-r from-indigo-500/80 to-purple-500/80 text-white text-xs px-2 py-0.5 rounded-full shadow-sm"
                                            >
                                              {tag}
                                            </span>
                                          ))}
                                        {(image.keywords || []).length > 2 && (
                                          <span className="text-xs text-gray-500">
                                            +{(image.keywords || []).length - 2}{" "}
                                            more
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-full text-center py-8">
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-6 inline-block mx-auto shadow-sm">
                                  <Image
                                    size={32}
                                    className="text-indigo-400 mx-auto mb-2"
                                  />
                                  <p className="text-gray-600">
                                    No images found
                                  </p>
                                  <button
                                    onClick={() => navigate("/upload")}
                                    className="mt-4 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-sm hover:shadow-indigo-600/20 transition-all duration-300"
                                  >
                                    <Plus size={12} className="mr-1" /> Upload
                                    First Image
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* View More Card */}
                            {allImages.length > 0 && (
                              <div
                                onClick={() => navigate("/albums")}
                                className="relative group transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full flex items-center justify-center"
                              >
                                {/* Outer border container */}
                                <div className="relative rounded-lg border-2 border-indigo-200 group-hover:border-indigo-300 transition-colors duration-300 overflow-hidden bg-white/90 backdrop-blur-sm shadow-md h-full w-full">
                                  {/* Subtle glow effect */}
                                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-lg blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>

                                  <div className="relative p-4 text-center h-full flex flex-col justify-center">
                                    <div className="rounded-full bg-gradient-to-r from-indigo-200/60 to-purple-200/60 p-3 sm:p-4 mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                                      <Eye
                                        size={20}
                                        className="text-indigo-500 sm:hidden"
                                      />
                                      <Eye
                                        size={24}
                                        className="text-indigo-500 hidden sm:block"
                                      />
                                    </div>
                                    <h4 className="text-gray-800 text-base sm:text-lg font-medium mb-1 sm:mb-2">
                                      View All
                                    </h4>
                                    <p className="text-gray-600 text-xs sm:text-sm">
                                      Browse all your albums and images
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
