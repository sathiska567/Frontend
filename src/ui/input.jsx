import React from "react";

// Create a stylesheet for the autofill styles
const createGlobalStyle = () => {
  // Create a style element
  const styleEl = document.createElement("style");
  styleEl.type = "text/css";

  // Define the CSS with indigo/purple theme
  styleEl.innerHTML = `
    /* Chrome, Safari, Edge */
    input.autofill-custom:-webkit-autofill,
    input.autofill-custom:-webkit-autofill:hover,
    input.autofill-custom:-webkit-autofill:focus {
      -webkit-text-fill-color: #1f2937;
      -webkit-box-shadow: 0 0 0px 1000px rgba(199, 210, 254, 0.4) inset !important;
      box-shadow: 0 0 0px 1000px rgba(199, 210, 254, 0.4) inset !important;
      transition: background-color 5000s ease-in-out 0s;
      background-image: linear-gradient(
        to right,
        rgba(129, 140, 248, 0.1),
        rgba(147, 51, 234, 0.1)
      ) !important;
      background-clip: padding-box !important;
      border-color: #6366f1 !important;
    }
    
    /* Firefox */
    input.autofill-custom:autofill {
      -webkit-text-fill-color: #1f2937;
      box-shadow: 0 0 0px 1000px rgba(199, 210, 254, 0.4) inset !important;
      background-image: linear-gradient(
        to right,
        rgba(129, 140, 248, 0.1),
        rgba(147, 51, 234, 0.1)
      ) !important;
      border-color: #6366f1 !important;
    }
    
    /* For modern browsers that support appearance */
    @supports (-webkit-appearance: none) or (appearance: none) {
      input.autofill-custom:-webkit-autofill::selection,
      input.autofill-custom:autofill::selection {
        background-color: rgba(129, 140, 248, 0.2) !important;
      }
    }
  `;

  // Append the style element to the head once
  if (!document.head.querySelector("#autofill-styles")) {
    styleEl.id = "autofill-styles";
    document.head.appendChild(styleEl);
  }
};

export const Input = ({
  type = "text",
  label,
  name,
  value,
  onChange,
  placeholder = "",
  error = "",
  className = "",
  required = false,
  icon = null,
}) => {
  // Inject the global styles when the component mounts
  React.useEffect(() => {
    createGlobalStyle();
  }, []);

  return (
    <div className={`w-full mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-indigo-600">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-4 py-2 border rounded-lg 
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-500" : "border-gray-300"}
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            autofill-custom
          `}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
