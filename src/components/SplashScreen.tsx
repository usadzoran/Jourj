import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#121212] px-6 py-12 text-[#F7F5F0] overflow-hidden select-none">
      {/* Subtle Luxury Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AD54]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#D4AD54]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Brand Tagline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center pt-6"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-[#D4AD54] font-medium border border-[#D4AD54]/30 px-4 py-1.5 rounded-full bg-[#171717]/80 backdrop-blur-sm shadow-sm">
          الجزائر • وهران
        </span>
      </motion.div>

      {/* Center Luxury Emblem & Name */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="flex flex-col items-center text-center max-w-sm"
      >
        {/* Gold Diamond Ring Monogram */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border border-[#D4AD54]/40 flex items-center justify-center p-2 shadow-[0_0_25px_rgba(212,173,84,0.15)] bg-gradient-to-b from-[#1C1C1C] to-[#141414]">
            <div className="w-20 h-20 rounded-full border border-[#D4AD54]/70 flex items-center justify-center">
              <span className="font-luxury text-3xl font-bold tracking-tight text-[#D4AD54] italic">
                J
              </span>
            </div>
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-[#D4AD54] animate-pulse" />
        </div>

        {/* Brand Name */}
        <h1 className="font-luxury text-5xl md:text-6xl font-bold tracking-tight text-[#FFFFFF] drop-shadow-md">
          jour <span className="text-[#D4AD54]">j</span>
        </h1>

        {/* Golden Separator Line */}
        <div className="flex items-center justify-center w-48 my-4 gap-2">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AD54] to-transparent" />
          <div className="w-2 h-2 rotate-45 border border-[#D4AD54] bg-[#121212]" />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AD54] to-transparent" />
        </div>

        {/* Slogan */}
        <p className="font-luxury text-lg md:text-xl text-[#E5C378] tracking-widest italic font-light">
          Le moment qu'on attend
        </p>

        <p className="text-sm text-[#A3A3A3] mt-3 font-normal leading-relaxed">
          دليلك الفاخر لأرقى قاعات الحفلات وخدمات الأعراس بالجزائر
        </p>
      </motion.div>

      {/* Bottom Action Button (Entrée) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-xs flex flex-col items-center gap-4 pb-4"
      >
        <button
          id="splash-enter-btn"
          onClick={onEnter}
          className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#D4AD54] via-[#E2BA65] to-[#B88E2D] p-[1px] transition-all duration-300 active:scale-95 shadow-[0_8px_20px_rgba(212,173,84,0.25)] hover:shadow-[0_12px_28px_rgba(212,173,84,0.35)]"
        >
          <div className="flex items-center justify-center gap-3 rounded-xl bg-[#171717] px-8 py-3.5 transition-colors group-hover:bg-[#171717]/80">
            <span className="font-luxury text-lg font-bold tracking-widest text-[#D4AD54]">
              Entrée
            </span>
            <span className="text-sm text-[#E5C378] font-semibold">
              (دخول)
            </span>
            <ArrowLeft className="w-5 h-5 text-[#D4AD54] transition-transform group-hover:-translate-x-1" />
          </div>
        </button>

        <span className="text-[11px] text-[#737373] tracking-wide">
          تصفح مجاني ومباشر لجميع الزوار بدون تسجيل
        </span>
      </motion.div>
    </div>
  );
};
