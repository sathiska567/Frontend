import React, { useRef, useEffect, useState } from "react";

const CountUp = ({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  startAnimation,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return; // Only start animation when triggered by scroll

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      setCount(Math.floor(percentage * end));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, startAnimation]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const StatItem = ({ number, label, icon, startAnimation }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-1 sm:mb-2">
        <CountUp end={number} suffix="+" startAnimation={startAnimation} />
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2 text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
        {icon}
        <span>{label}</span>
      </div>
    </div>
  );
};

const DemoAndStat = () => {
  const videoRef = useRef(null);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Ensure video plays automatically
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Autoplay failed:", error);
      });
    }
  }, []);

  // Set up window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set up intersection observer for stats section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
          observer.disconnect(); // Once triggered, no need to observe anymore
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  return (
    <div className="w-screen flex flex-col items-center">
      {/* <div className="bg-rose-600 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-6xl mt-4 sm:mt-6 md:mt-8 lg:mt-10 mb-3 sm:mb-4 md:mb-6 mx-3 sm:mx-4 md:mx-6 lg:mx-8">
        <div className="bg-rose-700 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between space-y-2 sm:space-y-0 text-xs sm:text-sm md:text-base">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="text-yellow-400 flex">★★★★★</div>
            <div className="text-white font-semibold">
              Used by 20,000+ people worldwide
            </div>
          </div>
          <div className="text-white flex items-center space-x-1 sm:space-x-2">
            <span className="text-green-400">✓</span>
            <span>10,000,000+ files already tagged</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-auto"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div> */}

      <div
        ref={statsRef}
        className="bg-blue-700 w-screen py-6 sm:py-8 md:py-10 lg:py-12"
      >
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 px-3 sm:px-4 md:px-6">
          <StatItem
            number={10000000}
            label="Tagged files"
            icon={<span className="text-yellow-300">🏷️</span>}
            startAnimation={statsVisible}
          />
          <StatItem
            number={20000}
            label="Registered members"
            icon={<span>👥</span>}
            startAnimation={statsVisible}
          />
        </div>
      </div>

      {/* Optional debugging info - remove in production */}
      {/* <div className="fixed bottom-0 right-0 bg-black text-white p-2 text-xs">
        Width: {windowWidth}px
      </div> */}
    </div>
  );
};

export default DemoAndStat;
