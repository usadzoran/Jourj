import React from 'react';
import { motion } from 'motion/react';
import { Crown, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080808] px-6 text-[#F7F3EA] overflow-hidden select-none">
      {/* Background Wedding Image with Dark Dim Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-15 scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/90 via-[#080808]/80 to-[#080808]" />

      {/* Subtle Gold Ambient Glow in the Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 md:w-96 h-80 md:h-96 bg-[#D7B45A]/12 rounded-full blur-3xl pointer-events-none" />

      {/* Main Luxury Content Block */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center max-w-sm w-full mx-auto"
      >
        {/* Crown ♛ */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6 flex items-center justify-center text-[#D7B45A]"
        >
          <Crown className="w-12 h-12 stroke-[1.5] text-[#D7B45A] drop-shadow-[0_0_15px_rgba(215,180,90,0.35)]" />
        </motion.div>

        {/* Brand Name: JOUR J */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-luxury text-5xl md:text-6xl font-bold tracking-[0.12em] text-[#F7F3EA] uppercase"
        >
          JOUR <span className="text-[#D7B45A]">J</span>
        </motion.h1>

        {/* Slogan: LE MOMENT QU'ON ATTEND */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-luxury text-sm md:text-base font-semibold tracking-[0.25em] text-[#D7B45A] uppercase mt-3"
        >
          LE MOMENT QU'ON ATTEND
        </motion.p>

        {/* Short Subtitle Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xs md:text-sm text-[#999999] font-normal leading-relaxed mt-6 max-w-[280px]"
        >
          "Tout pour préparer votre grand jour au même endroit."
        </motion.p>

        {/* ENTRER Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 w-full flex justify-center"
        >
          <button
            id="splash-entrer-btn"
            onClick={onEnter}
            className="group relative w-full max-w-[240px] overflow-hidden rounded-2xl bg-gradient-to-r from-[#D7B45A] via-[#F0D38A] to-[#C89443] p-[1px] shadow-[0_8px_30px_rgba(215,180,90,0.25)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(215,180,90,0.4)] active:scale-[0.98]"
          >
            <div className="flex items-center justify-center gap-3 rounded-2xl bg-[#080808] px-8 py-4 transition-colors group-hover:bg-[#151515]">
              <span className="font-luxury text-base font-bold tracking-[0.2em] text-[#D7B45A] uppercase">
                ENTRER
              </span>
              <ArrowRight className="w-4 h-4 text-[#D7B45A] transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
