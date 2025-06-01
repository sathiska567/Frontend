import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Bot,
  Trash2,
  Clipboard,
  RefreshCw,
  ChevronUp,
  Plus,
  X,
} from "lucide-react";

const HowDoesItWork = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hoverKeyword, setHoverKeyword] = useState(null);

  const keywords = [
    "electronics",
    "equipment",
    "display",
    "technology",
    "gadgets",
    "exhibit",
    "innovation",
    "modern",
    "devices",
    "computers",
    "present",
    "numbers",
    "keyboards",
    "mouse",
    "laptops",
    "tablets",
    "smartphones",
    "headphones",
    "speakers",
    "cameras",
  ];

  const stepsData = [
    {
      title: "Upload Photos and Videos",
      icon: <Camera size={20} />,
      description:
        "Simply select the files you want to upload and you're good to go. Optionally, you can customize the upload by selecting maximum title length, providing custom context or keywords, and configuring many other settings.",
    },
    {
      title: "Review Results",
      icon: <Bot size={20} />,
      description:
        "Shortly after the upload, you will be able to review your results. If you're happy with the results, you can move on to export. If you want to make changes, you can adjust keywords, edit the title and description, or regenerate all results produced.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Header */}
      <div className="text-center mb-16 relative">
        <h1 className="inline-block text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-700 via-gray-900 to-black mb-2">
          How Does It Work?
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
      </div>

      {/* Steps Navigation */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-gray-100 rounded-full p-1">
          {stepsData.map((step, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeStep === index
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {activeStep === index && (
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"></span>
              )}
              <span className="relative">{`Step ${index + 1}`}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="relative">
        {stepsData.map((step, index) => (
          <div
            key={index}
            className={`transition-all duration-500 transform ${
              activeStep === index
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-20 absolute inset-0"
            }`}
            style={{ display: activeStep === index ? "block" : "none" }}
          >
            {/* Step 1 - Upload Photos */}
            {index === 0 && (
              <div className="flex flex-col md:flex-row items-center gap-12">
                {/* Left side image */}
                <div className="w-full md:w-1/2 flex justify-center perspective">
                  <div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl p-8 w-full max-w-md shadow-lg transform transition-all duration-500 hover:shadow-xl relative group">
                    {/* 3D hover effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-all duration-300"></div>

                    <div className="text-center font-bold text-gray-800 mb-8">
                      Upload images
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Settings panel */}
                      <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-4 w-full md:w-2/5 text-sm transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span>⚙️</span>
                          <span className="text-sm">Upload settings</span>
                        </div>
                        <hr className="border-gray-700 my-2" />

                        <div className="space-y-4 mt-4">
                          <div className="flex items-center justify-between group cursor-pointer">
                            <span className="text-xs group-hover:text-blue-300 transition-colors">
                              Mark as AI Generated
                            </span>
                            <div className="w-10 h-5 bg-gray-700 rounded-full relative p-0.5 transition-colors group-hover:bg-gray-600">
                              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-all group-hover:scale-110"></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between group cursor-pointer">
                            <span className="text-xs group-hover:text-blue-300 transition-colors">
                              Enable max keywords limit
                            </span>
                            <div className="w-10 h-5 bg-blue-500 rounded-full relative p-0.5 transition-colors group-hover:bg-blue-400">
                              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-all group-hover:scale-110"></div>
                            </div>
                          </div>

                          <div className="text-xs text-blue-300">50</div>

                          <div className="flex items-center justify-between group cursor-pointer">
                            <span className="text-xs group-hover:text-blue-300 transition-colors">
                              Enable required keywords
                            </span>
                            <div className="w-10 h-5 bg-gray-700 rounded-full relative p-0.5 transition-colors group-hover:bg-gray-600">
                              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-all group-hover:scale-110"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Upload area */}
                      <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center flex-1 group cursor-pointer transform transition-all duration-300 hover:bg-blue-50/50 perspective">
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full px-4 py-2 text-sm mb-3 transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                          Choose files
                          <span className="ml-2 transition-transform duration-300 inline-block group-hover:rotate-180">
                            ▼
                          </span>
                        </button>

                        <div className="text-xs text-gray-500 mb-4 group-hover:text-gray-700 transition-colors">
                          or drag & drop
                        </div>

                        <div className="flex gap-2 mb-4">
                          <div className="w-5 h-1.5 bg-gray-200 rounded-full group-hover:bg-gray-300 transition-colors"></div>
                          <div className="w-5 h-1.5 bg-gray-200 rounded-full group-hover:bg-gray-300 transition-colors"></div>
                          <div className="w-5 h-1.5 bg-blue-500 rounded-full group-hover:bg-blue-400 transition-colors"></div>
                        </div>

                        <div className="text-xs text-gray-500 text-center group-hover:text-gray-700 transition-colors">
                          Test for Free, No Credit Card Required
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side content */}
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-3 rounded-full shadow-md transform transition-all duration-300 hover:scale-110 hover:shadow-lg">
                      {step.icon}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {step.title}
                    </h2>
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed">
                    {step.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500">
                      Supported formats:
                    </span>
                    {["PNG", "JPEG", "WEBP", "SVG", "MP4", "MOV", "AVI"].map(
                      (format) => (
                        <span
                          key={format}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {format}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 - Review Results */}
            {index === 1 && (
              <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                {/* Right side keywords panel */}
                <div className="w-full md:w-1/2 flex justify-center perspective">
                  <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-3xl p-6 w-full max-w-md shadow-lg transform transition-all duration-500 hover:shadow-xl group">
                    {/* 3D hover effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-all duration-300"></div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-lg font-medium">Keywords ( 29 )</div>
                      <div className="flex gap-3">
                        <Trash2
                          size={16}
                          className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
                        />
                        <Clipboard
                          size={16}
                          className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
                        />
                        <RefreshCw
                          size={16}
                          className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
                        />
                        <ChevronUp
                          size={16}
                          className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
                        />
                      </div>
                    </div>

                    <div className="flex items-center bg-gray-800 rounded-full px-3 py-2 mb-4 focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-300">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 transform transition-all duration-300 hover:scale-110 cursor-pointer">
                        <Plus size={14} />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter comma-separated keywords to add"
                        className="bg-transparent border-none text-white outline-none flex-1 text-sm"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {keywords.map((keyword, idx) => (
                        <div
                          key={keyword}
                          className={`bg-gray-800 hover:bg-gray-700 rounded-full px-3 py-1 text-xs flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                            hoverKeyword === idx
                              ? "ring-1 ring-blue-400 bg-gray-700"
                              : ""
                          }`}
                          onMouseEnter={() => setHoverKeyword(idx)}
                          onMouseLeave={() => setHoverKeyword(null)}
                        >
                          <span>{keyword}</span>
                          <X
                            size={12}
                            className={`text-pink-500 transform transition-all duration-300 ${
                              hoverKeyword === idx ? "scale-125" : ""
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="text-center text-sm mb-3">
                      Result isn't accurate?
                    </div>

                    <button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full py-2.5 px-4 w-full text-sm flex items-center justify-center gap-2 transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
                      <RefreshCw size={16} className="animate-spin-slow" />
                      <span>Generate again</span>
                    </button>
                  </div>
                </div>

                {/* Left side content */}
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white text-gray-900 p-3 rounded-full border-2 border-indigo-500 shadow-md transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:border-indigo-400">
                      {step.icon}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {step.title}
                    </h2>
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed">
                    {step.description}
                  </p>

                  <div className="mt-6 bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Quick Actions:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["Edit Keywords", "Regenerate", "Export", "Save"].map(
                        (action) => (
                          <button
                            key={action}
                            className="px-3 py-1 bg-white text-gray-700 text-sm rounded-md border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors duration-300"
                          >
                            {action}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step Navigation Buttons */}
            <div className="flex justify-between mt-12">
              <button
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                className={`px-4 py-2 rounded-lg border border-gray-300 text-gray-600 flex items-center gap-2 transition-all duration-300 hover:bg-gray-50 ${
                  activeStep === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-gray-400"
                }`}
                disabled={activeStep === 0}
              >
                <span>Previous Step</span>
              </button>

              <button
                onClick={() =>
                  setActiveStep(Math.min(stepsData.length - 1, activeStep + 1))
                }
                className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center gap-2 transition-all duration-300 hover:from-blue-500 hover:to-indigo-500 ${
                  activeStep === stepsData.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={activeStep === stepsData.length - 1}
              >
                <span>Next Step</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add keyframes for animations */}
      <style jsx>{`
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .perspective {
          perspective: 1000px;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default HowDoesItWork;
