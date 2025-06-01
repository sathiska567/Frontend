import React, { useState, useEffect } from "react";

const FeatureItem = ({ title, description, icon, image, reverse }) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInView(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } gap-8 md:gap-16 items-center transform transition-all duration-1000 ${
        isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="w-full md:w-1/2 relative group perspective">
        <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(8,112,184,0.7)] transform transition-all duration-700 group-hover:scale-105 group-hover:rotate-y-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-1">
          <div className="aspect-w-16 aspect-h-9 relative overflow-hidden rounded-xl">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60"></div>

            {/* Neon-like border effect */}
            <div className="absolute inset-0 rounded-xl border border-blue-400/20 group-hover:border-blue-400/40 shadow-[inset_0_0_10px_rgba(59,130,246,0.3)] transition-all duration-700"></div>

            {/* Feature badge */}
            <div className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white tracking-wide shadow-lg transform transition-all duration-500 group-hover:scale-110">
              Featured
            </div>
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
      </div>

      <div className="w-full md:w-1/2 relative perspective">
        <div
          className={`relative z-10 transform transition-all duration-700 ${
            isInView
              ? "translate-x-0 opacity-100"
              : `${reverse ? "-" : ""}translate-x-10 opacity-0`
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg shadow-xl border border-blue-700/30 backdrop-blur-sm relative group">
              {/* Icon background effects */}
              <div className="absolute inset-0 bg-blue-600/10 rounded-lg blur-sm"></div>
              <div className="relative">{icon}</div>
            </div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {title}
              <span className="block h-1 w-12 bg-gradient-to-r from-blue-400 to-indigo-600 mt-2 rounded-full"></span>
            </h3>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed backdrop-blur-sm relative z-10">
            {description}
          </p>
          <div className="flex mt-4">
            <button className="text-blue-400 hover:text-blue-300 text-sm font-bold py-2 flex items-center gap-2 transition-all hover:gap-3">
              Learn more
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Grid decoration */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-0.5 opacity-[0.015] pointer-events-none">
          {[...Array(64)].map((_, i) => (
            <div key={i} className="bg-white w-full h-full rounded-sm"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureItem;
