// src/components/SplashScreen.jsx
import React from 'react';

export default function SplashScreen() {
  return (
    <div className={`
      min-h-screen flex flex-col items-center justify-center
      bg-white dark:bg-black
      text-gray-900 dark:text-gray-100
      transition-colors duration-300
    `}>
      {/* Main Title with animation */}
      <div className="text-center px-4">
        <h1 className={`
          text-5xl sm:text-6xl md:text-8xl lg:text-9xl
          font-black tracking-[-0.04em]
          text-black dark:text-white
          animate-fade-in-scale
        `}>
          3D Printer Hub
        </h1>
      </div>

      {/* Loading Spinner with animation */}
      <div className="mt-16">
        <div className={`
          w-16 h-16 md:w-20 md:h-20
          border-4 border-gray-300 dark:border-gray-700
          border-t-black dark:border-t-white
          rounded-full 
          animate-spin
        `}></div>
      </div>

      {/* Optional small loading text with fade */}
      <p className={`
        mt-10 text-sm md:text-base
        text-gray-500 dark:text-gray-600
        animate-fade-in
        animation-delay-500
      `}>
        Loading...
      </p>

      {/* Tailwind animation classes */}
      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.92);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .animate-fade-in-scale {
          animation: fadeInScale 1.2s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </div>
  );
}