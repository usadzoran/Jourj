import React, { useState } from 'react';
import { Business, Category, PortfolioItem, Availability } from '../types';

interface BusinessDetailViewProps {
  business: Business;
  category: Category | null;
  portfolio: PortfolioItem[];
  availability: Availability[];
  onBackToCategory: () => void;
}

export const BusinessDetailView: React.FC<BusinessDetailViewProps> = ({
  business,
  category,
  portfolio,
  availability,
  onBackToCategory
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [bookingSent, setBookingSent] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>('السبت');

  // Clean phone for whatsapp
  const cleanPhone = business.phone.replace(/[^0-9]/g, '');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;
    setBookingSent(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToCategory}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#D7B45A] hover:underline cursor-pointer"
        >
          <span>→</span>
          <span>العودة إلى {category ? category.name : 'القائمة'}</span>
        </button>

        {category && (
          <span className="text-[11px] px-3 py-1 rounded-full bg-[#181818] border border-[#2b2b2b] text-[#D7B45A] font-medium">
            الفئة: {category.name}
          </span>
        )}
      </div>

      {/* Main Cover Card */}
      <div className="rounded-3xl overflow-hidden border border-[#2b2b2b] bg-[#141414] shadow-2xl">
        {/* Hero image */}
        <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-[#181818]">
          <img
            src={business.main_image}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/30 to-transparent" />
          
          {/* Header Overlay Info */}
          <div className="absolute bottom-6 right-6 left-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#D7B45A] text-[#111] text-xs font-bold">
                  {business.rating.toFixed(1)} ⭐
                </span>
                <span className="text-xs text-[#E0E0E0] bg-black/60 px-2.5 py-0.5 rounded-md border border-[#333]">
                  📍 {business.location}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-[#F7F3EA] drop-shadow-md">
                {business.name}
              </h1>
              {business.title && (
                <p className="text-xs sm:text-sm text-[#D7B45A] font-medium">
                  {business.title}
                </p>
              )}
            </div>

            {/* Price Box */}
            <div className="p-3 sm:p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-[#D7B45A]/40 text-right sm:text-left self-start sm:self-auto">
              <span className="block text-[10px] text-[#aaa]">السعر التقديري</span>
              <span className="text-lg sm:text-xl font-bold text-[#F7F3EA]">
                {business.price.toLocaleString()} {business.price_unit}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Contact & Action Buttons */}
        <div className="p-5 sm:p-6 bg-[#161616] border-b border-[#222] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Phone Call */}
            <a
              href={`tel:${business.phone}`}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#222] hover:bg-[#2c2c2c] text-[#F7F3EA] border border-[#333] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>📞</span>
              <span>اتصال ({business.phone})</span>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>💬</span>
              <span>واتساب (WhatsApp)</span>
            </a>

            {/* Google Maps */}
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(business.name + ' ' + business.address + ' ' + business.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#1d1d1d] hover:bg-[#272727] text-[#D7B45A] border border-[#D7B45A]/30 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <span>🗺️</span>
              <span>فتح في الخريطة</span>
            </a>
          </div>

          <div className="text-xs text-[#888] flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <span>العنوان:</span>
            <span className="text-[#F7F3EA] font-medium">{business.address}</span>
          </div>
        </div>

        {/* Details & Description Section */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Description & Portfolio */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#F7F3EA] flex items-center gap-2">
                <span className="text-[#D7B45A]">✦</span> نبذة ومعلومات عن المؤسسة
              </h2>
              <div className="text-xs sm:text-sm text-[#B5B5B5] leading-relaxed bg-[#111] p-5 rounded-2xl border border-[#222]">
                {business.description || 'مؤسسة معتمدة ومتخصصة في تقديم أرقى الخدمات للأعراس والمناسبات السعيدة في وهران.'}
              </div>
            </div>

            {/* Portfolio Gallery */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-[#F7F3EA] flex items-center gap-2">
                  <span className="text-[#D7B45A]">✦</span> معرض الصور (Portfolio)
                </h2>
                <span className="text-xs text-[#888]">{portfolio.length} صور</span>
              </div>

              {portfolio.length === 0 ? (
                <div className="p-8 text-center bg-[#111] rounded-2xl border border-[#222] text-[#777] text-xs">
                  لا توجد صور في المعرض حالياً.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {portfolio.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedImage(item.image_url)}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#1a1a1a] cursor-pointer hover:border-[#D7B45A] transition-all"
                    >
                      <img
                        src={item.image_url}
                        alt={item.title || 'صورة من المعرض'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {item.title && (
                        <div className="absolute inset-x-0 bottom-0 bg-black/75 p-1.5 text-[10px] text-center text-[#E0E0E0] truncate">
                          {item.title}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Availability & Booking Request */}
          <div className="space-y-6">
            {/* Availability Days */}
            <div className="rounded-2xl border border-[#282828] bg-[#111] p-5 space-y-4">
              <h3 className="text-sm font-bold text-[#F7F3EA] flex items-center gap-2">
                <span>📅</span> جدول التوفر الأسبوعي
              </h3>
              <p className="text-[11px] text-[#888]">
                الأيام المتاحة للحجز والفعاليات لدى {business.name}:
              </p>

              <div className="space-y-2">
                {availability.map((av) => (
                  <div
                    key={av.id || av.day}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#181818] border border-[#252525] text-xs"
                  >
                    <span className="font-medium text-[#E0E0E0]">{av.day}</span>
                    {av.available ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] text-[10px] font-bold border border-[#10b981]/30">
                        متاح للحجز ✓
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] text-[10px] font-bold border border-[#ef4444]/30">
                        غير متاح ✕
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Form Card */}
            <div className="rounded-2xl border border-[#D7B45A]/30 bg-gradient-to-b from-[#181818] to-[#121212] p-5 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#D7B45A] flex items-center gap-1.5">
                  <span>✨</span> طلب حجز أو استفسار
                </h3>
                <p className="text-[11px] text-[#888]">
                  أرسل طلبك وسيتم الرد عليك مباشرة من طرف إدارة {business.name}.
                </p>
              </div>

              {bookingSent ? (
                <div className="p-4 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 text-center space-y-2">
                  <span className="text-2xl">🎉</span>
                  <div className="text-xs font-bold text-[#10b981]">تم إرسال طلب الحجز بنجاح!</div>
                  <p className="text-[10px] text-[#aaa]">
                    سيتصل بك مسؤول {business.name} عبر الهاتف لتأكيد الموعد والتفاصيل.
                  </p>
                  <button
                    onClick={() => setBookingSent(false)}
                    className="text-[10px] text-[#D7B45A] underline mt-1"
                  >
                    إرسال طلب آخر
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-[#aaa] mb-1">الاسم الكامل</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: سارة بن علي"
                      className="w-full px-3 py-2 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-[#fff] focus:border-[#D7B45A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#aaa] mb-1">رقم الهاتف</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0550 00 00 00"
                      className="w-full px-3 py-2 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-[#fff] focus:border-[#D7B45A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#aaa] mb-1">اليوم المفضل</label>
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-[#fff] focus:border-[#D7B45A] outline-none"
                    >
                      {availability
                        .filter(a => a.available)
                        .map(a => (
                          <option key={a.day} value={a.day}>
                            يوم {a.day} (متاح)
                          </option>
                        ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F0D38A] to-[#D7B45A] text-[#111] font-bold text-xs shadow-md hover:brightness-110 transition-all cursor-pointer"
                  >
                    إرسال طلب الحجز المباشر
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border border-[#333]">
            <img
              src={selectedImage}
              alt="معاينة كاملة"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
