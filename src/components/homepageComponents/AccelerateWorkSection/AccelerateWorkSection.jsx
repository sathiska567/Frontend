import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ModernWorkflowSection = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredTag, setHoveredTag] = useState(null);
  const [cardMouse, setCardMouse] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const containerRef = useRef(null);
  const mouseTimeout = useRef(null);

  // Track mouse movement for magnetic effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Optimized mouse tracking with throttling for smooth performance
  const handleCardMouseMove = (e, index) => {
    if (mouseTimeout.current) return;

    mouseTimeout.current = requestAnimationFrame(() => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Reduced intensity for smoother animations
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      setCardMouse((prev) => ({
        ...prev,
        [index]: {
          x: (x / rect.width) * 100,
          y: (y / rect.height) * 100,
          rotateX,
          rotateY,
          centerX: (x - centerX) * 0.05,
          centerY: (y - centerY) * 0.05,
        },
      }));

      mouseTimeout.current = null;
    });
  };

  const handleCardMouseLeave = (index) => {
    setCardMouse((prev) => ({
      ...prev,
      [index]: {
        x: 50,
        y: 50,
        rotateX: 0,
        rotateY: 0,
        centerX: 0,
        centerY: 0,
      },
    }));
  };

  // Images data with their tags (using original paths)
  const allImages = [
    {
      src: "/features/image1.jpeg",
      alt: "A Couple Enjoying the Panoramic View from a Rooftop",
      tags: ["couple", "rooftop", "panoramic", "night", "city view"],
      category: "Lifestyle",
      aiConfidence: 96,
    },
    {
      src: "/features/image2.jpeg",
      alt: "A Castle Suspended in the Sky",
      tags: ["castle", "sky", "fantasy", "architecture", "clouds"],
      category: "Architecture",
      aiConfidence: 94,
    },
    {
      src: "/features/image3.jpeg",
      alt: "Men Working on a Construction Site",
      tags: ["construction", "workers", "site", "elevation", "industry"],
      category: "Industrial",
      aiConfidence: 98,
    },
    {
      src: "/features/image4.jpeg",
      alt: "A Vintage Race Car Parked in a Lot",
      tags: ["vintage", "car", "racing", "classic", "automotive"],
      category: "Automotive",
      aiConfidence: 92,
    },
    {
      src: "/features/image1.jpeg",
      alt: "A Woman Standing Elegantly in Front of a Pool",
      tags: ["woman", "pool", "elegant", "luxury", "vacation"],
      category: "Portrait",
      aiConfidence: 95,
    },
    {
      src: "/features/image2.jpeg",
      alt: "A Ripe Red Strawberry on Dark Background",
      tags: ["strawberry", "fruit", "red", "ripe", "sweet"],
      category: "Food",
      aiConfidence: 99,
    },
    {
      src: "/features/image3.jpeg",
      alt: "Two Monkeys Perched on a Tree Branch",
      tags: ["monkeys", "tree", "branch", "wildlife", "nature"],
      category: "Wildlife",
      aiConfidence: 97,
    },
    {
      src: "/features/image4.jpeg",
      alt: "Two Futuristic Robots Sharing an Umbrella",
      tags: ["robots", "umbrella", "rain", "futuristic", "technology"],
      category: "Technology",
      aiConfidence: 93,
    },
  ];

  // Helper function to get emoji based on tag
  const getEmojiForTag = (tag) => {
    const emojiMap = {
      couple: "👫",
      castle: "🏰",
      construction: "🏗️",
      vintage: "🚗",
      woman: "👩",
      strawberry: "🍓",
      monkeys: "🐒",
      robots: "🤖",
      rooftop: "🏙️",
      sky: "☁️",
      workers: "👷",
      car: "🏎️",
      pool: "🏊",
      fruit: "🍎",
      tree: "🌳",
      umbrella: "☂️",
      night: "🌃",
      fantasy: "✨",
      site: "🔧",
      classic: "🏆",
      elegant: "💃",
      red: "❤️",
      branch: "🌿",
      rain: "🌧️",
    };
    return emojiMap[tag?.toLowerCase()] || "🏷️";
  };

  const getCategoryColor = (category) => {
    const colors = {
      Lifestyle: "from-purple-500 to-pink-500",
      Architecture: "from-blue-500 to-indigo-500",
      Industrial: "from-orange-500 to-red-500",
      Automotive: "from-green-500 to-teal-500",
      Portrait: "from-rose-500 to-pink-500",
      Food: "from-yellow-500 to-orange-500",
      Wildlife: "from-emerald-500 to-green-500",
      Technology: "from-cyan-500 to-blue-500",
    };
    return colors[category] || "from-gray-500 to-gray-600";
  };

  // Optimized particles for enhanced visual appeal with better performance
  const generateParticles = () => {
    return Array.from({ length: 6 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
        animate={{
          x: [Math.random() * 100, Math.random() * 100],
          y: [Math.random() * 100, Math.random() * 100],
          scale: [0, 1, 0],
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 6 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 3,
          ease: "easeInOut",
        }}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
      />
    ));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Optimized floating orbs with reduced complexity */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 rounded-full opacity-8"
            style={{
              background: `radial-gradient(circle, ${
                ["#3B82F6", "#8B5CF6", "#EC4899", "#10B981"][i % 4]
              }, transparent)`,
              left: `${20 + i * 20}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              x: [0, 50, -25, 0],
              y: [0, -50, 25, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 20 + Math.random() * 5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 3,
            }}
          />
        ))}

        {/* Floating particles */}
        {generateParticles()}

        {/* Optimized mouse follower */}
        <motion.div
          className="absolute w-48 h-48 rounded-full pointer-events-none opacity-50"
          style={{
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.03), transparent)`,
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 w-full py-16 px-4 md:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-6 mb-8">
              <motion.div
                className="text-7xl"
                animate={{
                  rotate: [0, 10, -10, 5, 0],
                  scale: [1, 1.1, 1.05, 1.1, 1],
                  y: [0, -10, 5, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.3,
                  rotate: 360,
                  transition: { duration: 0.5 },
                }}
              >
                🚀
              </motion.div>
              <div>
                <motion.h1
                  className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Accelerate Your
                </motion.h1>
                <motion.h2
                  className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  Workflow
                </motion.h2>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <motion.div
              className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/60"
              whileHover={{
                scale: 1.02,
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className="text-4xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ⚡
                </motion.div>
                <p className="text-xl text-gray-700 text-left leading-relaxed">
                  Use AI to completely automate the keywording process for your
                  photos and videos. Embrace technology to enhance your
                  productivity. With AI-based image recognition, ensure accurate
                  and efficient automatic labeling.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Interactive Grid Gallery */}
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {allImages.map((image, index) => {
              const mouse = cardMouse[index] || {
                x: 50,
                y: 50,
                rotateX: 0,
                rotateY: 0,
                centerX: 0,
                centerY: 0,
              };

              return (
                <motion.div
                  key={index}
                  className="relative cursor-pointer group perspective-1000"
                  onClick={() => setSelectedCard(index)}
                  onMouseMove={(e) => handleCardMouseMove(e, index)}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => {
                    handleCardMouseLeave(index);
                    setHoveredCard(null);
                  }}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.1 },
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Enhanced magnetic glow effect */}
                  <motion.div
                    className={`absolute -inset-2 bg-gradient-to-r ${getCategoryColor(
                      image.category
                    )} rounded-3xl blur-xl`}
                    animate={{
                      opacity: hoveredCard === index ? 0.4 : 0,
                      scale: hoveredCard === index ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Interactive spotlight effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
                    }}
                    animate={{
                      opacity: hoveredCard === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  />

                  {/* Main Interactive Card */}
                  <motion.div
                    className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                    animate={{
                      rotateX: hoveredCard === index ? mouse.rotateX : 0,
                      rotateY: hoveredCard === index ? mouse.rotateY : 0,
                      y: hoveredCard === index ? -12 : 0,
                      scale: hoveredCard === index ? 1.03 : 1,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.23, 1, 0.32, 1],
                      type: "tween",
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Optimized Image Container */}
                    <div className="relative h-52 overflow-hidden">
                      <motion.img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        animate={{
                          scale: hoveredCard === index ? 1.1 : 1,
                          x: hoveredCard === index ? mouse.centerX : 0,
                          y: hoveredCard === index ? mouse.centerY : 0,
                        }}
                        transition={{
                          duration: 0.5,
                          ease: [0.23, 1, 0.32, 1],
                          type: "tween",
                        }}
                      />

                      {/* Simplified color overlay */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(
                          image.category
                        )}`}
                        animate={{
                          opacity: hoveredCard === index ? 0.1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />

                      {/* Simplified particles with fewer elements */}
                      <AnimatePresence>
                        {hoveredCard === index && (
                          <div className="absolute inset-0 pointer-events-none">
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                initial={{
                                  opacity: 0,
                                  scale: 0,
                                  x: "50%",
                                  y: "50%",
                                }}
                                animate={{
                                  opacity: [0, 0.8, 0],
                                  scale: [0, 1, 0],
                                  x: `${50 + (Math.random() - 0.5) * 40}%`,
                                  y: `${50 + (Math.random() - 0.5) * 40}%`,
                                }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{
                                  duration: 1.5,
                                  delay: i * 0.2,
                                  ease: "easeOut",
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </AnimatePresence>

                      {/* Simplified category badge */}
                      <motion.div
                        className="absolute top-4 left-4"
                        animate={{
                          scale: hoveredCard === index ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <span
                          className={`bg-gradient-to-r ${getCategoryColor(
                            image.category
                          )} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}
                        >
                          {image.category}
                        </span>
                      </motion.div>

                      {/* Simplified floating indicator */}
                      <motion.div
                        className="absolute top-4 right-4"
                        animate={{
                          scale: hoveredCard === index ? 1.1 : 0,
                          opacity: hoveredCard === index ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <span className="text-lg">✨</span>
                        </div>
                      </motion.div>

                      {/* Optimized interactive overlay */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{
                          opacity: hoveredCard === index ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <motion.div
                          className="bg-white/95 backdrop-blur-md rounded-2xl px-6 py-3 shadow-2xl border border-white/50"
                          animate={{
                            scale: hoveredCard === index ? 1 : 0.9,
                          }}
                          transition={{
                            duration: 0.4,
                            ease: [0.23, 1, 0.32, 1],
                          }}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">👁️</div>
                            <div className="text-sm font-bold text-gray-800">
                              Click to explore
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Optimized Interactive Card Content */}
                    <motion.div
                      className="p-5"
                      animate={{
                        y: hoveredCard === index ? -1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <motion.span
                          className="text-3xl"
                          animate={{
                            rotate:
                              hoveredCard === index
                                ? [0, 8, -8, 0]
                                : [0, 3, -3, 0],
                            scale: hoveredCard === index ? 1.1 : 1,
                          }}
                          transition={{
                            duration: hoveredCard === index ? 0.8 : 3,
                            ease: "easeInOut",
                          }}
                        >
                          {getEmojiForTag(image.tags[0])}
                        </motion.span>
                        <motion.h3
                          className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight"
                          animate={{
                            color:
                              hoveredCard === index ? "#2563EB" : "#111827",
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          {image.alt}
                        </motion.h3>
                      </div>

                      {/* Simplified stats section */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-medium">
                            {image.tags.length} keywords
                          </span>
                          <motion.div
                            className="flex gap-1"
                            animate={{
                              scale: hoveredCard === index ? 1.05 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {[...Array(Math.min(image.tags.length, 3))].map(
                              (_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-1 h-1 bg-blue-400 rounded-full"
                                  animate={{
                                    opacity:
                                      hoveredCard === index
                                        ? [0.5, 1, 0.5]
                                        : 0.5,
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    delay: i * 0.2,
                                    repeat:
                                      hoveredCard === index ? Infinity : 0,
                                    ease: "easeInOut",
                                  }}
                                />
                              )
                            )}
                          </motion.div>
                        </div>

                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-2 h-2 bg-green-500 rounded-full"
                            animate={{
                              scale:
                                hoveredCard === index
                                  ? [1, 1.3, 1]
                                  : [1, 1.1, 1],
                              opacity: [0.7, 1, 0.7],
                            }}
                            transition={{
                              duration: hoveredCard === index ? 1 : 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <span className="text-xs text-green-600 font-bold">
                            {image.aiConfidence}%
                          </span>
                        </div>
                      </div>

                      {/* Simplified progress bar */}
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={`h-2 bg-gradient-to-r ${getCategoryColor(
                              image.category
                            )} rounded-full relative`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${image.aiConfidence}%`,
                            }}
                            transition={{
                              duration: 1.2,
                              delay: index * 0.1,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                          >
                            {/* Simplified shimmer effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              animate={{
                                x:
                                  hoveredCard === index
                                    ? ["-100%", "100%"]
                                    : "-100%",
                              }}
                              transition={{
                                duration: 2,
                                repeat: hoveredCard === index ? Infinity : 0,
                                ease: "linear",
                              }}
                            />
                          </motion.div>
                        </div>

                        {/* Simplified progress indicator */}
                        <motion.div
                          className="absolute -top-1 bg-white rounded-full shadow-md border-2 border-blue-500 w-3 h-3"
                          animate={{
                            left: `${image.aiConfidence}%`,
                            scale: hoveredCard === index ? 1.2 : 1,
                          }}
                          transition={{
                            left: {
                              duration: 1.2,
                              delay: index * 0.1,
                              ease: [0.23, 1, 0.32, 1],
                            },
                            scale: { duration: 0.3, ease: "easeOut" },
                          }}
                          style={{ transform: "translateX(-50%)" }}
                        />
                      </div>
                    </motion.div>

                    {/* Simplified card border effect */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl border border-transparent"
                      animate={{
                        borderColor:
                          hoveredCard === index
                            ? `rgba(59, 130, 246, 0.3)`
                            : "transparent",
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Enhanced Modal */}
        <AnimatePresence>
          {selectedCard !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Enhanced backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setSelectedCard(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* Enhanced Modal Content */}
              <motion.div
                className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-white/20"
                initial={{ scale: 0.7, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.7, opacity: 0, y: 50 }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                  duration: 0.6,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Enhanced Image Section */}
                <div className="relative h-80 overflow-hidden">
                  <motion.img
                    src={allImages[selectedCard].src}
                    alt={allImages[selectedCard].alt}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Animated gradient overlay */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-t ${getCategoryColor(
                      allImages[selectedCard].category
                    )} opacity-10`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ delay: 0.3 }}
                  />

                  {/* Enhanced Category Badge */}
                  <motion.div
                    className="absolute top-6 left-6"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.span
                      className={`bg-gradient-to-r ${getCategoryColor(
                        allImages[selectedCard].category
                      )} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      {allImages[selectedCard].category}
                    </motion.span>
                  </motion.div>

                  {/* Enhanced Close Button */}
                  <motion.button
                    className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-full p-3 hover:bg-white shadow-lg border border-white/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCard(null);
                    }}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{
                      scale: 1.1,
                      rotate: 90,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </motion.button>
                </div>

                {/* Enhanced Content Section */}
                <div className="p-8">
                  <motion.div
                    className="flex items-start gap-4 mb-6"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <motion.span
                      className="text-4xl"
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {getEmojiForTag(allImages[selectedCard].tags[0])}
                    </motion.span>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                        {allImages[selectedCard].alt}
                      </h3>
                      <div className="flex items-center gap-3 text-gray-600">
                        <motion.div
                          className="w-3 h-3 bg-green-500 rounded-full"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                        <span className="font-medium">
                          AI Analyzed • {allImages[selectedCard].tags.length}{" "}
                          keywords detected
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Keywords Section */}
                  <motion.div
                    className="mb-6"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <h4 className="text-lg font-bold text-gray-900 mb-4">
                      Detected Keywords
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {allImages[selectedCard].tags.map((tag, tagIndex) => (
                        <motion.span
                          key={tagIndex}
                          className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-blue-100 text-gray-800 hover:text-blue-800 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border border-gray-200 hover:border-blue-300"
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            delay: 0.7 + tagIndex * 0.05,
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                          }}
                          whileHover={{
                            scale: 1.05,
                            y: -2,
                            boxShadow:
                              "0 5px 15px -5px rgba(59, 130, 246, 0.3)",
                          }}
                          whileTap={{ scale: 0.95 }}
                          onHoverStart={() => setHoveredTag(tagIndex)}
                          onHoverEnd={() => setHoveredTag(null)}
                        >
                          {hoveredTag === tagIndex && (
                            <motion.span
                              className="mr-1"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                            >
                              ✨
                            </motion.span>
                          )}
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Enhanced AI Confidence Badge */}
                  <motion.div
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-6 py-3 rounded-full text-sm font-bold border border-green-200"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 5px 15px -5px rgba(34, 197, 94, 0.3)",
                    }}
                  >
                    <motion.div
                      className="w-3 h-3 bg-green-500 rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                    <span>
                      AI Confidence: {allImages[selectedCard].aiConfidence}%
                    </span>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      🎯
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced CTA Section */}
        <motion.div
          className="max-w-4xl mx-auto text-center mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.div
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/60"
            whileHover={{
              scale: 1.02,
              y: -5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <motion.button
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-5 px-10 rounded-2xl text-xl shadow-2xl transition-all duration-300 relative overflow-hidden"
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <motion.span
                className="relative z-10"
                animate={{
                  textShadow: [
                    "0 0 0px rgba(255,255,255,0)",
                    "0 0 10px rgba(255,255,255,0.3)",
                    "0 0 0px rgba(255,255,255,0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ✨ Start AI Workflow Automation
              </motion.span>

              {/* Animated background shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default ModernWorkflowSection;
