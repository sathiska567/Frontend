import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { WandSparkles, Star, ChevronUp, Quote } from "lucide-react";

const UserReviewSection = () => {
  const [pausedColumn, setPausedColumn] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeReview, setActiveReview] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Review data
  const reviews = [
    {
      id: 1,
      name: "Galdric",
      title: "Photographer",
      avatar: "G",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-700",
      text: "PhotoTag.ai is the best tool to keyword images I've found. It provides the best results without much effort and at the same time offers a lot of option to tailor how it works.",
      stars: 5,
    },
    {
      id: 2,
      name: "Spamtyta",
      title: "Designer",
      avatar: "S",
      color: "bg-gradient-to-br from-violet-500 to-purple-700",
      text: "It's really cool when support speaks your native language. In my case, it's Ukrainian. Their technical support always responds quickly and provides assistance.",
      stars: 5,
    },
    {
      id: 3,
      name: "Faisal Latif",
      title: "STEPS",
      avatar: "F",
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
      text: "Awesome service. PhotoTag.ai saved so much of my time.",
      stars: 5,
    },
    {
      id: 4,
      name: "Olga",
      title: "Freelancer",
      avatar: "O",
      color: "bg-gradient-to-br from-purple-500 to-purple-700",
      text: "Hello. My name is Olga. I create neuro-illustrations and neuro-photography and sell them on microstock. PhotoTag.ai has saved me countless hours.",
      stars: 5,
    },
    {
      id: 5,
      name: "Photographer",
      title: "Professional",
      avatar: "P",
      color: "bg-gradient-to-br from-pink-500 to-pink-700",
      text: "As a full-time stock photographer, I rely heavily on tools that simplify my workflow, and PhotoTag.ai has been a game-changer for me. The simplicity of this tool stands out - it's clear that a great idea has been transformed into an incredibly useful project.",
      stars: 5,
    },
    {
      id: 6,
      name: "Alex",
      title: "Content Creator",
      avatar: "A",
      color: "bg-gradient-to-br from-amber-500 to-amber-700",
      text: "PhotoTag.ai each photo has unique keywords and titles, which I believe has a greater value when customers searching images. The best thing about PhotoTag.ai for me is that it is constantly improving.",
      stars: 5,
    },
  ];

  // Duplicate reviews to create smoother continuous scroll
  const column1Reviews = [...reviews.slice(0, 2), ...reviews.slice(0, 2)];
  const column2Reviews = [...reviews.slice(2, 4), ...reviews.slice(2, 4)];
  const column3Reviews = [...reviews.slice(4, 6), ...reviews.slice(4, 6)];
  const mobileReviews = [...reviews, ...reviews];

  // Animation config
  const columnConfig = [
    { duration: isMobile ? 25 : 15, delay: 0 },
    { duration: isMobile ? 28 : 18, delay: -5 },
    { duration: isMobile ? 26 : 16, delay: -3 },
  ];

  return (
    <div className="w-full bg-gray-50 overflow-hidden px-4 sm:px-6 lg:px-8 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-200 opacity-20 rounded-full blur-3xl"></div>
      </div>

      {/* Section header */}
      <div className="max-w-7xl mx-auto text-center relative z-10 mb-12 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-3 mt-10 mb-6"
        >
          <div className="w-16 h-16 flex-shrink-0 rounded-full bg-gradient-to-br from-rose-400 to-red-600 flex items-center justify-center shadow-lg shadow-rose-200">
            <span className="text-4xl">❤️</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 mt-4">
            Loved By 20,000+ Creators
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-pink-600 rounded-full mt-4"></div>
        </motion.div>
      </div>

      {/* Reviews container - Conditional rendering based on screen size */}
      <div
        className="max-w-7xl mx-auto perspective relative z-10"
        ref={containerRef}
      >
        <style jsx>{`
          @keyframes scrollUp {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-50%);
            }
          }

          .perspective {
            perspective: 1000px;
          }

          .scroll-container {
            height: 500px;
            overflow: hidden;
            position: relative;
            padding: 0 4px;
          }

          @media (min-width: 640px) {
            .scroll-container {
              height: 550px;
              padding: 0 8px;
            }
          }

          @media (min-width: 768px) {
            .scroll-container {
              height: 600px;
              padding: 0 12px;
            }
          }

          .scroll-content {
            animation: scrollUp var(--duration, 30s) linear infinite;
            animation-delay: var(--delay, 0s);
            animation-play-state: running;
            padding: 4px;
            width: calc(100% - 8px);
          }

          .scroll-content:hover,
          .paused {
            animation-play-state: paused;
          }

          .review-card {
            margin-bottom: 16px;
            transition: all 0.3s ease;
            position: relative;
            border-radius: 16px;
            backdrop-filter: blur(10px);
          }

          @keyframes pulse-border {
            0%,
            100% {
              border-color: rgba(99, 102, 241, 0.3);
            }
            50% {
              border-color: rgba(99, 102, 241, 0.8);
            }
          }

          .review-card-active {
            border: 2px solid rgba(99, 102, 241, 0.6);
            animation: pulse-border 2s infinite;
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .floating-animation {
            animation: float 5s ease-in-out infinite;
          }

          @keyframes shine {
            0% {
              background-position: -100% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }

          .shine-effect {
            position: relative;
            overflow: hidden;
          }

          .shine-effect::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 200%;
            height: 100%;
            background: linear-gradient(
              to right,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.3) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            transform: skewX(-30deg);
            animation: shine 6s infinite;
            background-size: 50% 100%;
          }
        `}</style>

        {isMobile ? (
          // Mobile layout - single column
          <div
            className="scroll-container"
            onMouseEnter={() => setPausedColumn(0)}
            onMouseLeave={() => setPausedColumn(null)}
          >
            <div
              className={`scroll-content ${pausedColumn === 0 ? "paused" : ""}`}
              style={{
                "--duration": `${columnConfig[0].duration}s`,
                "--delay": `${columnConfig[0].delay}s`,
              }}
            >
              {mobileReviews.map((review, index) => (
                <div
                  key={`mobile-${review.id}-${index}`}
                  className={`review-card group bg-white/90 p-5 border border-gray-200 shadow-lg hover:shadow-xl ${
                    activeReview === `mobile-${review.id}-${index}`
                      ? "review-card-active"
                      : ""
                  }`}
                  onMouseEnter={() =>
                    setActiveReview(`mobile-${review.id}-${index}`)
                  }
                  onMouseLeave={() => setActiveReview(null)}
                >
                  <div className="absolute -top-3 left-2 w-10 h-10 text-pink-500 opacity-30 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <Quote size={24} className="transform -scale-x-100" />
                  </div>

                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 ${review.color} text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-md transform transition-transform duration-300 group-hover:scale-110`}
                    >
                      {review.avatar}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-800 text-lg">
                        {review.name}
                      </h4>
                      <p className="text-gray-600 text-sm">{review.title}</p>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(review.stars)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill="#f59e0b"
                          className="text-amber-500"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 relative">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Desktop layout - three columns
          <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Column 1 */}
            <div
              className="scroll-container"
              onMouseEnter={() => setPausedColumn(0)}
              onMouseLeave={() => setPausedColumn(null)}
            >
              <div
                className={`scroll-content ${
                  pausedColumn === 0 ? "paused" : ""
                }`}
                style={{
                  "--duration": `${columnConfig[0].duration}s`,
                  "--delay": `${columnConfig[0].delay}s`,
                }}
              >
                {column1Reviews.map((review, index) => (
                  <div
                    key={`col1-${review.id}-${index}`}
                    className={`review-card group bg-white/90 p-5 border border-gray-200 shadow-lg hover:shadow-xl transform transition-all duration-500 hover:-translate-y-1 ${
                      activeReview === `col1-${review.id}-${index}`
                        ? "review-card-active"
                        : ""
                    }`}
                    onMouseEnter={() =>
                      setActiveReview(`col1-${review.id}-${index}`)
                    }
                    onMouseLeave={() => setActiveReview(null)}
                  >
                    <div className="absolute -top-3 left-2 w-12 h-12 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <Quote size={28} className="transform -scale-x-100" />
                    </div>

                    <div className="flex items-center mb-4">
                      <div
                        className={`w-12 h-12 ${review.color} text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-md transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                      >
                        {review.avatar}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {review.name}
                        </h4>
                        <p className="text-gray-600 text-sm">{review.title}</p>
                      </div>
                      <div className="ml-auto flex">
                        {[...Array(review.stars)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill="#f59e0b"
                            className="text-amber-500"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-700 relative">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 */}
            <div
              className="scroll-container"
              onMouseEnter={() => setPausedColumn(1)}
              onMouseLeave={() => setPausedColumn(null)}
            >
              <div
                className={`scroll-content ${
                  pausedColumn === 1 ? "paused" : ""
                }`}
                style={{
                  "--duration": `${columnConfig[1].duration}s`,
                  "--delay": `${columnConfig[1].delay}s`,
                }}
              >
                {column2Reviews.map((review, index) => (
                  <div
                    key={`col2-${review.id}-${index}`}
                    className={`review-card group bg-white/90 p-5 border border-gray-200 shadow-lg hover:shadow-xl transform transition-all duration-500 hover:-translate-y-1 ${
                      activeReview === `col2-${review.id}-${index}`
                        ? "review-card-active"
                        : ""
                    }`}
                    onMouseEnter={() =>
                      setActiveReview(`col2-${review.id}-${index}`)
                    }
                    onMouseLeave={() => setActiveReview(null)}
                  >
                    <div className="absolute -top-3 left-2 w-10 h-10 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <Quote size={24} className="transform -scale-x-100" />
                    </div>

                    <div className="flex items-center mb-4">
                      <div
                        className={`w-12 h-12 ${review.color} text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-md transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                      >
                        {review.avatar}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {review.name}
                        </h4>
                        <p className="text-gray-600 text-sm">{review.title}</p>
                      </div>
                      <div className="ml-auto flex">
                        {[...Array(review.stars)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill="#f59e0b"
                            className="text-amber-500"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-700 relative">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3 */}
            <div
              className="scroll-container"
              onMouseEnter={() => setPausedColumn(2)}
              onMouseLeave={() => setPausedColumn(null)}
            >
              <div
                className={`scroll-content ${
                  pausedColumn === 2 ? "paused" : ""
                }`}
                style={{
                  "--duration": `${columnConfig[2].duration}s`,
                  "--delay": `${columnConfig[2].delay}s`,
                }}
              >
                {column3Reviews.map((review, index) => (
                  <div
                    key={`col3-${review.id}-${index}`}
                    className={`review-card group bg-white/90 p-5 border border-gray-200 shadow-lg hover:shadow-xl transform transition-all duration-500 hover:-translate-y-1 ${
                      activeReview === `col3-${review.id}-${index}`
                        ? "review-card-active"
                        : ""
                    }`}
                    onMouseEnter={() =>
                      setActiveReview(`col3-${review.id}-${index}`)
                    }
                    onMouseLeave={() => setActiveReview(null)}
                  >
                    <div className="absolute -top-3 left-2 w-10 h-10 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <Quote size={24} className="transform -scale-x-100" />
                    </div>

                    <div className="flex items-center mb-4">
                      <div
                        className={`w-12 h-12 ${review.color} text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-md transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                      >
                        {review.avatar}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {review.name}
                        </h4>
                        <p className="text-gray-600 text-sm">{review.title}</p>
                      </div>
                      <div className="ml-auto flex">
                        {[...Array(review.stars)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill="#f59e0b"
                            className="text-amber-500"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-700 relative">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mt-16 mb-12 relative z-10">
        <div className="relative group perspective-700">
          {/* Main glowing container */}
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-70 blur-md group-hover:opacity-100 transition-all duration-1000 group-hover:blur-lg animate-pulse"></div>

          {/* Button container */}
          <div className="relative overflow-hidden rounded-full shadow-xl">
            {/* Base static gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"></div>

            {/* Animated dark gradient - moves in a loop */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,0,0,0.3), transparent 80%)",
                backgroundSize: "200% 200%",
                animation: "moveBackAndForth 5s ease-in-out infinite alternate",
              }}
            />

            {/* Shine effect */}
            <div className="shine-effect absolute inset-0"></div>

            {/* Button content */}
            <button className="relative z-10 text-white text-xl sm:text-2xl font-bold py-3 px-8 sm:px-12 flex items-center gap-3 bg-transparent">
              <WandSparkles
                className="floating-animation"
                size={isMobile ? 20 : 24}
              />
              <span className="tracking-wide">Try for free</span>
              <ChevronUp className="rotate-90 opacity-80" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReviewSection;
