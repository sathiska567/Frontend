import React from "react";
import FeatureItem from "./FeatureItem";
import { features } from "./featuresData";

const FeaturesSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden py-24 px-4 md:px-8 lg:px-16">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

        {/* Animated gradient blobs */}
        <div className="absolute top-0 -left-64 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 -right-64 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

        {/* Subtle horizontal line */}
        <div className="absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        <div className="absolute bottom-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading with decorative elements */}
        <div className="text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <span className="inline-block text-blue-400 text-sm font-bold tracking-widest uppercase mb-3">
            Innovative Solutions
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Features
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Our cutting-edge tools empower your workflow with intelligent
            automation and seamless user experience.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Features list with increased spacing for dramatic effect */}
        <div className="space-y-32">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              image={feature.image}
              reverse={index % 2 === 1}
            />
          ))}
        </div>

        {/* Enhanced CTA button */}
        <div className="mt-24 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="relative inline-block">
            <button className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold py-5 px-10 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transform transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(8,112,184,0.5)] z-10">
              <span className="relative z-10 text-lg">Try for free</span>

              {/* Glass highlight */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Animated shine effect */}
              <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform transition-all duration-1000 group-hover:left-full"></div>
            </button>

            {/* Button reflection */}
            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-b from-blue-600/50 to-transparent blur-sm transform scale-x-75 opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
