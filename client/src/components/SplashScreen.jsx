// src/components/SplashScreen.jsx
import React from "react";

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0f172a] text-white overflow-hidden z-50">
      <div className="absolute text-[16vw] font-bold text-white/5 animate-pulse select-none">
        NoteVerse
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <svg
          className="animate-spin h-10 w-10 text-blue-500 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <p className="text-sm text-gray-300 animate-pulse">Loading your space...</p>
      </div>
    </div>
  );
};

export default SplashScreen;
