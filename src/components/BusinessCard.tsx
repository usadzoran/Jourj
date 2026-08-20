import React from 'react';
import { Star, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
  categoryName?: string;
  onClick: () => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  categoryName,
  onClick
}) => {
  return (
    <div
      id={`business-card-${business.id}`}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#D4AD54]/80 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#D4AD54]/10 active:scale-[0.98] flex flex-col"
    >
      {/* Main Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={business.main_image}
          alt={business.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-black/40" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-[#121212]/85 backdrop-blur-md px-3 py-1 border border-[#D4AD54]/40 text-xs shadow-sm">
          <Star className="w-3.5 h-3.5 fill-[#D4AD54] text-[#D4AD54]" />
          <span className="font-bold text-[#D4AD54]">{business.rating.toFixed(1)}</span>
          <span className="text-[#A3A3A3] text-[10px]">/ 5</span>
        </div>

        {/* Category Badge */}
        {categoryName && (
          <div className="absolute top-3 right-3 rounded-full bg-[#121212]/85 backdrop-blur-md px-3 py-1 text-xs font-medium text-[#E5C378] border border-[#333333]">
            {categoryName}
          </div>
        )}

        {/* Price Tag in Bottom Right of Image */}
        <div className="absolute bottom-3 right-3 rounded-lg bg-[#141414]/90 backdrop-blur-md px-3 py-1.5 border border-[#D4AD54]/30 shadow-md">
          <div className="text-[10px] text-[#A3A3A3]">يبدأ من</div>
          <div className="text-sm font-bold text-[#D4AD54]">
            {business.price.toLocaleString()} {business.price_unit}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h4 className="font-luxury text-lg md:text-xl font-bold text-[#FFFFFF] group-hover:text-[#D4AD54] transition-colors">
            {business.name}
          </h4>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#A3A3A3]">
            <MapPin className="w-3.5 h-3.5 text-[#D4AD54] shrink-0" />
            <span className="truncate">{business.location} — {business.address}</span>
          </div>

          <p className="mt-2 text-xs text-[#737373] line-clamp-2 leading-relaxed">
            {business.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#E5C378]">
            <Phone className="w-3.5 h-3.5 text-[#D4AD54]" />
            <span dir="ltr" className="font-mono text-[11px]">{business.phone}</span>
          </div>

          <span className="flex items-center gap-1 text-xs font-semibold text-[#D4AD54] group-hover:underline">
            عرض التفاصيل
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          </span>
        </div>
      </div>
    </div>
  );
};
