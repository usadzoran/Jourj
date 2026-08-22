import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Star, Heart } from 'lucide-react';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  onClick: () => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  isFavorite = false,
  onToggleFavorite,
  onClick
}) => {
  return (
    <motion.div
      id={`business-card-${business.id}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="group cursor-pointer rounded-3xl bg-[#151515] border border-[#222222] hover:border-[#D7B45A]/50 transition-all overflow-hidden flex flex-col shadow-lg select-none"
    >
      {/* Large Real Image Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1A1A1A]">
        <img
          src={business.main_image}
          alt={business.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Dark Gradient Overlay at Bottom of Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          {/* Category Tag */}
          <span className="px-3 py-1 rounded-full bg-[#080808]/85 border border-[#D7B45A]/40 text-[11px] font-semibold text-[#D7B45A] backdrop-blur-md">
            {business.category_name || business.title.split(' ')[0]}
          </span>

          {/* Favorite Heart Button */}
          {onToggleFavorite && (
            <button
              id={`fav-btn-${business.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(e);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                isFavorite
                  ? 'bg-[#B94B49] text-white'
                  : 'bg-[#080808]/80 text-[#999999] hover:text-[#D7B45A] border border-[#222222]'
              }`}
              title="Ajouter aux favoris"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Rating pill on image bottom right */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#080808]/90 border border-[#333333] text-xs font-bold text-[#F7F3EA] backdrop-blur-md">
          <Star className="w-3.5 h-3.5 fill-[#D7B45A] text-[#D7B45A]" />
          <span>{business.rating.toFixed(1)}</span>
          {business.reviews_count && (
            <span className="text-[10px] text-[#999999] font-normal">({business.reviews_count})</span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Provider Name */}
          <h3 className="font-luxury text-lg font-bold text-[#F7F3EA] group-hover:text-[#D7B45A] transition-colors leading-tight">
            {business.name}
          </h3>

          {/* Short Title/Description */}
          <p className="text-xs text-[#999999] line-clamp-1 mt-1 font-light">
            {business.title}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#888888] mt-2.5">
            <MapPin className="w-3.5 h-3.5 text-[#D7B45A] shrink-0" />
            <span className="truncate">{business.location} • {business.address.split(',')[0]}</span>
          </div>
        </div>

        {/* Price Row */}
        <div className="mt-4 pt-3 border-t border-[#222222] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-[#777777]">À partir de</span>
            <span className="font-luxury text-base font-bold text-[#D7B45A]">
              {business.price.toLocaleString('fr-FR')} {business.price_unit}
            </span>
          </div>

          <span className="text-xs font-semibold text-[#F7F3EA] group-hover:text-[#D7B45A] transition-colors flex items-center gap-1">
            Détails →
          </span>
        </div>
      </div>
    </motion.div>
  );
};
