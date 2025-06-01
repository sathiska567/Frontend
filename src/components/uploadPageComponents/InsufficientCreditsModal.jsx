import React from "react";
import { X, CreditCard, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InsufficientCreditsModal = ({
  isOpen,
  onClose,
  remainingCredits,
  requestedImages,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigateToPricing = () => {
    navigate("/pricing");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-xl animate-fade-in">
        {/* Background glow effects */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl"></div>

        {/* Main content */}
        <div className="relative bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl p-6 border border-indigo-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <AlertCircle size={18} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Insufficient Credits
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X size={16} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {/* Divider with gradient */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent mb-5"></div>

          {/* Content */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
              <p className="text-gray-700 mb-3">
                You don't have enough credits to process all these images.
              </p>
              <div className="flex justify-between items-center text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-500">Remaining Credits</span>
                  <span className="text-xl font-bold text-gray-800">
                    {remainingCredits}
                  </span>
                </div>
                <div className="w-px h-10 bg-indigo-300"></div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Requested Images</span>
                  <span className="text-xl font-bold text-gray-800">
                    {requestedImages}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm">
              Please consider upgrading your plan or reducing the number of
              images to match your available credits.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleNavigateToPricing}
              className="cursor-pointer flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
            >
              <CreditCard size={16} />
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsufficientCreditsModal;
