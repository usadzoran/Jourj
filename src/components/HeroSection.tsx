import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MapPin } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 pt-2 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] rounded-3xl overflow-hidden border border-[#222222] shadow-2xl group"
      >
        {/* Real High-Resolution Wedding Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85')`
          }}
        />

        {/* Dark Black Gradients for contrast & luxury tone */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/70 via-transparent to-transparent" />

        {/* Content Box Positioned Bottom Left / Center */}
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-left">
          
          {/* Oran Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#080808]/80 border border-[#D7B45A]/40 text-[11px] font-semibold text-[#D7B45A] mb-3 w-fit backdrop-blur-md">
            <MapPin className="w-3 h-3 text-[#D7B45A]" />
            <span>Oran, Algérie</span>
          </div>

          {/* VOTRE GRAND JOUR */}
          <h2 className="font-luxury text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.1em] text-[#F7F3EA] uppercase leading-tight drop-shadow-md">
            VOTRE GRAND <span className="text-[#D7B45A]">JOUR</span>
          </h2>

          {/* Le moment qu'on attend */}
          <p className="font-luxury text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#D7B45A] uppercase mt-1">
            Le moment qu'on attend
          </p>

          {/* Subtitle quote */}
          <p className="text-xs sm:text-sm text-[#F7F3EA]/90 mt-2.5 max-w-md font-light leading-relaxed drop-shadow">
            Trouvez les professionnels d'exception qui feront de votre événement un moment inoubliable.
          </p>
        </div>

        {/* Subtle Decorative Gold Accent Ring */}
        <div className="absolute top-4 right-4 w-9 h-9 rounded-full border border-[#D7B45A]/30 bg-[#080808]/50 backdrop-blur-md flex items-center justify-center text-[#D7B45A]">
          <Sparkles className="w-4 h-4" />
        </div>
      </motion.div>
    </div>
  );
};
