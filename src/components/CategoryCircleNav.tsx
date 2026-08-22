import React from 'react';
import { Category } from '../types';

export interface CategoryCircleNavProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

// Curated high-resolution images & icons for wedding categories in Oran
const CATEGORY_META: Record<string, { image: string; icon: string; name: string }> = {
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

export const CategoryCircleNav: React.FC<CategoryCircleNavProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory
}) => {
  const canonicalOrder = ['photographe', 'salle', 'costume', 'voiture', 'traiteur', 'decoration'];

  const displayCategories = canonicalOrder.map((id) => {
    const existing = categories.find((c) => c.id.toLowerCase() === id.toLowerCase());
    const meta = CATEGORY_META[id] || {
      name: id.charAt(0).toUpperCase() + id.slice(1),
      icon: '✦',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'
    };

    return {
      id,
      name: existing?.name || meta.name,
      icon: existing?.icon || meta.icon,
      image_url: existing?.image_url || meta.image,
      active: existing ? existing.active : true
    };
  });

  return (
    <nav
      id="category-circle-nav"
      aria-label="Navigation des catégories"
      className="w-full bg-[#080808] border-b border-[#1A1A1A] py-3 px-4 overflow-x-auto no-scrollbar shadow-md z-30 sticky top-0"
    >
      <div className="flex items-center justify-start sm:justify-center gap-3.5 min-w-max mx-auto px-1">
        {displayCategories.map((cat) => {
          const isActive = cat.id.toLowerCase() === activeCategoryId.toLowerCase();

          return (
            <button
              key={cat.id}
              id={`category-circle-item-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center gap-1.5 focus:outline-none group select-none transition-all cursor-pointer"
              type="button"
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Circular Avatar Container with Active Highlight */}
              <div
                className={`relative rounded-full transition-all duration-300 flex items-center justify-center p-0.5 ${
                  isActive
                    ? 'w-14 h-14 bg-gradient-to-tr from-[#D7B45A] via-[#F0D38A] to-[#C89443] shadow-[0_0_15px_rgba(215,180,90,0.55)] scale-105 ring-2 ring-[#D7B45A]/30'
                    : 'w-11 h-11 bg-[#1A1A1A] border border-[#2A2A2A] group-hover:border-[#D7B45A]/60 group-hover:scale-105'
                }`}
              >
                {/* 50% Circular Image Container */}
                <div className="w-full h-full rounded-full overflow-hidden bg-[#121212] relative">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className={`w-full h-full object-cover rounded-full transition-all duration-300 ${
                      isActive ? 'scale-105 contrast-105' : 'opacity-70 group-hover:opacity-100'
                    }`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Subtle Dark Layer */}
                  {isActive ? (
                    <div className="absolute inset-0 rounded-full bg-[#D7B45A]/10 mix-blend-overlay" />
                  ) : (
                    <div className="absolute inset-0 rounded-full bg-black/35 group-hover:bg-transparent transition-colors" />
                  )}
                </div>

                {/* Circular Icon Badge */}
                <span
                  className={`absolute -bottom-1 -right-1 flex items-center justify-center rounded-full text-[10px] leading-none shadow-md transition-all ${
                    isActive
                      ? 'w-5 h-5 bg-[#080808] border border-[#D7B45A] text-white ring-1 ring-[#D7B45A]/60 scale-105'
                      : 'w-4 h-4 bg-[#151515] border border-[#333333] text-white/90 group-hover:border-[#D7B45A]/50'
                  }`}
                >
                  {cat.icon}
                </span>
              </div>

              {/* Category Label */}
              <span
                className={`text-[10px] tracking-wide whitespace-nowrap transition-colors text-center ${
                  isActive
                    ? 'font-bold text-[#D7B45A] drop-shadow-[0_1px_5px_rgba(215,180,90,0.35)]'
                    : 'font-medium text-[#888888] group-hover:text-[#E0E0E0]'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
