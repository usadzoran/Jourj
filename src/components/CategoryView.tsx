import React from 'react';
import { Category, Business } from '../types';

interface CategoryViewProps {
  category: Category;
  allCategories: Category[];
  businesses: Business[];
  onSelectCategory: (categoryId: string) => void;
  onSelectBusiness: (businessId: string) => void;
  onBackToHome: () => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  category,
  allCategories,
  businesses,
  onSelectCategory,
  onSelectBusiness,
  onBackToHome
}) => {
  // Strict filter: active businesses in this category
  const activeBusinesses = businesses.filter(
    b => b.category_id === category.id && b.active
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Category Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#2b2b2b] bg-[#121212] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs text-[#D7B45A] hover:underline mb-1"
            >
              <span>→</span>
              <span>العودة لجميع الأقسام</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F7F3EA] flex items-center gap-2">
              <span className="text-[#D7B45A]">✦</span> {category.name}
            </h1>
            {category.description && (
              <p className="text-xs sm:text-sm text-[#A0A0A0] max-w-xl leading-relaxed">
                {category.description}
              </p>
            )}
          </div>

          <div className="px-4 py-2 rounded-2xl bg-black/60 border border-[#333] text-center">
            <span className="text-lg font-bold text-[#D7B45A]">{activeBusinesses.length}</span>
            <span className="block text-[10px] text-[#888]">مؤسسات نشطة</span>
          </div>
        </div>

        {/* Categories Circular Quick Switcher Ribbon */}
        <div className="relative z-10 mt-6 pt-5 border-t border-[#222]">
          <div className="text-[11px] text-[#777] mb-2 font-medium">
            تصفح الأقسام الأخرى:
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {allCategories.map((c) => {
              const isActive = c.id === category.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCategory(c.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#D7B45A] text-[#111] font-bold shadow-md shadow-[#D7B45A]/20'
                      : 'bg-[#181818] text-[#aaa] border border-[#2b2b2b] hover:border-[#D7B45A]/50 hover:text-[#F7F3EA]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current opacity-70" />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* List of Businesses in this Category */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F7F3EA] flex items-center gap-2">
            المؤسسات المتاحة في فئة <span className="text-[#D7B45A]">{category.name}</span>
          </h2>
          <span className="text-xs text-[#888]">وهران والمناطق المجاورة</span>
        </div>

        {activeBusinesses.length === 0 ? (
          <div className="p-12 text-center bg-[#141414] rounded-2xl border border-[#262626] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1e1e1e] border border-[#333] flex items-center justify-center mx-auto text-[#888]">
              🏛️
            </div>
            <h3 className="text-base font-semibold text-[#ccc]">
              لا توجد مؤسسات متاحة حالياً في هذه الفئة.
            </h3>
            <p className="text-xs text-[#777] max-w-sm mx-auto">
              سيتم إضافة مؤسسات جديدة معتمدة قريباً في هذا القسم. يمكنك استكشاف الفئات الأخرى.
            </p>
            <button
              onClick={onBackToHome}
              className="mt-2 px-4 py-2 rounded-full text-xs text-[#D7B45A] bg-[#1a1a1a] border border-[#D7B45A]/30 hover:bg-[#D7B45A]/10"
            >
              الرجوع للصفحة الرئيسية
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBusinesses.map((biz) => (
              <div
                key={biz.id}
                onClick={() => onSelectBusiness(biz.id)}
                className="group rounded-2xl overflow-hidden border border-[#262626] hover:border-[#D7B45A]/60 bg-[#141414] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/70 cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-[#181818]">
                  <img
                    src={biz.main_image}
                    alt={biz.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20" />
                  
                  {/* Rating badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#D7B45A]/30 text-[#D7B45A] text-xs font-bold flex items-center gap-1">
                    <span>⭐</span>
                    <span>{biz.rating.toFixed(1)}</span>
                  </div>

                  {/* Location badge */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#E0E0E0] text-[10px] flex items-center gap-1">
                    <span>📍</span>
                    <span>{biz.location}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-[#F7F3EA] group-hover:text-[#D7B45A] transition-colors">
                      {biz.name}
                    </h3>
                    {biz.title && (
                      <p className="text-xs text-[#D7B45A] font-medium line-clamp-1">
                        {biz.title}
                      </p>
                    )}
                    <p className="text-xs text-[#888] line-clamp-2 leading-relaxed">
                      {biz.description || biz.address}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1f1f1f] flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-[#777]">الأسعار تبدأ من</span>
                      <span className="text-sm font-bold text-[#F7F3EA]">
                        {biz.price.toLocaleString()} {biz.price_unit}
                      </span>
                    </div>

                    <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#111] bg-gradient-to-r from-[#F0D38A] to-[#D7B45A] group-hover:brightness-110 transition-all">
                      التفاصيل والحجز
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
