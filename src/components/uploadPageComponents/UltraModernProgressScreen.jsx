import React, { useState, useEffect, useRef, useMemo } from "react";

const UltraModernProgressScreen = ({ progress, isUploading = false }) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [uploadPhase, setUploadPhase] = useState("uploading");
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [energy, setEnergy] = useState(0);
  const [screenSize, setScreenSize] = useState("desktop");
  const [time, setTime] = useState(0);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  // Next-level tips with more personality and emojis
  const uploadingTips = [
    "🌌 Quantum tunneling your pixels through cyberspace dimensions...",
    "🔮 Encrypting data with cosmic algorithms from parallel universes...",
    "⚡ Channeling lightning speed through fiber optic neural networks...",
    "🛸 Your files are surfing gravitational waves across the metaverse...",
    "🌟 Awakening digital spirits in our quantum cloud infrastructure...",
    "🚀 Preparing hyperjump sequence to processing multiverse...",
    "✨ Weaving photons into secure data streams across spacetime...",
    "🎭 Digital alchemists transforming bytes into pure information...",
  ];

  const processingTips = [
    "🧙‍♂️ AI wizards casting neural spells on your visual memories...",
    "🎨 Quantum artists painting metadata masterpieces from pure code...",
    "🔬 Deep learning networks solving pixel mysteries at light speed...",
    "✨ Sprinkling AI stardust to birth SEO constellations...",
    "🌈 Neural paintbrushes creating keyword symphonies in 12 dimensions...",
    "🚀 Launching content into the stratosphere of digital excellence...",
    "🎪 Machine learning circus performing incredible metadata acrobatics...",
    "🔥 Phoenix algorithms rising from data ashes with perfect tags...",
  ];

  // Advanced responsive breakpoint detection with device type
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;

      // Detect device type more accurately
      if (width < 480) {
        setScreenSize("mobile-xs");
      } else if (width < 640) {
        setScreenSize("mobile");
      } else if (width < 768) {
        setScreenSize("mobile-lg");
      } else if (width < 1024) {
        setScreenSize(aspectRatio > 1.3 ? "tablet-landscape" : "tablet");
      } else if (width < 1280) {
        setScreenSize("laptop");
      } else if (width < 1920) {
        setScreenSize("desktop");
      } else {
        setScreenSize("desktop-xl");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Time-based animations
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(Date.now() * 0.001);
    }, 16); // 60fps
    return () => clearInterval(timer);
  }, []);

  // Phase detection based on backend progress data
  useEffect(() => {
    if (progress && progress.processed > 0) {
      setUploadPhase("processing");
    } else if (progress && progress.total > 0) {
      setUploadPhase("uploading");
    } else if (isUploading) {
      setUploadPhase("uploading");
    }
  }, [progress, isUploading]);

  // Use only backend progress data - no simulation
  const displayProgress = progress?.percentage || 0;
  const currentProcessed = progress?.processed || 0;
  const totalFiles = progress?.total || 0;
  const remainingFiles = progress?.remaining || 0;

  const currentTips =
    uploadPhase === "uploading" ? uploadingTips : processingTips;

  // Enhanced mouse tracking with performance optimization
  useEffect(() => {
    if (screenSize.includes("mobile")) return;

    let rafId;
    const handleMouseMove = (e) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
        rafId = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [screenSize]);

  // Dynamic energy calculation
  useEffect(() => {
    const targetEnergy = Math.min(
      100,
      (animatedProgress || 0) + Math.sin(time) * 20 + 20
    );
    setEnergy(targetEnergy);
  }, [animatedProgress, time]);

  // Enhanced tip rotation with smooth transitions
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % currentTips.length);
    }, 4000);
    return () => clearInterval(tipInterval);
  }, [currentTips.length]);

  // Ultra-smooth progress animation with advanced easing
  useEffect(() => {
    const targetProgress = displayProgress;
    const duration = 1500;
    const startTime = Date.now();
    const startProgress = animatedProgress;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);

      // Advanced elastic easing
      const elasticOut = (t) => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0
          ? 0
          : t === 1
          ? 1
          : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
      };

      const easedProgress = elasticOut(progressRatio);
      const currentProgress =
        startProgress + (targetProgress - startProgress) * easedProgress;
      setAnimatedProgress(currentProgress);

      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [displayProgress, animatedProgress]);

  // Ultra-advanced particle system with WebGL-like effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    // High DPI support
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    // Responsive particle configuration
    const getParticleConfig = () => {
      const configs = {
        "mobile-xs": { count: 12, connections: 2, speed: 0.3 },
        mobile: { count: 18, connections: 3, speed: 0.4 },
        "mobile-lg": { count: 25, connections: 4, speed: 0.5 },
        tablet: { count: 40, connections: 6, speed: 0.7 },
        "tablet-landscape": { count: 50, connections: 8, speed: 0.8 },
        laptop: { count: 70, connections: 10, speed: 1.0 },
        desktop: { count: 100, connections: 12, speed: 1.2 },
        "desktop-xl": { count: 150, connections: 15, speed: 1.5 },
      };
      return configs[screenSize] || configs.desktop;
    };

    const config = getParticleConfig();

    // Initialize enhanced particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < config.count; i++) {
        particlesRef.current.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * config.speed,
          vy: (Math.random() - 0.5) * config.speed,
          size: Math.random() * 2 + 0.5,
          color: {
            h: (280 + Math.random() * 80) % 360,
            s: 70 + Math.random() * 30,
            l: 50 + Math.random() * 30,
          },
          life: Math.random() * 100,
          maxLife: 100,
          energy: Math.random(),
          pulse: Math.random() * Math.PI * 2,
        });
      }
    };

    // Advanced particle animation
    const animateParticles = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.globalCompositeOperation = "screen";

      particlesRef.current.forEach((particle, index) => {
        // Update physics
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        particle.pulse += 0.05;
        particle.energy = Math.sin(time + index * 0.1) * 0.5 + 0.5;

        // Boundary conditions with wrapping
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;

        // Respawn with new properties
        if (particle.life <= 0) {
          particle.x = Math.random() * rect.width;
          particle.y = Math.random() * rect.height;
          particle.life = particle.maxLife;
          particle.color.h = (280 + Math.random() * 80) % 360;
        }

        // Advanced rendering
        const alpha = (particle.life / particle.maxLife) * particle.energy;
        const dynamicSize =
          particle.size * (1 + Math.sin(particle.pulse) * 0.3);

        // Particle with glow effect
        ctx.globalAlpha = alpha * 0.8;
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          dynamicSize * 3
        );
        gradient.addColorStop(
          0,
          `hsla(${particle.color.h}, ${particle.color.s}%, ${particle.color.l}%, 1)`
        );
        gradient.addColorStop(
          0.5,
          `hsla(${particle.color.h}, ${particle.color.s}%, ${particle.color.l}%, 0.5)`
        );
        gradient.addColorStop(
          1,
          `hsla(${particle.color.h}, ${particle.color.s}%, ${particle.color.l}%, 0)`
        );

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, dynamicSize, 0, Math.PI * 2);
        ctx.fill();

        // Enhanced connections
        particlesRef.current
          .slice(index + 1, index + 1 + config.connections)
          .forEach((otherParticle) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = screenSize.includes("mobile") ? 60 : 120;

            if (distance < maxDistance) {
              const connectionAlpha =
                (1 - distance / maxDistance) *
                alpha *
                otherParticle.energy *
                0.4;
              ctx.globalAlpha = connectionAlpha;

              const connectionGradient = ctx.createLinearGradient(
                particle.x,
                particle.y,
                otherParticle.x,
                otherParticle.y
              );
              connectionGradient.addColorStop(
                0,
                `hsla(${particle.color.h}, 70%, 60%, ${connectionAlpha})`
              );
              connectionGradient.addColorStop(
                1,
                `hsla(${otherParticle.color.h}, 70%, 60%, ${connectionAlpha})`
              );

              ctx.strokeStyle = connectionGradient;
              ctx.lineWidth = 1 + connectionAlpha * 2;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          });
      });

      ctx.globalCompositeOperation = "source-over";
      animationRef.current = requestAnimationFrame(animateParticles);
    };

    initParticles();
    animateParticles();

    const handleResize = () => {
      const newRect = canvas.getBoundingClientRect();
      canvas.width = newRect.width * dpr;
      canvas.height = newRect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = newRect.width + "px";
      canvas.style.height = newRect.height + "px";
      initParticles();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [screenSize, time]);

  const responsiveStyles = useMemo(() => {
    const styles = {
      "mobile-xs": {
        outerCircleSize: 45, // Outermost progress ring
        circleSize: 35, // Inner decorative ring
        innerCircleSize: 25, // Center circle
        containerSize: "w-40 h-40", // Increased to fit outer ring
        orbCount: 3,
        textSizes: {
          heroTitle: "text-sm",
          heroSubtitle: "text-xs",
          percentage: "text-base",
          fileCount: "text-xs",
        },
        spacing: "space-x-1",
        padding: "p-1",
      },
      mobile: {
        outerCircleSize: 48,
        circleSize: 38,
        innerCircleSize: 28,
        containerSize: "w-44 h-44",
        orbCount: 4,
        textSizes: {
          heroTitle: "text-sm",
          heroSubtitle: "text-xs",
          percentage: "text-lg",
          fileCount: "text-xs",
        },
        spacing: "space-x-1",
        padding: "p-1",
      },
      "mobile-lg": {
        outerCircleSize: 52,
        circleSize: 42,
        innerCircleSize: 32,
        containerSize: "w-48 h-48",
        orbCount: 5,
        textSizes: {
          heroTitle: "text-base",
          heroSubtitle: "text-xs",
          percentage: "text-xl",
          fileCount: "text-xs",
        },
        spacing: "space-x-2",
        padding: "p-2",
      },
      tablet: {
        outerCircleSize: 55,
        circleSize: 45,
        innerCircleSize: 35,
        containerSize: "w-52 h-52",
        orbCount: 6,
        textSizes: {
          heroTitle: "text-lg",
          heroSubtitle: "text-sm",
          percentage: "text-2xl",
          fileCount: "text-sm",
        },
        spacing: "space-x-2",
        padding: "p-2",
      },
      "tablet-landscape": {
        outerCircleSize: 58,
        circleSize: 48,
        innerCircleSize: 38,
        containerSize: "w-56 h-56",
        orbCount: 8,
        textSizes: {
          heroTitle: "text-xl",
          heroSubtitle: "text-sm",
          percentage: "text-3xl",
          fileCount: "text-sm",
        },
        spacing: "space-x-3",
        padding: "p-2",
      },
      laptop: {
        outerCircleSize: 62,
        circleSize: 52,
        innerCircleSize: 42,
        containerSize: "w-60 h-60",
        orbCount: 10,
        textSizes: {
          heroTitle: "text-xl",
          heroSubtitle: "text-base",
          percentage: "text-3xl",
          fileCount: "text-sm",
        },
        spacing: "space-x-3",
        padding: "p-3",
      },
      desktop: {
        outerCircleSize: 65,
        circleSize: 55,
        innerCircleSize: 45,
        containerSize: "w-64 h-64",
        orbCount: 12,
        textSizes: {
          heroTitle: "text-2xl",
          heroSubtitle: "text-base",
          percentage: "text-4xl",
          fileCount: "text-base",
        },
        spacing: "space-x-4",
        padding: "p-3",
      },
      "desktop-xl": {
        outerCircleSize: 68,
        circleSize: 58,
        innerCircleSize: 48,
        containerSize: "w-72 h-72",
        orbCount: 15,
        textSizes: {
          heroTitle: "text-2xl",
          heroSubtitle: "text-lg",
          percentage: "text-5xl",
          fileCount: "text-lg",
        },
        spacing: "space-x-6",
        padding: "p-4",
      },
    };
    return styles[screenSize] || styles.desktop;
  }, [screenSize]);

  const circumference = 2 * Math.PI * responsiveStyles.outerCircleSize;
  const strokeDashoffset =
    circumference - (animatedProgress / 100) * circumference;

  // Calculate dot position to be perfectly synced with progress bar
  const progressAngle = (animatedProgress / 100) * 2 * Math.PI - Math.PI / 2; // Same as progress bar
  const dotX = 100 + responsiveStyles.outerCircleSize * Math.cos(progressAngle);
  const dotY = 100 + responsiveStyles.outerCircleSize * Math.sin(progressAngle);

  // Dynamic background based on mouse position and energy
  const dynamicBackground = useMemo(() => {
    if (screenSize.includes("mobile")) {
      return "radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.4), rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.2)), linear-gradient(135deg, #0f0f23, #1a0933, #2d1b69)";
    }

    return `
      radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
        rgba(236, 72, 153, ${0.3 + energy * 0.002}) 0%, 
        rgba(139, 92, 246, ${0.2 + energy * 0.001}) 35%, 
        rgba(59, 130, 246, ${0.1 + energy * 0.001}) 100%),
      conic-gradient(from ${time * 20}deg at 50% 50%, 
        rgba(236, 72, 153, 0.1), 
        rgba(139, 92, 246, 0.1), 
        rgba(59, 130, 246, 0.1), 
        rgba(236, 72, 153, 0.1)),
      linear-gradient(135deg, #0f0f23, #1a0933, #2d1b69)
    `;
  }, [mousePosition, energy, time, screenSize]);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Ultra-dynamic animated background */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: dynamicBackground }}
      />

      {/* Advanced particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10"
        style={{
          width: "100%",
          height: "100%",
          filter: `blur(${screenSize.includes("mobile") ? "0.5px" : "1px"})`,
        }}
      />

      {/* Floating energy orbs with advanced positioning */}
      <div className="absolute inset-0 z-20 overflow-hidden">
        {[...Array(responsiveStyles.orbCount)].map((_, i) => (
          <div
            key={`energy-orb-${i}`}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${5 + ((i * 7 + Math.sin(time + i)) % 90)}%`,
              top: `${10 + ((i * 11 + Math.cos(time + i * 0.7)) % 80)}%`,
              width: `${
                2 +
                Math.sin(time + i) * 2 +
                (screenSize.includes("mobile") ? 0 : 2)
              }px`,
              height: `${
                2 +
                Math.sin(time + i) * 2 +
                (screenSize.includes("mobile") ? 0 : 2)
              }px`,
              background: `radial-gradient(circle, 
                hsla(${(300 + i * 20 + time * 10) % 360}, 80%, 60%, 0.8), 
                transparent 70%)`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + i * 0.3}s`,
              filter: `blur(${
                screenSize.includes("mobile") ? "0.5px" : "1px"
              })`,
              transform: `scale(${1 + Math.sin(time + i) * 0.3})`,
            }}
          />
        ))}
      </div>

      {/* Main content with perfect centering */}
      <div
        className={`relative z-30 flex items-center justify-center min-h-screen py-2 px-1`}
      >
        <div className="text-center w-full max-w-3xl mx-auto">
          {/* Ultra-modern progress indicator */}
          <div
            className={`relative mb-3 ${responsiveStyles.containerSize} mx-auto`}
          >
            {/* Outer energy field with advanced animations */}
            <div
              className="absolute inset-0 rounded-full opacity-60"
              style={{
                background: `conic-gradient(from ${time * 50}deg, 
                  transparent, 
                  rgba(236, 72, 153, 0.6), 
                  rgba(139, 92, 246, 0.6), 
                  rgba(59, 130, 246, 0.6), 
                  transparent)`,
                transform: `scale(${1.3 + energy * 0.005}) rotate(${
                  time * 30
                }deg)`,
                filter: `blur(${
                  screenSize.includes("mobile") ? "6px" : "16px"
                })`,
              }}
            />

            {/* Multiple rotating rings */}
            {[1.2, 1.1, 1.05].map((scale, index) => (
              <div
                key={`ring-${index}`}
                className="absolute inset-0 rounded-full border opacity-20"
                style={{
                  borderWidth: `${screenSize.includes("mobile") ? 1 : 2}px`,
                  borderImage: `conic-gradient(from ${
                    time * (30 + index * 20)
                  }deg, 
                    transparent, 
                    #ec4899, 
                    #8b5cf6, 
                    #3b82f6, 
                    transparent) 1`,
                  transform: `scale(${scale}) rotate(${
                    time * (20 + index * 10)
                  }deg)`,
                }}
              />
            ))}

            {/* Main glassmorphism container */}
            <div className="absolute inset-2 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl">
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/5" />

              {/* Enhanced SVG Progress - Outermost Ring Design */}
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Background circles with gradients */}
                <defs>
                  <linearGradient
                    id="bgGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                  </linearGradient>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      stopColor={currentProcessed > 0 ? "#8338ec" : "#ff006e"}
                    >
                      <animate
                        attributeName="stop-color"
                        values={
                          currentProcessed > 0
                            ? "#8338ec;#3a86ff;#8338ec"
                            : "#ff006e;#ff4081;#ff006e"
                        }
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </stop>
                    <stop
                      offset="50%"
                      stopColor={currentProcessed > 0 ? "#3a86ff" : "#ff4081"}
                    >
                      <animate
                        attributeName="stop-color"
                        values={
                          currentProcessed > 0
                            ? "#3a86ff;#8338ec;#3a86ff"
                            : "#ff4081;#ff006e;#ff4081"
                        }
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </stop>
                    <stop
                      offset="100%"
                      stopColor={currentProcessed > 0 ? "#8338ec" : "#ff006e"}
                    >
                      <animate
                        attributeName="stop-color"
                        values={
                          currentProcessed > 0
                            ? "#8338ec;#3a86ff;#8338ec"
                            : "#ff006e;#ff4081;#ff006e"
                        }
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </stop>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Outermost background ring - static */}
                <circle
                  cx="100"
                  cy="100"
                  r={responsiveStyles.outerCircleSize}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="10"
                  fill="none"
                  opacity="0.3"
                />

                {/* Middle decorative ring */}
                <circle
                  cx="100"
                  cy="100"
                  r={responsiveStyles.circleSize}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.5"
                />

                {/* Inner background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r={responsiveStyles.innerCircleSize}
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="1"
                  fill="rgba(255,255,255,0.02)"
                />

                {/* MAIN OUTERMOST PROGRESS RING - The biggest one */}
                <circle
                  cx="100"
                  cy="100"
                  r={responsiveStyles.outerCircleSize}
                  stroke="url(#progressGradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-[1500ms] ease-out"
                  transform="rotate(-90 100 100)"
                  filter="url(#glow)"
                />

                {/* Glowing outermost ring effect */}
                <circle
                  cx="100"
                  cy="100"
                  r={responsiveStyles.outerCircleSize}
                  stroke="url(#progressGradient)"
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-[1500ms] ease-out opacity-25"
                  transform="rotate(-90 100 100)"
                  filter="blur(6px)"
                />

                {/* Progress end indicator - marks the exact end of progress */}
                {displayProgress > 2 && (
                  <circle
                    cx={dotX}
                    cy={dotY}
                    r="12"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="2"
                    className="opacity-40"
                  >
                    <animate
                      attributeName="r"
                      values="10;16;10"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.2;0.6;0.2"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Animated progress indicator dot on outermost ring - perfectly synced */}
                {displayProgress > 0 && (
                  <circle
                    cx={dotX}
                    cy={dotY}
                    r="8"
                    fill="url(#progressGradient)"
                    className="drop-shadow-xl transition-all duration-[1500ms] ease-out"
                    filter="url(#glow)"
                  >
                    <animate
                      attributeName="r"
                      values="6;10;6"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Center decorative elements */}
                <circle
                  cx="100"
                  cy="100"
                  r="4"
                  fill="rgba(255,255,255,0.6)"
                  opacity="0.8"
                >
                  <animate
                    attributeName="r"
                    values="3;6;3"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.6;1;0.6"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Inner pulsing ring */}
                <circle
                  cx="100"
                  cy="100"
                  r={responsiveStyles.innerCircleSize - 5}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    values={`${responsiveStyles.innerCircleSize - 8};${
                      responsiveStyles.innerCircleSize - 2
                    };${responsiveStyles.innerCircleSize - 8}`}
                    dur="4s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.3;0.8;0.3"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-2">
                  {displayProgress === 0 && isUploading ? (
                    <div className="text-white">
                      {/* Ultra-modern spinner */}
                      <div
                        className={`relative ${
                          screenSize.includes("mobile") ? "w-6 h-6" : "w-8 h-8"
                        } mx-auto mb-1`}
                      >
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={`spinner-${i}`}
                            className="absolute inset-0 border-2 border-transparent rounded-full"
                            style={{
                              borderTopColor: `hsl(${280 + i * 40}, 80%, 60%)`,
                              borderRightColor: `hsl(${
                                280 + i * 40
                              }, 80%, 60%)`,
                              animation: `spin ${
                                2 + i * 0.5
                              }s linear infinite ${i * 0.2}s`,
                              transform: `scale(${1 - i * 0.1})`,
                            }}
                          />
                        ))}
                        <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                      </div>
                      <div
                        className={`${responsiveStyles.textSizes.fileCount} font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent mb-1`}
                      >
                        INITIALIZING...
                      </div>
                      <div className="text-xs text-white/70 animate-pulse">
                        Starting Upload Process
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`${responsiveStyles.textSizes.percentage} font-black mb-1`}
                      >
                        <span className="bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent filter drop-shadow-2xl">
                          {Math.round(displayProgress)}
                        </span>
                        <span
                          className={`${
                            screenSize.includes("mobile")
                              ? "text-sm"
                              : "text-base"
                          } text-white/60`}
                        >
                          %
                        </span>
                      </div>
                      <div
                        className={`${responsiveStyles.textSizes.fileCount} text-white/90 font-semibold mb-1`}
                      >
                        {currentProcessed > 0
                          ? `${currentProcessed} of ${totalFiles} processed`
                          : `Processing ${totalFiles} files`}
                      </div>
                      <div className="text-xs text-white/70 mb-1">
                        {currentProcessed > 0
                          ? "🎨 AI Processing"
                          : "📤 Upload Phase"}
                      </div>
                      {/* Enhanced mini progress bar */}
                      <div
                        className={`${
                          screenSize.includes("mobile")
                            ? "w-12 h-1"
                            : "w-16 h-1"
                        } bg-white/10 rounded-full mx-auto overflow-hidden relative`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-1000 relative overflow-hidden ${
                            currentProcessed > 0
                              ? "bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400"
                              : "bg-gradient-to-r from-pink-400 via-red-400 to-pink-500"
                          }`}
                          style={{ width: `${displayProgress}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/40 animate-shimmer" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Epic title section with dynamic effects */}
          <div className="mb-3">
            <h1
              className={`${responsiveStyles.textSizes.heroTitle} font-black mb-1 tracking-wide`}
            >
              <span
                className="bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent filter drop-shadow-2xl"
                style={{
                  textShadow: `0 0 ${
                    screenSize.includes("mobile") ? "20px" : "40px"
                  } rgba(236, 72, 153, 0.5)`,
                }}
              >
                {uploadPhase === "uploading"
                  ? `🚀 ${
                      screenSize.includes("mobile")
                        ? "QUANTUM"
                        : "QUANTUM TRANSPORT"
                    }`
                  : `🎨 ${
                      screenSize.includes("mobile")
                        ? "AI FORGE"
                        : "AI METAMORPHOSIS"
                    }`}
              </span>
            </h1>
            <p
              className={`${responsiveStyles.textSizes.heroSubtitle} text-white/80 font-light tracking-wider px-1`}
            >
              {uploadPhase === "uploading"
                ? screenSize.includes("mobile")
                  ? "Hyperspeed data tunneling"
                  : "Transcending reality through quantum data tunneling"
                : screenSize.includes("mobile")
                ? "AI crafting digital magic"
                : "Neural architects crafting digital poetry from pure data"}
            </p>
          </div>

          {/* Enhanced progress bar with wave effect */}
          <div className="mb-4 px-2">
            <div
              className={`relative w-full ${
                screenSize.includes("mobile") ? "h-2" : "h-3"
              } bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

              <div
                className="h-full relative overflow-hidden transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${displayProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 animate-wave" />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  style={{
                    animation: `slide 3s infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              </div>
            </div>

            <div
              className={`flex justify-between ${responsiveStyles.textSizes.fileCount} text-white/70 mt-1 font-semibold`}
            >
              <span className="flex items-center">
                <div
                  className={`${
                    screenSize.includes("mobile") ? "w-2 h-2" : "w-3 h-3"
                  } bg-pink-400 rounded-full mr-2 animate-pulse`}
                />
                {uploadPhase === "uploading" ? "LAUNCHING" : "FORGING"}
              </span>
              <span className="flex items-center">
                <div
                  className={`${
                    screenSize.includes("mobile") ? "w-2 h-2" : "w-3 h-3"
                  } bg-green-400 rounded-full mr-2 animate-pulse`}
                />
                COMPLETION
              </span>
            </div>
          </div>

          {/* Enhanced tip section with glassmorphism */}
          <div className="bg-black/10 backdrop-blur-3xl border border-white/10 rounded-xl p-2 mb-4 shadow-2xl mx-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-1">
                <div
                  className={`${
                    screenSize.includes("mobile") ? "w-5 h-5" : "w-6 h-6"
                  } bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-2`}
                >
                  <span
                    className={`text-white ${
                      screenSize.includes("mobile") ? "text-sm" : "text-lg"
                    }`}
                  >
                    {uploadPhase === "uploading" ? "🌌" : "🔮"}
                  </span>
                </div>
                <span
                  className={`${responsiveStyles.textSizes.fileCount} font-bold text-white`}
                >
                  {uploadPhase === "uploading"
                    ? `🚀 ${
                        screenSize.includes("mobile")
                          ? "STATUS"
                          : "COSMIC STATUS"
                      }`
                    : `🧠 ${
                        screenSize.includes("mobile")
                          ? "AI MIND"
                          : "NEURAL CORTEX"
                      }`}
                </span>
              </div>
              <p
                key={`${uploadPhase}-${currentTip}`}
                className={`${responsiveStyles.textSizes.fileCount} text-white/90 text-center leading-relaxed animate-fade-in font-medium px-1`}
                style={{
                  animation: "fadeSlideIn 0.8s ease-out",
                }}
              >
                {screenSize.includes("mobile") &&
                currentTips[currentTip].length > 70
                  ? currentTips[currentTip].substring(0, 67) + "..."
                  : currentTips[currentTip]}
              </p>
            </div>
          </div>

          {/* Enhanced stats grid */}
          <div className="grid grid-cols-3 gap-1 mb-4 px-1">
            {[
              {
                label: "Total Files",
                value: totalFiles,
                gradient: "from-pink-500 to-rose-500",
                icon: "📸",
                shadow: "shadow-pink-500/50",
              },
              {
                label: "Processed",
                value: currentProcessed,
                gradient: "from-green-500 to-emerald-500",
                icon: "✅",
                shadow: "shadow-green-500/50",
              },
              {
                label: "Remaining",
                value: remainingFiles,
                gradient: "from-blue-500 to-cyan-500",
                icon: "🔄",
                shadow: "shadow-blue-500/50",
              },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`bg-black/20 backdrop-blur-3xl border border-white/10 rounded-lg p-2 ${stat.shadow} shadow-xl transform transition-all duration-700 hover:scale-105 hover:-translate-y-1 relative overflow-hidden`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <div className="relative z-10">
                  <div
                    className={`${
                      screenSize.includes("mobile") ? "text-xs" : "text-sm"
                    } mb-1`}
                  >
                    {stat.icon}
                  </div>
                  <div
                    className={`${
                      screenSize.includes("mobile") ? "text-base" : "text-lg"
                    } font-black bg-gradient-to-r ${
                      stat.gradient
                    } bg-clip-text text-transparent filter drop-shadow-lg`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/80 font-semibold mt-1">
                    {screenSize.includes("mobile")
                      ? stat.label.split(" ")[0]
                      : stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Epic floating action icons */}
          <div
            className={`flex justify-center ${responsiveStyles.spacing} px-1`}
          >
            {(uploadPhase === "uploading"
              ? [
                  {
                    icon: "🚀",
                    name: "LAUNCH",
                    color: "from-red-400 to-pink-400",
                  },
                  {
                    icon: "⚡",
                    name: "POWER",
                    color: "from-yellow-400 to-orange-400",
                  },
                  {
                    icon: "🔒",
                    name: "SECURE",
                    color: "from-green-400 to-emerald-400",
                  },
                  {
                    icon: "🌐",
                    name: "GLOBAL",
                    color: "from-blue-400 to-cyan-400",
                  },
                ]
              : [
                  {
                    icon: "🧠",
                    name: "THINK",
                    color: "from-purple-400 to-pink-400",
                  },
                  {
                    icon: "🎨",
                    name: "CREATE",
                    color: "from-pink-400 to-rose-400",
                  },
                  {
                    icon: "✨",
                    name: "MAGIC",
                    color: "from-yellow-400 to-amber-400",
                  },
                  {
                    icon: "🚀",
                    name: "LAUNCH",
                    color: "from-blue-400 to-indigo-400",
                  },
                ]
            ).map((item, index) => (
              <div
                key={item.name}
                className="flex flex-col items-center transform transition-all duration-700 hover:scale-125 cursor-pointer"
                style={{
                  animation: `float 3s ease-in-out infinite ${index * 0.5}s`,
                }}
              >
                <div
                  className={`${
                    screenSize.includes("mobile") ? "text-base" : "text-lg"
                  } mb-1 filter drop-shadow-2xl`}
                >
                  {item.icon}
                </div>
                <div
                  className={`text-xs font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent tracking-wider`}
                >
                  {screenSize.includes("mobile") && item.name.length > 6
                    ? item.name.substring(0, 5)
                    : item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-200%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes wave {
          0%,
          100% {
            transform: translateX(-100%) scaleY(1);
          }
          50% {
            transform: translateX(100%) scaleY(1.2);
          }
        }

        @keyframes slide {
          0% {
            transform: translateX(-200%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-shimmer {
          animation: shimmer 4s infinite;
        }
        .animate-wave {
          animation: wave 6s infinite;
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UltraModernProgressScreen;
