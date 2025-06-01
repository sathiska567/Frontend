/* eslint-disable no-unused-vars */
// components/AlbumsPage/components/SearchBar.js
import React, { useState, useEffect, useRef } from "react";
import { Search, X, Filter, ChevronDown } from "lucide-react";

const SearchBar = ({ onSearch, initialValue = "" }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchInTitles: true,
    searchInDescriptions: true,
    searchInKeywords: true,
    searchInDates: false,
  });
  const filterRef = useRef(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounce search input
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm, filters);
      }
    }, 300);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchTerm, filters, onSearch]);

  const handleClearSearch = () => {
    setSearchTerm("");
    if (onSearch) {
      onSearch("", filters);
    }
  };

  const toggleFilter = (filterName) => {
    setFilters({
      ...filters,
      [filterName]: !filters[filterName],
    });
  };

  return (
    <div className="w-full mb-6 relative">
      <div
        className={`relative transition-all duration-300 ${
          isFocused ? "transform scale-[1.01]" : ""
        }`}
      >
        {/* Background glow on focus */}
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-sm transition-opacity duration-300 ${
            isFocused ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search
              size={20}
              className={`transition-colors duration-300 ${
                isFocused ? "text-indigo-400" : "text-gray-400"
              }`}
            />
          </div>

          <input
            type="text"
            placeholder="Search albums by name, keywords, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full bg-white backdrop-blur-md text-gray-700 pl-12 pr-28 py-4 rounded-xl border transition-all duration-300 focus:outline-none shadow-sm ${
              isFocused
                ? "border-indigo-500/50 ring-2 ring-indigo-500/20"
                : "border-gray-300 hover:border-gray-400"
            }`}
          />

          {/* Filter button */}
          <div
            className="absolute right-16 inset-y-0 flex items-center"
            ref={filterRef}
          >
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full transition-colors duration-300 ${
                showFilters || Object.values(filters).some((v) => !v)
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-transparent text-gray-400 hover:text-gray-600"
              }`}
              aria-label="Search filters"
            >
              <Filter size={18} />
            </button>

            {/* Filter dropdown */}
            {showFilters && (
              <div className="absolute right-0 top-14 z-50 w-64 py-2 rounded-xl backdrop-blur-md shadow-xl animate-fadeIn">
                {/* Dropdown background with glass effect */}
                <div className="absolute inset-0 bg-white/90 border border-gray-200 rounded-xl"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-sm opacity-30"></div>

                <div className="relative p-3">
                  <h4 className="text-gray-800 font-medium mb-2 border-b border-gray-200 pb-2">
                    Search Filters
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-sm text-gray-600 cursor-pointer hover:bg-indigo-50 p-2 rounded-lg transition-colors">
                      <span>Search in album names</span>
                      <div
                        className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          filters.searchInTitles
                            ? "bg-indigo-500"
                            : "bg-gray-300"
                        }`}
                        onClick={() => toggleFilter("searchInTitles")}
                      >
                        <span
                          className={`pointer-events-none relative inline-block h-3 w-3 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                            filters.searchInTitles
                              ? "translate-x-4"
                              : "translate-x-0"
                          }`}
                        >
                          {filters.searchInTitles && (
                            <span className="absolute inset-0 flex h-full w-full items-center justify-center text-indigo-500 scale-75">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-3 h-3"
                              >
                                <path
                                  d="M5 13L9 17L19 7"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                        </span>
                      </div>
                    </label>
                    <label className="flex items-center justify-between text-sm text-gray-600 cursor-pointer hover:bg-indigo-50 p-2 rounded-lg transition-colors">
                      <span>Search in descriptions</span>
                      <div
                        className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          filters.searchInDescriptions
                            ? "bg-indigo-500"
                            : "bg-gray-300"
                        }`}
                        onClick={() => toggleFilter("searchInDescriptions")}
                      >
                        <span
                          className={`pointer-events-none relative inline-block h-3 w-3 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                            filters.searchInDescriptions
                              ? "translate-x-4"
                              : "translate-x-0"
                          }`}
                        >
                          {filters.searchInDescriptions && (
                            <span className="absolute inset-0 flex h-full w-full items-center justify-center text-indigo-500 scale-75">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-3 h-3"
                              >
                                <path
                                  d="M5 13L9 17L19 7"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                        </span>
                      </div>
                    </label>
                    <label className="flex items-center justify-between text-sm text-gray-600 cursor-pointer hover:bg-indigo-50 p-2 rounded-lg transition-colors">
                      <span>Search in keywords</span>
                      <div
                        className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          filters.searchInKeywords
                            ? "bg-indigo-500"
                            : "bg-gray-300"
                        }`}
                        onClick={() => toggleFilter("searchInKeywords")}
                      >
                        <span
                          className={`pointer-events-none relative inline-block h-3 w-3 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                            filters.searchInKeywords
                              ? "translate-x-4"
                              : "translate-x-0"
                          }`}
                        >
                          {filters.searchInKeywords && (
                            <span className="absolute inset-0 flex h-full w-full items-center justify-center text-indigo-500 scale-75">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-3 h-3"
                              >
                                <path
                                  d="M5 13L9 17L19 7"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                        </span>
                      </div>
                    </label>
                    <label className="flex items-center justify-between text-sm text-gray-600 cursor-pointer hover:bg-indigo-50 p-2 rounded-lg transition-colors">
                      <span>Search in dates</span>
                      <div
                        className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          filters.searchInDates
                            ? "bg-indigo-500"
                            : "bg-gray-300"
                        }`}
                        onClick={() => toggleFilter("searchInDates")}
                      >
                        <span
                          className={`pointer-events-none relative inline-block h-3 w-3 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                            filters.searchInDates
                              ? "translate-x-4"
                              : "translate-x-0"
                          }`}
                        >
                          {filters.searchInDates && (
                            <span className="absolute inset-0 flex h-full w-full items-center justify-center text-indigo-500 scale-75">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-3 h-3"
                              >
                                <path
                                  d="M5 13L9 17L19 7"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clear button */}
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 inset-y-0 flex items-center p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Search filters chips/tags (visible when filters are applied) */}
      {Object.entries(filters).some(([key, value]) => !value) && (
        <div className="flex items-center flex-wrap mt-2 gap-2">
          <span className="text-xs text-gray-500">Searching in:</span>
          {filters.searchInTitles && (
            <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">
              Album names
            </span>
          )}
          {filters.searchInDescriptions && (
            <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">
              Descriptions
            </span>
          )}
          {filters.searchInKeywords && (
            <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">
              Keywords
            </span>
          )}
          {filters.searchInDates && (
            <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">
              Dates
            </span>
          )}
          {!filters.searchInTitles &&
            !filters.searchInDescriptions &&
            !filters.searchInKeywords &&
            !filters.searchInDates && (
              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                No filters selected
              </span>
            )}
        </div>
      )}

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
