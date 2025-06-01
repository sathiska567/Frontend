import React, { useState, useEffect, useRef } from "react";
// Import the videos
import cakeVideo from "../../../assets/Videos/cake.webm";
import carVideo from "../../../assets/Videos/car.webm";
import catVideo from "../../../assets/Videos/cat.webm";
import womanVideo from "../../../assets/Videos/woman.webm";

// Videos data with labels and colors
const videos = [
  {
    src: cakeVideo,
    label: "Food Photography",
    color: "from-amber-400 to-orange-600",
  },
  {
    src: carVideo,
    label: "Automotive Content",
    color: "from-blue-400 to-indigo-600",
  },
  {
    src: catVideo,
    label: "Animal Photography",
    color: "from-green-400 to-emerald-600",
  },
  {
    src: womanVideo,
    label: "Portrait Photography",
    color: "from-pink-400 to-rose-600",
  },
];

const HeaderSection = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [prevVideo, setPrevVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const videoRefs = useRef(videos.map(() => React.createRef()));
  const progressRef = useRef(null);
  const progressInterval = useRef(null);
  const [progress, setProgress] = useState(0);

  // Handle video transitions
  useEffect(() => {
    if (!isHovering) {
      // Reset progress
      setProgress(0);

      // Create progress animation
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 100 / 80; // Completes in 8 seconds
        });
      }, 100);

      // Change video when progress completes
      const videoTimer = setTimeout(() => {
        setPrevVideo(currentVideo);
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentVideo((prev) => (prev + 1) % videos.length);
          setIsTransitioning(false);
        }, 500);
      }, 8000);

      return () => {
        clearTimeout(videoTimer);
        clearInterval(progressInterval.current);
      };
    } else {
      // Pause progress when hovering
      clearInterval(progressInterval.current);
    }
  }, [currentVideo, isHovering]);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // Handle manual navigation
  const goToVideo = (index) => {
    if (index === currentVideo) return;
    clearInterval(progressInterval.current);
    setProgress(0);
    setPrevVideo(currentVideo);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentVideo(index);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-[90vh] flex items-center py-16">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[70vw] h-[70vw] -top-[35vw] -right-[35vw] bg-gradient-to-b from-fuchsia-50 to-indigo-50 rounded-full opacity-60 blur-3xl"></div>
        <div className="absolute w-[50vw] h-[50vw] -bottom-[25vw] -left-[25vw] bg-gradient-to-t from-rose-50 to-amber-50 rounded-full opacity-60 blur-3xl"></div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 bg-grid-pattern opacity-[0.02]"
          style={{
            backgroundSize: "30px 30px",
            backgroundImage:
              "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
          }}
        ></div>
      </div>


      <div className="relative flex flex-col lg:flex-row-reverse items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-12 lg:gap-16 z-10">
        {/* Right Section - Content */}
        <div className="w-full lg:w-1/2 pt-16 lg:pt-0">
          <div className="relative">
            {/* Floating badge */}
            <div className="absolute -top-12 -right-6 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 backdrop-blur-md rounded-2xl p-3 shadow-xl rotate-6 transform hover:rotate-0 transition-all duration-300 border border-indigo-100 group">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:from-indigo-600 group-hover:to-violet-600 transition-all duration-500">
                  AI-POWERED
                </span>
              </div>
            </div>

            {/* Main heading with animated gradient */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="inline-block mb-1">Keyword Generation</span>
              <br />
              <span className="inline-block relative">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x bg-[length:200%_auto]">
                  for Stock Photos
                </span>
                <span className="absolute top-0 left-0 w-full h-full bg-pink-200/30 blur-xl -z-10 animate-pulse"></span>
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl font-medium text-slate-700 max-w-xl">
              Automatically generate tags, titles, and descriptions for your
              photos using AI and{" "}
              <span className="text-indigo-600 font-semibold">
                save hours of time
              </span>
              .
            </p>

            <p className="mt-3 text-base text-slate-600 max-w-xl">
              Easily export files with metadata added or integrate with stock
              platforms.
            </p>

            {/* Features Cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              {[
                "Generate keywords, titles, and descriptions",
                "Export files with metadata embedded",
                "download metadata in CSV format",
                "Perfect for stock photography",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group flex items-start p-3 rounded-xl backdrop-blur-sm bg-white/30 border border-slate-200/50 hover:bg-white/80 hover:border-indigo-200/50 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex-shrink-0 h-6 w-6 mr-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 group-hover:from-indigo-600 group-hover:to-pink-600 flex items-center justify-center text-white shadow-md transition-all duration-500 group-hover:scale-110">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <span className="text-slate-700 group-hover:text-slate-900 text-sm sm:text-base font-medium transition-colors duration-200">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Call-to-Action Section */}
            <div className="mt-10 flex flex-col sm:flex-row gap-5 items-center">
              <button className="w-full sm:w-auto relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse-slow"></div>
                <div className="relative flex items-center justify-center py-3.5 px-8 bg-white rounded-xl leading-none">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-indigo-600">
                      Try it now for free
                    </span>
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 border-2 border-white z-30"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-700 border-2 border-white z-20"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-700 border-2 border-white z-10"></div>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border-2 border-white text-white text-xs font-bold">
                    +17k
                  </div>
                </div>
                <span className="text-slate-600 text-sm">
                  Used by 20,000+ creators
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Left Section - Video Showcase */}
        <div
          className="w-full lg:w-1/2 relative z-10"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="relative perspective">
            {/* Main video display with 3D effect */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-500 hover:rotate-y-3 hover:-rotate-2 hover:shadow-[0_35px_60px_-15px_rgba(79,70,229,0.3)]">
              {/* Video container with floating elements */}
              <div className="relative aspect-[3/2] bg-black">
                {/* Video overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40 z-20 pointer-events-none"></div>

                {/* Current video with fade transition */}
                <div
                  className={`absolute inset-0 transition-opacity duration-1000 ${isTransitioning ? "opacity-0" : "opacity-100"
                    }`}
                >
                  <video
                    ref={videoRefs.current[currentVideo]}
                    key={videos[currentVideo].src}
                    src={videos[currentVideo].src}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Previous video fading out */}
                <div
                  className={`absolute inset-0 transition-opacity duration-1000 ${isTransitioning ? "opacity-100" : "opacity-0"
                    }`}
                >
                  <video
                    ref={videoRefs.current[prevVideo]}
                    src={videos[prevVideo].src}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating UI elements */}
                <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md rounded-lg px-2.5 py-1.5 text-white text-xs font-semibold z-30 flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  LIVE PREVIEW
                </div>

                <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md rounded-lg p-1.5 text-white z-30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                    />
                  </svg>
                </div>

                {/* Video info panel */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-16 pb-4 px-5 z-30">
                  <div className="flex justify-between items-end">
                    <div>
                      <p
                        className={`text-xl font-bold text-white transition-all duration-500 ${isTransitioning
                            ? "opacity-0 translate-y-4"
                            : "opacity-100 translate-y-0"
                          }`}
                      >
                        {videos[currentVideo].label}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <div
                          className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${videos[currentVideo].color
                            } transition-all duration-500 ${isTransitioning
                              ? "opacity-0 translate-y-4"
                              : "opacity-100 translate-y-0"
                            }`}
                          style={{ transitionDelay: "100ms" }}
                        >
                          Easily Tagged
                        </div>
                        <div
                          className={`px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm transition-all duration-500 ${isTransitioning
                              ? "opacity-0 translate-y-4"
                              : "opacity-100 translate-y-0"
                            }`}
                          style={{ transitionDelay: "150ms" }}
                        >
                          AI-Optimized
                        </div>
                      </div>
                    </div>

                    <div className="text-white flex items-center gap-1.5 opacity-80">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                      <span className="text-xs">01:03</span>
                    </div>
                  </div>

                  {/* Video progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 z-40">
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div
                      ref={progressRef}
                      className={`h-full bg-gradient-to-r ${videos[currentVideo].color} transition-all duration-300`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video thumbnails navigation */}
            <div className="flex justify-center mt-6 gap-3">
              {videos.map((video, index) => (
                <button
                  key={index}
                  onClick={() => goToVideo(index)}
                  className={`relative group overflow-hidden rounded-lg transition-all duration-300 ${currentVideo === index
                      ? "ring-2 ring-offset-2 ring-indigo-500 scale-110 z-20"
                      : "opacity-80 hover:opacity-100 ring-1 ring-slate-200 hover:ring-indigo-300 hover:scale-105"
                    }`}
                >
                  <div className="w-20 h-14 sm:w-24 sm:h-16 overflow-hidden bg-slate-800">
                    {/* Thumbnail preview */}
                    <div className="w-full h-full">
                      <video
                        src={video.src}
                        muted
                        loop
                        playsInline
                        autoPlay
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Overlay with label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 transition-opacity duration-300`}
                    ></div>
                    <span
                      className={`relative z-10 text-xs font-medium text-white px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm ${currentVideo === index
                          ? "bg-gradient-to-r " + video.color
                          : ""
                        }`}
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* Active indicator */}
                  {currentVideo === index && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Floating tag elements */}
            <div className="absolute -top-12 -left-8 px-4 py-2 bg-white rounded-full shadow-lg transform rotate-12 animate-float z-20">
              <span className="text-sm font-semibold text-indigo-600">
                #food
              </span>
            </div>
            <div className="absolute -bottom-10 -right-6 px-4 py-2 bg-white rounded-full shadow-lg transform -rotate-6 animate-float-delay z-20">
              <span className="text-sm font-semibold text-rose-600">
                #travel
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(12deg);
          }
          50% {
            transform: translateY(-15px) rotate(10deg);
          }
        }

        @keyframes float-delay {
          0%,
          100% {
            transform: translateY(0) rotate(-6deg);
          }
          50% {
            transform: translateY(-12px) rotate(-8deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float-delay 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-gradient-x {
          animation: gradient-x 8s ease infinite;
        }

        .perspective {
          perspective: 1000px;
        }

        .rotate-y-3:hover {
          transform: rotateY(3deg) rotate(-2deg);
        }
      `}</style>
    </div>
  );
};

export default HeaderSection;
