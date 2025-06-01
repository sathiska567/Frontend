import React from "react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  disabled = false,
  type = "button",
  onClick,
}) => {
  // Button variants with indigo/purple colors and gradients
  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-md hover:shadow-lg",
    outline:
      "bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
  };

  // Button sizes
  const sizes = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        rounded-lg font-medium transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};
