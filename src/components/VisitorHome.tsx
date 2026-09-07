import React from 'react';
import { Category, Business } from '../types';

interface VisitorHomeProps {
  categories: Category[];
  businesses: Business[];
  onSelectCategory: (categoryId: string) => void;
  onOpenTokenPrompt: () => void;
}

export const VisitorHome: React.FC<VisitorHomeProps> = ({
  categories,
  businesses,
  onSelectCategory,
  onOpenTokenPrompt
}) => {
  // Count active businesses per category
  const getBusinessCount = (categoryId: string) => {
    return businesses.filter(b => b.category_id === categoryId && b.active).length;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-10">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden border border-[#D7B45A]/30 bg-[#111111] shadow-2xl p-6 sm:p-10 text-center flex flex-col items-center justify-center min-h-[280px]">
        {/* Ambient glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D7B45A]/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Emblem */}
        <div className="w-14 h-14 rounded-full border border-[#D7B45A]/50 bg-[#181818] flex items-center justify-center mb-4 shadow-lg shadow-[#D7B45A]/20">
          <span className="text-xl text-[#D7B45A]">♛</span>
        </div>

        <div className="space-y-2 mb-6 max-w-xl">
          <div className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#D7B45A]">
            منصة تنظيم الأعراس والمناسبات الفاخرة · وهران
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif text-[#F7F3EA] font-normal tracking-wide">
            JOUR <span className="text-[#D7B45A] font-semibold">J</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed max-w-md mx-auto">
            اختر نوع الخدمة التي تبحث عنها لاستعراض أفضل المؤسسات وقاعات الحفلات المعتمدة في وهران.
          </p>
        </div>

        {/* Categories Quick Circles Ribbon */}
        <div className="w-full overflow-x-auto py-2 flex items-center justify-center gap-3 sm:gap-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none min-w-[68px]"
            >
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full border border-[#333] group-hover:border-[#D7B45A] p-0.5 transition-all overflow-hidden bg-[#181818] shadow-md group-hover:scale-105">
                <img
                  src={cat.image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-[10px] sm:text-xs text-[#888] group-hover:text-[#D7B45A] transition-colors whitespace-nowrap font-medium">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Categories Grid (Main Entry Points) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#222] pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#F7F3EA] flex items-center gap-2">
              <span className="text-[#D7B45A]">✦</span> أقسام الخدمات والمناسبات
            </h2>
            <p className="text-xs text-[#888]">
              اضغط على أي فئة لاستعراض قائمة المؤسسات والقاعات المتخصصة
            </p>
          </div>
          <span className="text-xs text-[#D7B45A] font-medium bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#333]">
            {categories.length} فئات معتمدة
          </span>
        </div>

        {categories.length === 0 ? (
          <div className="p-8 text-center bg-[#141414] rounded-2xl border border-[#222] text-[#888] text-sm">
            لا توجد خدمات متاحة في هذه الفئة حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const count = getBusinessCount(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className="group rounded-2xl overflow-hidden border border-[#262626] hover:border-[#D7B45A]/70 bg-[#141414] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 cursor-pointer flex flex-col"
                >
                  {/* Category Image Cover */}
                  <div className="relative h-44 w-full overflow-hidden bg-[#1a1a1a]">
                    <img
                      src={cat.image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
                    
                    {/* Badge count */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#D7B45A]/40 text-[#D7B45A] text-[10px] font-semibold flex items-center gap-1.5">
                      <span>{count}</span>
                      <span>مؤسسة</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-[#F7F3EA] group-hover:text-[#D7B45A] transition-colors">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-xs text-[#888] leading-relaxed line-clamp-2">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-[#1f1f1f] text-xs text-[#D7B45A]">
                      <span className="font-medium">عرض المؤسسات المسجلة</span>
                      <span className="transition-transform group-hover:translate-x-[-4px]">←</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick Invite Registration Banner for Business Owners */}
      <section className="rounded-2xl border border-[#2a2a2a] bg-gradient-to-r from-[#141414] via-[#1a1813] to-[#141414] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center sm:text-right">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs text-[#D7B45A] uppercase tracking-wider font-semibold">
              أصحاب قاعات الحفلات ومقدمي الخدمات
            </span>
            <span className="text-xs text-[#D7B45A]">✦</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#F7F3EA]">
            هل تملك رابط دعوة للتسجيل في منصة JOUR J؟
          </h3>
          <p className="text-xs text-[#888] max-w-md">
            إذا أرسلت لك إدارة المنصة رمز أو رابط دعوة حصري، يمكنك تفعيله لتسجيل مؤسستك مباشرة في فئتها المحددة.
          </p>
        </div>

        <button
          onClick={onOpenTokenPrompt}
          className="whitespace-nowrap px-6 py-3 rounded-xl bg-[#1e1e1e] hover:bg-[#D7B45A] hover:text-[#111] text-[#D7B45A] border border-[#D7B45A]/40 font-bold text-xs tracking-wider transition-all shadow-md cursor-pointer"
        >
          أدخل رمز الدعوة (Token)
        </button>
      </section>
    </div>
  );
};
