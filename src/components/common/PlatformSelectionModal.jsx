// src/components/common/PlatformSelectionModal.jsx
import React, { useState } from "react";
import { FileText, X, Loader, Download } from "lucide-react";

const PlatformSelectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  albumId = null,
  albumName = null,
  isMultiple = false,
  selectedCount = 0,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState("shutterstock");

  const platforms = [
    {
      id: "shutterstock",
      name: "Shutterstock",
      description: "Keywords optimized for Shutterstock platform",
      icon: "🖼️",
    },
    {
      id: "adobe_stock",
      name: "Adobe Stock",
      description: "Keywords optimized for Adobe Stock platform",
      icon: "🎨",
    },
    {
      id: "other",
      name: "Other",
      description: "Generic keywords for other platforms",
      icon: "📁",
    },
  ];

  const handleConfirm = () => {
    onConfirm(selectedPlatform);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn backdrop-blur-sm">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose}></div>

      <div className="relative max-w-lg w-full mx-4 transform transition-all duration-300 animate-scaleIn">
        {/* Modal background with glass effect */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl"></div>

        {/* Inner glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200/50 to-purple-200/50 rounded-2xl blur-sm opacity-70"></div>

        <div className="relative p-6 rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mr-3">
                <FileText size={20} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Export Keywords CSV
                </h3>
                <p className="text-sm text-gray-600">
                  {isMultiple
                    ? `Export keywords for ${selectedCount} albums`
                    : `Export keywords for ${albumName || "album"}`}
                </p>
              </div>
            </div>

            {!isLoading && (
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Platform Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Select Platform:
            </h4>

            <div className="space-y-3">
              {platforms.map((platform) => (
                <label
                  key={platform.id}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedPlatform === platform.id
                      ? "border-indigo-500 bg-indigo-50/70 backdrop-blur-sm"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="platform"
                    value={platform.id}
                    checked={selectedPlatform === platform.id}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="sr-only"
                  />

                  <div className="flex items-center flex-1">
                    <span className="text-2xl mr-3">{platform.icon}</span>
                    <div>
                      <div className="font-medium text-gray-800">
                        {platform.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {platform.description}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlatform === platform.id
                        ? "border-indigo-500 bg-indigo-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedPlatform === platform.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Album Info */}
          {albumId && !isMultiple && (
            <div className="mb-6 p-3 bg-indigo-50/50 rounded-lg border border-indigo-200">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Album ID:</span>{" "}
                {albumId.substring(0, 8)}...
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all duration-300 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all duration-300 flex items-center disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={16} className="mr-2" />
                  Export CSV
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Animation styles */}
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
      `}</style>
    </div>
  );
};

export default PlatformSelectionModal;
