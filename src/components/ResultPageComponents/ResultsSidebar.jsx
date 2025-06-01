// ResultsSidebar.js - Updated with platform selection modal integration
"use client";

import { useState, useEffect } from "react";
import PlatformSelectionModal from "../common/PlatformSelectionModal";
import imageService from "../../services/imageService";

const ResultsSidebar = ({ productData, onNavigate, imageId, albumId }) => {
  const [keywords, setKeywords] = useState(productData.keywords || []);
  const [newKeyword, setNewKeyword] = useState("");
  const [separatorType, setSeparatorType] = useState("comma-separated");
  const [activeArrow, setActiveArrow] = useState(null);
  const [title, setTitle] = useState(productData.title?.text || "");
  const [description, setDescription] = useState(
    productData.description?.text || ""
  );
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  const [error, setError] = useState("");

  // Platform selection modal state
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);

  // Update state when productData changes
  useEffect(() => {
    setKeywords(productData.keywords || []);
    setTitle(productData.title?.text || "");
    setDescription(productData.description?.text || "");
  }, [productData]);

  // Show toast message
  const showToast = (message, isError = false) => {
    setError({ message, isError });
    setTimeout(() => setError(""), 3000);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!");
  };

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) return;

    setIsAddingKeyword(true);

    try {
      const response = await imageService.addKeyword({
        keyword_name: newKeyword.trim(),
        image_id: imageId,
        album_id: albumId,
      });

      if (response && response.keyword) {
        const newId = Math.max(...keywords.map((k) => k.id), 0) + 1;
        setKeywords([...keywords, { id: newId, text: newKeyword.trim() }]);
        setNewKeyword("");
        showToast("Keyword added successfully!");
      }
    } catch (error) {
      console.error("Error adding keyword:", error);
      showToast("Failed to add keyword. Please try again.", true);
    } finally {
      setIsAddingKeyword(false);
    }
  };

  const handleRemoveKeyword = async (id, text) => {
    try {
      const response = await imageService.deleteKeyword({
        keyword_name: text,
        image_id: imageId,
        album_id: albumId,
      });

      if (response && response.deleted_count) {
        setKeywords(keywords.filter((keyword) => keyword.id !== id));
        showToast("Keyword removed successfully!");
      }
    } catch (error) {
      console.error("Error removing keyword:", error);
      showToast("Failed to remove keyword. Please try again.", true);
    }
  };

  const handleGenerateMore = () => {
    // route to the image gallery page
    window.location.href = `/albums/${albumId}`;
  };

  const handleNavigate = (direction) => {
    // Set the active arrow for color effect
    setActiveArrow(direction);

    // Call the navigation function from parent
    if (onNavigate) {
      onNavigate(direction);
    }

    // Reset the active arrow after a short delay
    setTimeout(() => {
      setActiveArrow(null);
    }, 300);
  };

  // Auto-resize text areas function
  const autoResizeTextArea = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  // Handle CSV export - Updated to use platform selection modal
  const handleExportCSV = () => {
    if (!albumId) {
      showToast("Album ID not found. Cannot export keywords.", true);
      return;
    }
    setShowPlatformModal(true);
  };

  // Handle platform selection and CSV download
  const handlePlatformConfirm = async (platform) => {
    if (!albumId) {
      showToast("Album ID not found. Cannot export keywords.", true);
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

      showToast(errorMessage, true);
    } finally {
      setIsExportingCSV(false);
      setShowPlatformModal(false);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    if (!isExportingCSV) {
      setShowPlatformModal(false);
    }
  };

  // Get album name from productData or use fallback
  const albumName =
    productData.album_name || `Album ${albumId?.substring(0, 8)}`;

  return (
    <div className="h-full flex flex-col">
      {/* Toast message */}
      {error && (
        <div
          className={`fixed top-4 right-4 p-3 rounded-lg shadow-lg z-[100] transition-opacity duration-300 ${
            error.isError ? "bg-red-500 text-white" : "bg-indigo-500 text-white"
          }`}
        >
          {error.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center mb-3">
        <div className="flex items-center">
          <span className="mr-1">📋</span>
          <h2 className="text-base font-semibold text-gray-800">Results</h2>
        </div>
        <span className="ml-1 text-gray-500 text-xs">
          {productData.resultNumber}
        </span>
        <div className="ml-auto flex">
          <button
            className={`text-gray-500 hover:text-gray-800 mr-1 rounded-full p-0.5 active:scale-95 transition-all ${
              activeArrow === "prev" ? "text-indigo-500" : ""
            }`}
            onClick={() => handleNavigate("prev")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className={`text-gray-500 hover:text-gray-800 rounded-full p-0.5 active:scale-95 transition-all ${
              activeArrow === "next" ? "text-indigo-500" : ""
            }`}
            onClick={() => handleNavigate("next")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Title Section - Auto-resizing textarea */}
      <div className="mb-3">
        <div className="relative">
          <div className="absolute -top-3.5 left-3 px-1 bg-gradient-to-b from-indigo-50 to-purple-50 z-10">
            <span className="text-xs text-gray-600">Title</span>
            <span className="text-xs text-gray-500 ml-1">{`(${
              title.length
            } chars, ${
              title.split(/\s+/).filter(Boolean).length
            } words)`}</span>
          </div>
          <textarea
            className="w-full bg-indigo-50/70 backdrop-blur-lg rounded-xl p-3 text-xs border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none min-h-[50px] overflow-hidden text-gray-800 shadow-sm transition-all duration-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onInput={autoResizeTextArea}
            onFocus={autoResizeTextArea}
          />
        </div>
      </div>

      {/* Description Section - Auto-resizing textarea */}
      <div className="mb-3">
        <div className="relative">
          <div className="absolute -top-3.5 left-3 px-1 bg-gradient-to-b from-indigo-50 to-purple-50 z-10">
            <span className="text-xs text-gray-600">Description</span>
            <span className="text-xs text-gray-500 ml-1">{`(${
              description.length
            } chars, ${
              description.split(/\s+/).filter(Boolean).length
            } words)`}</span>
          </div>
          <textarea
            className="w-full bg-indigo-50/70 backdrop-blur-lg rounded-xl p-3 text-xs border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none min-h-[75px] overflow-hidden text-gray-800 shadow-sm transition-all duration-300"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onInput={autoResizeTextArea}
            onFocus={autoResizeTextArea}
          />
        </div>
      </div>

      {/* Copy Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          className="flex items-center justify-center bg-indigo-50/70 backdrop-blur-lg hover:bg-indigo-100/70 active:scale-95 transition-all rounded-xl p-1.5 text-xs border border-indigo-200 text-gray-700 shadow-sm"
          onClick={() => handleCopy(title)}
        >
          <span className="mr-1">📋</span>
          <span>Copy title</span>
        </button>
        <button
          className="flex items-center justify-center bg-indigo-50/70 backdrop-blur-lg hover:bg-indigo-100/70 active:scale-95 transition-all rounded-xl p-1.5 text-xs border border-indigo-200 text-gray-700 shadow-sm"
          onClick={() => handleCopy(description)}
        >
          <span className="mr-1">📋</span>
          <span>Copy description</span>
        </button>
      </div>

      {/* Separator Dropdown */}
      <div className="mb-4 relative" style={{ zIndex: 30 }}>
        <div className="relative">
          <select
            className="w-full bg-indigo-50/70 backdrop-blur-lg text-gray-800 rounded-xl p-1.5 mb-2 text-xs appearance-none border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none shadow-sm transition-all duration-300"
            value={separatorType}
            onChange={(e) => setSeparatorType(e.target.value)}
          >
            <option value="comma-separated" className="bg-indigo-50">
              Comma-separated
            </option>
            <option value="space-separated" className="bg-indigo-50">
              Space-separated
            </option>
            <option value="line-separated" className="bg-indigo-50">
              Line-separated
            </option>
          </select>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <button
          className="flex items-center justify-center bg-indigo-50/70 backdrop-blur-lg hover:bg-indigo-100/70 active:scale-95 transition-all rounded-xl p-1.5 w-full text-xs border border-indigo-200 text-gray-700 shadow-sm"
          onClick={() =>
            handleCopy(
              keywords
                .map((k) => k.text)
                .join(
                  separatorType === "comma-separated"
                    ? ", "
                    : separatorType === "space-separated"
                    ? " "
                    : "\n"
                )
            )
          }
        >
          <span className="mr-1">📋</span>
          <span>Copy keywords</span>
        </button>
      </div>

      {/* Export CSV Button - Updated to use platform selection */}
      <button
        className="flex items-center justify-center bg-indigo-50/70 backdrop-blur-lg hover:bg-indigo-100/70 active:scale-95 transition-all rounded-xl p-1.5 mb-3 text-xs border border-indigo-200 text-gray-700 shadow-sm"
        onClick={handleExportCSV}
        disabled={isExportingCSV}
      >
        <span className="mr-1">📊</span>
        <span>{isExportingCSV ? "Exporting..." : "Export CSV"}</span>
      </button>

      {/* Generate More Button */}
      <button
        className="flex items-center justify-center bg-indigo-50/70 backdrop-blur-lg hover:bg-indigo-100/70 active:scale-95 transition-all rounded-xl p-1.5 mb-3 text-xs border border-indigo-200 text-gray-700 shadow-sm"
        onClick={handleGenerateMore}
      >
        <span className="mr-1">✨</span>
        <span>Generate more keywords</span>
      </button>

      {/* Keywords Section - Auto-adjusting height */}
      <div className="mb-2 flex-grow flex flex-col relative z-10">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs text-gray-700 font-medium">
            Keywords ({keywords.length})
          </h3>
          <div className="flex space-x-1">
            <button
              className="text-gray-500 hover:text-gray-800 rounded-full p-0.5 active:scale-95 transition-all"
              onClick={() => handleCopy(keywords.map((k) => k.text).join(", "))}
            >
              <span>📋</span>
            </button>
          </div>
        </div>

        {/* Add Keyword Input */}
        <div className="flex mb-2">
          <button
            className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all rounded-l-xl p-1 text-xs text-white ${
              isAddingKeyword ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleAddKeyword}
            disabled={isAddingKeyword}
          >
            {isAddingKeyword ? (
              <span className="animate-pulse">...</span>
            ) : (
              <span>+</span>
            )}
          </button>
          <input
            type="text"
            className="flex-grow bg-indigo-50/70 backdrop-blur-lg p-1.5 rounded-r-xl outline-none text-xs border border-indigo-200 border-l-0 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-gray-800 shadow-sm transition-all duration-300"
            placeholder="Add new keyword"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddKeyword()}
            disabled={isAddingKeyword}
          />
        </div>

        {/* Keywords Tags - Auto-adjusting height */}
        <div className="flex flex-wrap flex-grow p-2 cursor-default overflow-y-auto max-h-32 bg-indigo-50/30 rounded-xl border border-indigo-100">
          {keywords.map((keyword) => (
            <div
              key={keyword.id}
              className="relative m-1 inline-block"
              style={{ zIndex: 20 }}
            >
              <div className="flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full px-2.5 py-1 text-xs hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
                <span>{keyword.text}</span>
                <button
                  className="ml-1.5 text-xs hover:text-indigo-100 active:scale-95 transition-all cursor-pointer"
                  onClick={() => handleRemoveKeyword(keyword.id, keyword.text)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Again Button */}
      <div className="mt-2">
        <button
          className="w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all rounded-full py-2 text-white font-bold flex items-center justify-center text-xs"
          onClick={handleGenerateMore}
        >
          <span className="mr-1">✨</span>
          <span>View Album</span>
          <span className="ml-1">✨</span>
        </button>
      </div>

      {/* Platform Selection Modal */}
      <PlatformSelectionModal
        isOpen={showPlatformModal}
        onClose={handleModalClose}
        onConfirm={handlePlatformConfirm}
        isLoading={isExportingCSV}
        albumId={albumId}
        albumName={albumName}
        isMultiple={false}
      />
    </div>
  );
};

export default ResultsSidebar;
