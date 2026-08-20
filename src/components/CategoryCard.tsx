import React from 'react';
import { Star, ArrowLeft } from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  rating?: number;
  count?: number;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  rating = 4.9,
  count = 1,
  onClick,
}) => {
  return (
    <div
      id={`category-card-${category.id}`}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#D4AD54]/70 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#D4AD54]/10 active:scale-[0.98]"
    >
      {/* Background Image with Gradient */}
      <div className="relative h-48 md:h-56 w-full overflow-hidden">
        <img
          src={category.image_url}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-[#121212]/80 backdrop-blur-md px-3 py-1 border border-[#D4AD54]/40 text-xs text-[#F7F5F0]">
          <div className="flex text-[#D4AD54]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-[#D4AD54] text-[#D4AD54]" />
            ))}
          </div>
          <span className="font-bold text-[#D4AD54]">{rating.toFixed(1)}</span>
        </div>

        {/* Count Badge */}
        <div className="absolute top-3 right-3 rounded-full bg-[#121212]/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-[#E5C378] border border-[#333333]">
          {count} {count > 1 ? 'أماكن' : 'مكان متاح'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col justify-between">
        <div>
          <h3 className="font-luxury text-xl md:text-2xl font-bold text-[#FFFFFF] group-hover:text-[#D4AD54] transition-colors">
            {category.name}
          </h3>
          <p className="mt-1.5 text-xs md:text-sm text-[#A3A3A3] line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between text-xs text-[#D4AD54]">
          <span className="font-medium">استكشف الخدمات والأماكن</span>
          <div className="w-7 h-7 rounded-full bg-[#262626] group-hover:bg-[#D4AD54] text-[#D4AD54] group-hover:text-[#121212] flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
