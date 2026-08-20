import React, { useState, useEffect } from 'react';
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Image as ImageIcon,
  ArrowRight,
  Share2,
  ExternalLink,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';
import { Business, Category, PortfolioItem, AvailabilityItem } from '../types';
import { DataService, ALL_WEEK_DAYS } from '../services/dataService';
import { PortfolioLightbox } from './PortfolioLightbox';

interface BusinessDetailViewProps {
  businessId: string;
  onBack: () => void;
}

export const BusinessDetailView: React.FC<BusinessDetailViewProps> = ({
  businessId,
  onBack
}) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Copy toast state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const biz = await DataService.getBusinessById(businessId);
      if (biz) {
        setBusiness(biz);
        const categories = await DataService.getCategories();
        const cat = categories.find(c => c.id === biz.category_id);
        setCategory(cat || null);

        const port = await DataService.getPortfolio(biz.id);
        setPortfolio(port);

        const avail = await DataService.getAvailability(biz.id);
        setAvailability(avail);
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };

    loadData();
  }, [businessId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-[#D4AD54]">
        <div className="w-12 h-12 border-2 border-[#D4AD54] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-[#A3A3A3]">جاري تحميل تفاصيل المكان...</span>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h3 className="text-xl font-bold text-[#FFFFFF]">القسم غير موجود</h3>
        <p className="text-sm text-[#A3A3A3]">عذرًا، لم يتم العثور على المكان المطلوب.</p>
        <button
          onClick={onBack}
          className="mt-2 px-6 py-2.5 rounded-xl bg-[#D4AD54] text-[#121212] font-bold"
        >
          العودة للأقسام
        </button>
      </div>
    );
  }

  // Pre-filled WhatsApp greeting
  const cleanPhone = business.phone.replace(/[^0-9]/g, '');
  const waMessage = encodeURIComponent(
    `مرحبًا، أنا مهتم بالاستفسار عن حجز خدمات ${business.name} عبر منصة jour j.`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${waMessage}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${business.name} — jour j`,
        text: `اكتشف ${business.name} على منصة jour j للأعراس والمناسبات`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="pb-28">
      {/* Top Header Navigation */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#121212]/90 backdrop-blur-md border-b border-[#262626]">
        <button
          id="detail-back-btn"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-[#D4AD54] hover:text-[#FFFFFF] transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع للأقسام</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="detail-share-btn"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1F1F1F] border border-[#333333] hover:border-[#D4AD54] text-xs text-[#E5C378] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'تم النسخ!' : 'مشاركة'}</span>
          </button>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden bg-[#171717]">
        <img
          src={business.main_image}
          alt={business.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-black/30" />

        {/* Hero Overlay Content */}
        <div className="absolute bottom-0 inset-x-0 p-5 md:p-8 flex flex-col gap-2 max-w-4xl mx-auto">
          {category && (
            <span className="self-start rounded-full bg-[#D4AD54]/20 border border-[#D4AD54]/50 px-3 py-1 text-xs font-semibold text-[#D4AD54] backdrop-blur-sm">
              {category.name}
            </span>
          )}

          <h1 className="font-luxury text-3xl md:text-5xl font-extrabold text-[#FFFFFF] drop-shadow-md">
            {business.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm mt-1">
            {/* Stars Rating */}
            <div className="flex items-center gap-1.5 bg-[#171717]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AD54]/40">
              <div className="flex text-[#D4AD54]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#D4AD54] text-[#D4AD54]" />
                ))}
              </div>
              <span className="font-bold text-[#D4AD54]">{business.rating.toFixed(1)}</span>
              <span className="text-[#A3A3A3] text-xs">/ 5</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#E5C378]">
              <MapPin className="w-3.5 h-3.5 text-[#D4AD54]" />
              <span>{business.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 mt-6 space-y-6">
        
        {/* Description & Title */}
        <div className="rounded-2xl bg-[#1A1A1A] p-5 md:p-6 border border-[#2A2A2A]">
          <h2 className="font-luxury text-xl font-bold text-[#FFFFFF] mb-2">
            {business.title}
          </h2>
          <p className="text-sm md:text-base text-[#D4D4D4] leading-relaxed">
            {business.description}
          </p>
        </div>

        {/* 2. INFORMATION CARDS GRID (العنوان، الهاتف، البريد، التقييم) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Address */}
          <div className="rounded-xl bg-[#1A1A1A] p-4 border border-[#2A2A2A] flex flex-col justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-[#A3A3A3]">
              <MapPin className="w-4 h-4 text-[#D4AD54]" />
              <span>العنوان</span>
            </div>
            <p className="text-xs md:text-sm font-semibold text-[#FFFFFF] leading-snug">
              📍 {business.location}
            </p>
            <span className="text-[11px] text-[#737373] truncate">{business.address}</span>
          </div>

          {/* Phone */}
          <div className="rounded-xl bg-[#1A1A1A] p-4 border border-[#2A2A2A] flex flex-col justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-[#A3A3A3]">
              <Phone className="w-4 h-4 text-[#D4AD54]" />
              <span>الهاتف</span>
            </div>
            <a
              href={`tel:${business.phone}`}
              dir="ltr"
              className="text-xs md:text-sm font-mono font-bold text-[#D4AD54] hover:underline"
            >
              📞 {business.phone}
            </a>
            <span className="text-[11px] text-[#737373]">متاح للحجز والاستفسار</span>
          </div>

          {/* Email */}
          <div className="rounded-xl bg-[#1A1A1A] p-4 border border-[#2A2A2A] flex flex-col justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-[#A3A3A3]">
              <Mail className="w-4 h-4 text-[#D4AD54]" />
              <span>البريد الإلكتروني</span>
            </div>
            <a
              href={`mailto:${business.email || 'contact@jourj.dz'}`}
              className="text-xs md:text-sm font-medium text-[#F7F5F0] hover:text-[#D4AD54] truncate"
            >
              ✉️ {business.email || 'غير متوفر'}
            </a>
            <span className="text-[11px] text-[#737373]">الرد خلال 24 ساعة</span>
          </div>

          {/* Rating */}
          <div className="rounded-xl bg-[#1A1A1A] p-4 border border-[#2A2A2A] flex flex-col justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-[#A3A3A3]">
              <Star className="w-4 h-4 text-[#D4AD54]" />
              <span>التقييم العام</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base md:text-lg font-bold text-[#D4AD54]">
                ⭐ {business.rating.toFixed(1)}
              </span>
              <span className="text-xs text-[#737373]">/ 5</span>
            </div>
            <span className="text-[11px] text-[#22c55e]">تقييم ممتاز للخدمة</span>
          </div>
        </div>

        {/* 3. PRICE CARD (بطاقة سوداء أنيقة) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#141414] via-[#1A1A1A] to-[#121212] p-6 border border-[#D4AD54]/40 shadow-xl shadow-[#D4AD54]/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AD54]">
                <Sparkles className="w-4 h-4 text-[#D4AD54]" />
                <span>السعر يبدأ من</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-luxury text-3xl md:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
                  {business.price.toLocaleString()}
                </span>
                <span className="text-lg md:text-xl font-bold text-[#D4AD54]">
                  {business.price_unit}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#A3A3A3]">
                * قد تختلف الأسعار حسب الخدمات الإضافية، عدد الضيوف والموسم.
              </p>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start md:self-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AD54] to-[#B88E2D] hover:from-[#E2BA65] hover:to-[#D4AD54] text-[#121212] font-bold text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>طلب عرض سعر خاص</span>
            </a>
          </div>
        </div>

        {/* 4. PORTFOLIO & GALLERY (معرض الصور) */}
        <div className="rounded-2xl bg-[#1A1A1A] p-5 md:p-6 border border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#D4AD54]" />
              <h3 className="font-luxury text-xl font-bold text-[#FFFFFF]">
                معرض الصور — Portfolio
              </h3>
            </div>
            <span className="text-xs text-[#E5C378] font-medium">
              {portfolio.length} صور متاحة (اضغط للتكبير)
            </span>
          </div>

          {portfolio.length === 0 ? (
            <div className="text-center py-8 text-sm text-[#737373]">
              لا توجد صور في المعرض حاليًا.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {portfolio.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => openLightboxAt(idx)}
                  className="group relative h-32 md:h-40 rounded-xl overflow-hidden cursor-pointer border border-[#333333] hover:border-[#D4AD54] transition-all duration-200"
                >
                  <img
                    src={item.image_url}
                    alt={item.title || 'صورة المعرض'}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-[11px] text-[#F7F5F0] font-medium truncate">
                      {item.title || 'عرض الصورة'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. AVAILABLE DAYS (الأيام المتاحة) */}
        <div className="rounded-2xl bg-[#1A1A1A] p-5 md:p-6 border border-[#2A2A2A]">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#D4AD54]" />
            <h3 className="font-luxury text-xl font-bold text-[#FFFFFF]">
              الأيام المتاحة للعمل والحجز
            </h3>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {ALL_WEEK_DAYS.map((day) => {
              const item = availability.find(a => a.day === day);
              const isAvailable = item ? item.available : true;

              return (
                <div
                  key={day}
                  className={`flex flex-col items-center justify-center p-2 md:p-3 rounded-xl border transition-all ${
                    isAvailable
                      ? 'bg-[#1F1B12] border-[#D4AD54] text-[#D4AD54] shadow-sm shadow-[#D4AD54]/10'
                      : 'bg-[#171717] border-[#2A2A2A] text-[#525252] opacity-60'
                  }`}
                >
                  <span className="text-xs md:text-sm font-bold">{day}</span>
                  <div className="mt-1.5">
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#E5C378]">
                        <CheckCircle2 className="w-3 h-3 text-[#D4AD54]" />
                        متاح
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-[#525252]">
                        <XCircle className="w-3 h-3 text-[#525252]" />
                        مغلق
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-[#A3A3A3] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D4AD54]" />
            <span>الأيام المحددة باللون الذهبي جاهزة لاستقبال الحجوزات والمناسبات.</span>
          </p>
        </div>

        {/* 6. LOCATION & MAP PLACEHOLDER */}
        <div className="rounded-2xl bg-[#1A1A1A] p-5 md:p-6 border border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#D4AD54]" />
              <h3 className="font-luxury text-xl font-bold text-[#FFFFFF]">
                الموقع على الخريطة
              </h3>
            </div>
            <span className="text-xs text-[#D4AD54] font-semibold">
              📍 {business.location}
            </span>
          </div>

          {/* Interactive Map Visual Placeholder */}
          <div className="relative h-48 md:h-60 rounded-xl overflow-hidden border border-[#333333] bg-[#141414] flex items-center justify-center">
            {/* Map styling background */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#2E2E2E_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/40 via-transparent to-[#121212]/90" />

            {/* Algerian Map Pin Center */}
            <div className="relative z-10 flex flex-col items-center text-center p-4">
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#D4AD54]/20 animate-ping absolute" />
                <div className="w-10 h-10 rounded-full bg-[#D4AD54] flex items-center justify-center shadow-lg text-[#121212]">
                  <MapPin className="w-6 h-6 fill-current" />
                </div>
              </div>
              <h4 className="mt-3 font-bold text-sm text-[#FFFFFF]">{business.name}</h4>
              <p className="text-xs text-[#A3A3A3] mt-0.5">{business.address}</p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name + ' ' + business.address + ' ' + business.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 px-4 py-1.5 rounded-lg bg-[#262626] hover:bg-[#D4AD54] text-xs text-[#D4AD54] hover:text-[#121212] font-semibold flex items-center gap-1.5 transition-colors border border-[#404040]"
              >
                <span>فتح في Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* 7. DIRECT CONTACT SECTION */}
        <div className="rounded-2xl bg-gradient-to-b from-[#1C1C1C] to-[#141414] p-5 md:p-6 border border-[#2A2A2A]">
          <h3 className="font-luxury text-xl font-bold text-[#FFFFFF] mb-2">
            تواصل مباشرة مع صاحب القسم
          </h3>
          <p className="text-xs md:text-sm text-[#A3A3A3] mb-4 leading-relaxed">
            يمكنك الاتصال مباشرة أو إرسال بريد إلكتروني أو بدء محادثة فورية عبر واتساب لتأكيد توفر الموعد والأسعار.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Call */}
            <a
              id="detail-contact-call-btn"
              href={`tel:${business.phone}`}
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-[#1E1E1E] hover:bg-[#262626] border border-[#3A3A3A] text-sm font-bold text-[#FFFFFF] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#D4AD54]" />
              <span>اتصال هاتف</span>
            </a>

            {/* Email */}
            <a
              id="detail-contact-email-btn"
              href={`mailto:${business.email || 'contact@jourj.dz'}`}
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-[#1E1E1E] hover:bg-[#262626] border border-[#3A3A3A] text-sm font-bold text-[#FFFFFF] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#D4AD54]" />
              <span>البريد الإلكتروني</span>
            </a>

            {/* WhatsApp */}
            <a
              id="detail-contact-whatsapp-btn"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-[#15803d]/20 hover:bg-[#15803d]/30 border border-[#22c55e]/50 text-sm font-bold text-[#4ade80] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#22c55e] fill-current" />
              <span>محادثة WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar for Mobile Visitors */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#121212]/95 backdrop-blur-lg border-t border-[#262626] p-3 px-4 flex items-center justify-between gap-3 max-w-lg mx-auto md:hidden">
        <div>
          <div className="text-[10px] text-[#A3A3A3]">يبدأ من</div>
          <div className="text-sm font-bold text-[#D4AD54]">
            {business.price.toLocaleString()} {business.price_unit}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${business.phone}`}
            className="p-2.5 rounded-xl bg-[#1F1F1F] border border-[#3A3A3A] text-[#F7F5F0]"
            title="اتصال"
          >
            <Phone className="w-4 h-4" />
          </a>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AD54] to-[#B88E2D] text-[#121212] font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>تواصل عبر WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Portfolio Lightbox Modal */}
      <PortfolioLightbox
        items={portfolio}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
};
