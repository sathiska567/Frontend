import React from "react";

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = "",
  shadow = "md",
  padding = "md",
  border = false,
  rounded = "lg",
}) => {
  // Card shadow options
  const shadows = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  // Card padding options
  const paddings = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-8",
  };

  // Card border radius options
  const roundedOptions = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <div
      className={`
        bg-white 
        ${shadows[shadow]} 
        ${roundedOptions[rounded]} 
        ${border ? "border border-indigo-200/20" : ""} 
        w-full 
        overflow-hidden
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="border-b border-gray-100 px-6 py-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          )}
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}

      <div className={paddings[padding]}>{children}</div>

      {footer && (
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
