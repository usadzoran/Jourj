import React from 'react';
import { Category } from '../types';

interface CategoryScrollProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CATEGORY_IMAGES: Record<string, { image: string; icon: string; name: string }> = {
  photographe: {
    name: 'Photographe',
    icon: '📸',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=300&q=80'
  },
  salle: {
    name: 'Salle',
    icon: '🏛️',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80'
  },
  costume: {
    name: 'Costume',
    icon: '🤵',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=300&q=80'
  },
  voiture: {
    name: 'Voiture',
    icon: '🚗',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80'
  },
  traiteur: {
    name: 'Traiteur',
    icon: '🍽️',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=300&q=80'
  },
  decoration: {
    name: 'Décoration',
    icon: '🌸',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=300&q=80'
  }
};

export const CategoryScroll: React.FC<CategoryScrollProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-3 px-4 bg-[#080808] border-b border-[#1A1A1A]">
      <div className="flex items-center gap-3.5 min-w-max max-w-4xl mx-auto px-1">
        {/* Tout Circle */}
        <button
          id="category-scroll-all"
          onClick={() => onSelectCategory(null)}
          className="flex flex-col items-center gap-1.5 focus:outline-none group select-none transition-all"
          type="button"
        >
          <div
            className={`relative rounded-full transition-all duration-300 flex items-center justify-center p-0.5 ${
              selectedCategoryId === null
                ? 'w-14 h-14 bg-gradient-to-tr from-[#D7B45A] via-[#F0D38A] to-[#C89443] shadow-[0_0_14px_rgba(215,180,90,0.5)] scale-105'
                : 'w-11 h-11 bg-[#1A1A1A] border border-[#2A2A2A] group-hover:border-[#D7B45A]/50 group-hover:scale-105'
            }`}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-[#151515] flex items-center justify-center">
              <span className={`text-lg transition-transform ${selectedCategoryId === null ? 'text-[#D7B45A] font-bold scale-110' : 'text-[#888888]'}`}>
                ✦
              </span>
            </div>
          </div>
          <span
            className={`text-[10px] tracking-wide whitespace-nowrap transition-colors text-center ${
              selectedCategoryId === null
                ? 'font-bold text-[#D7B45A] drop-shadow-[0_1px_4px_rgba(215,180,90,0.3)]'
                : 'font-medium text-[#888888] group-hover:text-[#CCCCCC]'
            }`}
          >
            Tout
          </span>
        </button>

        {/* Dynamic Category Circles */}
        {categories
          .filter((c) => c.active)
          .map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const meta = CATEGORY_IMAGES[cat.id.toLowerCase()] || {
              image: cat.image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80',
              icon: cat.icon || '✦',
              name: cat.name
            };

            return (
              <button
                key={cat.id}
                id={`category-scroll-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className="flex flex-col items-center gap-1.5 focus:outline-none group select-none transition-all"
                type="button"
              >
                <div
                  className={`relative rounded-full transition-all duration-300 flex items-center justify-center p-0.5 ${
                    isSelected
                      ? 'w-14 h-14 bg-gradient-to-tr from-[#D7B45A] via-[#F0D38A] to-[#C89443] shadow-[0_0_14px_rgba(215,180,90,0.5)] scale-105'
                      : 'w-11 h-11 bg-[#1A1A1A] border border-[#2A2A2A] group-hover:border-[#D7B45A]/50 group-hover:scale-105'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#121212] relative">
                    <img
                      src={cat.image_url || meta.image}
                      alt={cat.name}
                      className={`w-full h-full object-cover rounded-full transition-transform duration-300 ${
                        isSelected ? 'scale-105 contrast-105' : 'opacity-70 group-hover:opacity-100'
                      }`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    {isSelected ? (
                      <div className="absolute inset-0 rounded-full bg-[#D7B45A]/10 mix-blend-overlay" />
                    ) : (
                      <div className="absolute inset-0 rounded-full bg-black/30 group-hover:bg-transparent transition-colors" />
                    )}
                  </div>

                  <span
                    className={`absolute -bottom-1 -right-1 flex items-center justify-center rounded-full text-[10px] leading-none shadow-md ${
                      isSelected
                        ? 'w-5 h-5 bg-[#080808] border border-[#D7B45A] text-white ring-1 ring-[#D7B45A]/50'
                        : 'w-4 h-4 bg-[#151515] border border-[#333333] text-white/90'
                    }`}
                  >
                    {cat.icon || meta.icon}
                  </span>
                </div>

                <span
                  className={`text-[10px] tracking-wide whitespace-nowrap transition-colors text-center ${
                    isSelected
                      ? 'font-bold text-[#D7B45A] drop-shadow-[0_1px_4px_rgba(215,180,90,0.3)]'
                      : 'font-medium text-[#888888] group-hover:text-[#CCCCCC]'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
};
