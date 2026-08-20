import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#121212] px-6 text-[#F7F5F0] overflow-hidden select-none">
      {/* Subtle Luxury Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AD54]/12 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container with Logo, Website Name & Start Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center text-center max-w-sm w-full relative z-10"
      >
        {/* 1. Logo */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full border border-[#D4AD54]/40 flex items-center justify-center p-2.5 shadow-[0_0_35px_rgba(212,173,84,0.2)] bg-gradient-to-b from-[#1E1E1E] to-[#141414]">
            <div className="w-22 h-22 rounded-full border border-[#D4AD54]/75 flex items-center justify-center bg-[#181818]">
              <span className="font-luxury text-4xl font-bold tracking-tight text-[#D4AD54] italic">
                J
              </span>
            </div>
          </div>
          <Sparkles className="absolute -top-1.5 -right-1.5 w-6 h-6 text-[#D4AD54] animate-pulse" />
        </div>

        {/* 2. Website Name */}
        <h1 className="font-luxury text-5xl md:text-6xl font-bold tracking-tight text-[#FFFFFF] drop-shadow-md mb-10">
          jour <span className="text-[#D4AD54]">j</span>
        </h1>

        {/* 3. Start Button (زر ابدأ) */}
        <motion.button
          id="splash-start-btn"
          onClick={onEnter}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group relative w-full max-w-[220px] overflow-hidden rounded-2xl bg-gradient-to-r from-[#D4AD54] via-[#E2BA65] to-[#B88E2D] p-[1px] transition-all duration-300 shadow-[0_8px_24px_rgba(212,173,84,0.3)] hover:shadow-[0_12px_32px_rgba(212,173,84,0.45)]"
        >
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-[#181818] px-8 py-4 transition-colors group-hover:bg-[#141414]">
            <span className="font-luxury text-xl font-bold tracking-wider text-[#D4AD54]">
              ابدأ
            </span>
            <ArrowLeft className="w-5 h-5 text-[#D4AD54] transition-transform duration-300 group-hover:-translate-x-1" />
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
};

