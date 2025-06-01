// CustomInput.js
import React, { useState } from "react";

const CustomInput = ({
  label,
  placeholder,
  icon,
  multiline = false,
  rows = 1,
  value,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="mb-6 relative group">
      {/* Background glow on focus */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-md transition-opacity duration-500 ${
          isFocused ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      <div className="relative">
        <label className="block text-gray-800 font-medium mb-2 ml-1">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            {label}
          </span>
        </label>

        {multiline ? (
          <div className="relative">
            <textarea
              placeholder={placeholder}
              rows={rows}
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full bg-white/60 backdrop-blur-xl text-gray-800 placeholder-gray-500 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300 p-4 outline-none resize-none shadow-inner"
            />
            <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-indigo-500/0 via-purple-500/50 to-indigo-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-500">
              {icon}
            </div>
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full bg-white/60 backdrop-blur-xl text-gray-800 placeholder-gray-500 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300 pl-11 p-4 outline-none shadow-inner"
            />

            {/* Highlight line */}
            <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-indigo-500/0 via-purple-500/50 to-indigo-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomInput;
