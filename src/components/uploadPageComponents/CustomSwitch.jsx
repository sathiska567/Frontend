// CustomSwitch.js
import React from "react";
import { Info, Check } from "lucide-react";

const CustomSwitch = ({ label, hasInfo = false, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-indigo-50/50 rounded-xl transition-all duration-200 group">
      <div className="flex items-center gap-2.5 text-gray-800 text-sm">
        <span>{label}</span>
        {hasInfo && (
          <button className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-indigo-100 transition-colors duration-300 transform hover:rotate-12">
            <Info size={12} className="text-indigo-600" />
          </button>
        )}
      </div>

      {/* Modern toggle switch with animation */}
      <div className="relative">
        <button
          onClick={onChange}
          className={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
            checked
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              : "bg-gradient-to-r from-gray-300 to-gray-400"
          }`}
        >
          <span className="sr-only">Toggle setting</span>

          {/* Track highlight */}
          <span
            className={`absolute inset-0 overflow-hidden rounded-full transition-opacity duration-200 ${
              checked ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="absolute h-full w-full bg-gradient-to-r from-indigo-400/30 to-purple-400/30 animate-pulse"></span>
          </span>

          {/* Toggle knob */}
          <span
            className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-in-out ${
              checked ? "translate-x-6" : "translate-x-0"
            }`}
          >
            {/* Checkmark icon */}
            <span
              className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-300 ${
                checked ? "opacity-100" : "opacity-0"
              }`}
            >
              <Check size={12} className="text-indigo-600" />
            </span>

            {/* Inner glow */}
            <span
              className={`absolute inset-0.5 rounded-full bg-gradient-to-br from-indigo-50 to-white transition-opacity duration-300 ${
                checked ? "opacity-100" : "opacity-0"
              }`}
            ></span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default CustomSwitch;
