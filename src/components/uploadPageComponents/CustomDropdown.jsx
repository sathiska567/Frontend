// CustomDropdown.js
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import CustomSwitch from "./CustomSwitch";
import { optionsSetOne, optionsSetTwo, optionsSetThree } from "./DropDownData";

const CustomDropdown = ({ topic, optionNumber, settings, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (setting) => {
    if (onToggle) {
      onToggle(setting, !settings[setting]);
    }
  };

  // Determine which option set to use
  let options;
  switch (optionNumber) {
    case 1:
      options = optionsSetOne;
      break;
    case 2:
      options = optionsSetTwo;
      break;
    case 3:
      options = optionsSetThree;
      break;
    default:
      options = optionsSetOne;
  }

  return (
    <div className="mb-6 relative group ">
      {/* Background glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Main container */}
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-lg border border-gray-200 shadow-xl">
        {/* Dropdown Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-white/90 to-gray-50/90 backdrop-blur-md text-gray-800 hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300"
        >
          <div className="flex items-center gap-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
            <span className="font-medium">{topic}</span>
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/70 shadow-inner">
            <ChevronDown
              size={18}
              className={`transition-transform duration-500 ${
                isExpanded ? "rotate-180 text-indigo-600" : "text-gray-500"
              }`}
            />
          </div>
        </button>

        {/* Dropdown Content */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden bg-gradient-to-b from-white/95 to-gray-50/95 backdrop-blur-md ${
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-2 divide-y divide-gray-200/50">
            {options.map(({ label, setting, icon }) => (
              <CustomSwitch
                key={setting}
                label={label}
                checked={settings[setting]}
                onChange={() => handleToggle(setting)}
                hasInfo={icon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDropdown;
