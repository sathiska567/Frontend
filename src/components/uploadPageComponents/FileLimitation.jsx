import React from "react";
import { Check } from "lucide-react";

const FileLimitation = ({ limitations }) => {
  return (
    <div className="p-5 relative overflow-hidden">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 to-white/90 backdrop-blur-xl rounded-2xl border border-indigo-200/50 shadow-lg"></div>

      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200/30 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-purple-200/30 rounded-full blur-2xl"></div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-[0.03] rounded-2xl"
        style={{
          backgroundSize: "20px 20px",
          backgroundImage:
            "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
        }}
      ></div>

      {/* Added justify-center to center the cards horizontally */}
      <div className="flex flex-wrap gap-5 relative z-10 py-2 justify-center">
        {limitations.map((item, index) => (
          <div
            key={index}
            className="flex items-center bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl border border-indigo-200/50 hover:border-indigo-400/50 transition-all duration-300 shadow-md hover:shadow-indigo-500/10 group"
          >
            <div className="w-6 h-6 flex-shrink-0 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mr-3 shadow-sm shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
              <Check size={14} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">{item.label}</span>
              <span className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileLimitation;
