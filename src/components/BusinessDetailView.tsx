import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  MapPin,
  Star,
  Clock,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  Share2,
  CheckCircle2,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { Business, Category, PortfolioItem, DayAvailability, AvailabilityStatus } from '../types';
import { DataService } from '../services/dataService';
import { CategoryCircleNav } from './CategoryCircleNav';
import { ReservationModal } from './ReservationModal';

interface BusinessDetailViewProps {
  businessId: string;
  onBack: () => void;
  onSelectBusiness?: (businessId: string) => void;
}

export const BusinessDetailView: React.FC<BusinessDetailViewProps> = ({
  businessId,
  onBack,
  onSelectBusiness
}) => {
  const [currentBizId, setCurrentBizId] = useState<string>(businessId);
  const [business, setBusiness] = useState<Business | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // Sept 2026 default
  const [calendarDays, setCalendarDays] = useState<DayAvailability[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayAvailability | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState<{ text: string; type: AvailabilityStatus } | null>(null);

  // Reservation Modal
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    setCurrentBizId(businessId);
  }, [businessId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadInitialData();
  }, [currentBizId]);

  useEffect(() => {
    if (business) {
      loadCalendarAvailability();
    }
  }, [business, currentDate]);

  const loadInitialData = async () => {
    const [cats, data] = await Promise.all([
      DataService.getCategories(),
      DataService.getBusinessById(currentBizId)
    ]);
    setCategories(cats);
    if (data) {
      setBusiness(data);
      setIsFavorite(DataService.isFavorite(data.id));
      const port = await DataService.getPortfolio(data.id);
      setPortfolio(port);
    }
  };

  const loadCalendarAvailability = async () => {
    if (!business) return;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = await DataService.getMonthlyAvailability(business.id, year, month);
    setCalendarDays(days);
  };

  const handleCategorySelect = async (categoryId: string) => {
    const allBusinesses = await DataService.getBusinesses();
    const matchingBusinesses = allBusinesses.filter(
      (b) => b.active && b.category_id.toLowerCase() === categoryId.toLowerCase()
    );

    if (matchingBusinesses.length > 0) {
      const targetBusiness = matchingBusinesses[0];
      setCurrentBizId(targetBusiness.id);
      if (onSelectBusiness) {
        onSelectBusiness(targetBusiness.id);
      }
      window.location.hash = `business/${targetBusiness.id}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleFavorite = () => {
    if (!business) return;
    const fav = DataService.toggleFavorite(business.id);
    setIsFavorite(fav);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${business?.name} — JOUR J`,
        text: `Découvrez ${business?.name} sur la plateforme de mariage JOUR J Oran`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleSelectDay = (day: DayAvailability) => {
    setSelectedDay(day);
    if (day.status === 'disponible') {
      setAvailabilityMessage({
        text: 'Date disponible pour votre événement.',
        type: 'disponible'
      });
    } else if (day.status === 'partiel') {
      setAvailabilityMessage({
        text: 'Date partiellement disponible. Certaines heures ou formules sont déjà prises.',
        type: 'partiel'
      });
    } else {
      setAvailabilityMessage({
        text: 'Cette date est déjà entièrement réservée.',
        type: 'reserve'
      });
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(null);
    setAvailabilityMessage(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(null);
    setAvailabilityMessage(null);
  };

  if (!business) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#D7B45A]">
        <div className="w-10 h-10 border-2 border-[#D7B45A] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs text-[#999999]">Chargement des détails...</span>
      </div>
    );
  }

  // Month header text in French
  const monthNamesFr = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const currentMonthLabel = `${monthNamesFr[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  // First day of month offset (Monday = 0)
  const firstDayIndex = (new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() + 6) % 7;

  return (
    <div className="min-h-screen bg-[#080808] text-[#F7F3EA] pb-32">
      
      {/* 1. CATEGORIES CIRCLES BAR (Positioned immediately below Header) */}
      <CategoryCircleNav
        categories={categories}
        activeCategoryId={business.category_id}
        onSelectCategory={handleCategorySelect}
      />

      {/* 2. HERO COVER IMAGE & TOP ACTIONS */}
      <div className="relative w-full h-[320px] sm:h-[400px] bg-[#151515] overflow-hidden">
        <img
          src={business.cover_image || business.main_image}
          alt={business.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-black/60" />

        {/* Top Floating Bar: Back + Favorite + Share */}
        <div className="absolute top-4 inset-x-4 max-w-4xl mx-auto flex items-center justify-between z-10">
          <button
            id="detail-back-btn"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-[#080808]/80 border border-[#222222] backdrop-blur-md flex items-center justify-center text-[#F7F3EA] hover:text-[#D7B45A] transition-all shadow-md active:scale-95"
            aria-label="Retour"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              id="detail-share-btn"
              onClick={handleShare}
              className="w-10 h-10 rounded-2xl bg-[#080808]/80 border border-[#222222] backdrop-blur-md flex items-center justify-center text-[#F7F3EA] hover:text-[#D7B45A] transition-all shadow-md active:scale-95"
              aria-label="Partager"
            >
              {copiedShare ? <CheckCircle2 className="w-5 h-5 text-[#4C9B67]" /> : <Share2 className="w-5 h-5" />}
            </button>

            <button
              id="detail-fav-btn"
              onClick={handleToggleFavorite}
              className={`w-10 h-10 rounded-2xl backdrop-blur-md flex items-center justify-center transition-all shadow-md active:scale-95 ${
                isFavorite
                  ? 'bg-[#B94B49] text-white border border-[#B94B49]'
                  : 'bg-[#080808]/80 border border-[#222222] text-[#999999] hover:text-[#D7B45A]'
              }`}
              aria-label="Favori"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Hero Overlay Info */}
        <div className="absolute bottom-4 inset-x-4 max-w-4xl mx-auto flex flex-col justify-end">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080808]/80 border border-[#D7B45A]/40 text-[11px] font-semibold text-[#D7B45A] mb-2 backdrop-blur-md w-fit">
            <span>{business.category_name || 'Service Mariage'}</span>
            <span>•</span>
            <span>Oran</span>
          </div>

          <h1 className="font-luxury text-2xl sm:text-4xl font-extrabold text-[#F7F3EA] leading-tight tracking-wide drop-shadow-md">
            {business.name}
          </h1>

          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#080808]/80 border border-[#222222] text-xs font-bold text-[#F7F3EA]">
              <Star className="w-3.5 h-3.5 fill-[#D7B45A] text-[#D7B45A]" />
              <span>{business.rating.toFixed(1)}</span>
              {business.reviews_count && (
                <span className="text-[11px] text-[#999999] font-normal">
                  ({business.reviews_count} avis)
                </span>
              )}
            </div>

            <div className="text-xs text-[#D7B45A] font-semibold font-luxury">
              À partir de {business.price.toLocaleString('fr-FR')} {business.price_unit}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-8">
        
        {/* Quick Contact Action Buttons: Appeler & WhatsApp */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Appeler */}
          <a
            id="detail-call-btn"
            href={`tel:${business.phone}`}
            className="flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-[#151515] border border-[#262626] hover:border-[#D7B45A]/50 text-sm font-bold text-[#F7F3EA] transition-all hover:bg-[#1C1C1C] active:scale-[0.98] shadow-md group"
          >
            <div className="w-8 h-8 rounded-full bg-[#D7B45A]/15 flex items-center justify-center text-[#D7B45A] group-hover:scale-110 transition-transform">
              <Phone className="w-4 h-4" />
            </div>
            <span>Appeler</span>
          </a>

          {/* WhatsApp */}
          <a
            id="detail-whatsapp-btn"
            href={`https://wa.me/${business.phone.replace(/[^0-9]/g, '')}?text=Bonjour%2C%20je%20vous%20contacte%20depuis%20la%20plateforme%20JOUR%20J%20concernant%20vos%20services.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-[#151515] border border-[#262626] hover:border-[#4C9B67]/60 text-sm font-bold text-[#F7F3EA] transition-all hover:bg-[#1C1C1C] active:scale-[0.98] shadow-md group"
          >
            <div className="w-8 h-8 rounded-full bg-[#4C9B67]/15 flex items-center justify-center text-[#4C9B67] group-hover:scale-110 transition-transform">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Description Section */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#151515] border border-[#222222] shadow-md">
          <h2 className="font-luxury text-base font-bold text-[#D7B45A] uppercase tracking-wider mb-2">
            Description du service
          </h2>
          <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed font-light">
            {business.description}
          </p>
        </div>

        {/* SECTION 6: Provider Info & Map (معلومات مقدم الخدمة) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#151515] border border-[#222222] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-luxury text-base font-bold text-[#D7B45A] uppercase tracking-wider">
              Localisation & Adresse
            </h2>
            <span className="text-xs text-[#999999]">Oran, Algérie</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#D7B45A]/15 border border-[#D7B45A]/30 flex items-center justify-center text-[#D7B45A] shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#F7F3EA]">
                {business.address}
              </p>
              <p className="text-[11px] text-[#888888] mt-0.5">
                Région : {business.location}
              </p>
            </div>
          </div>

          {/* Interactive Styled Map Card Preview */}
          <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden border border-[#2A2A2A] bg-[#0E0E0E] flex items-center justify-center group">
            {/* Visual Stylized Map Graphic */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />

            {/* Glowing Map Pin in Center */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#D7B45A] text-[#080808] flex items-center justify-center shadow-[0_0_20px_rgba(215,180,90,0.6)] animate-bounce">
                <MapPin className="w-5 h-5 fill-current" />
              </div>
              <span className="mt-1 px-3 py-1 rounded-full bg-[#080808]/90 text-[11px] font-bold text-[#D7B45A] border border-[#D7B45A]/40 backdrop-blur-md">
                {business.name}
              </span>
            </div>
          </div>

          {/* Google Maps External Button */}
          <a
            id="detail-open-gmaps-btn"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name + ' ' + business.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#080808] border border-[#2A2A2A] hover:border-[#D7B45A]/50 text-xs font-semibold text-[#D7B45A] transition-all hover:bg-[#121212]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ouvrir dans Google Maps</span>
          </a>
        </div>

        {/* SECTION 7: Portfolio (Grid 2 columns on mobile) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-luxury text-base font-bold text-[#D7B45A] uppercase tracking-wider">
              Portfolio & Réalisations
            </h2>
            <span className="text-xs text-[#999999]">{portfolio.length} photos</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {portfolio.map((item, index) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveLightboxIndex(index)}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#151515] border border-[#222222] hover:border-[#D7B45A]/50 cursor-pointer group shadow-sm"
              >
                <img
                  src={item.image_url}
                  alt={item.title || `Portfolio ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                  <span className="text-[11px] font-medium text-[#F7F3EA] truncate">
                    {item.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 8: Disponibilité / Calendar */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#151515] border border-[#222222] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#D7B45A]" />
              <h2 className="font-luxury text-base font-bold text-[#D7B45A] uppercase tracking-wider">
                Disponibilité
              </h2>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center gap-2">
              <button
                id="calendar-prev-month"
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-lg bg-[#080808] border border-[#2A2A2A] flex items-center justify-center text-[#999999] hover:text-[#F7F3EA]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-[#F7F3EA] min-w-[110px] text-center">
                {currentMonthLabel}
              </span>
              <button
                id="calendar-next-month"
                onClick={handleNextMonth}
                className="w-7 h-7 rounded-lg bg-[#080808] border border-[#2A2A2A] flex items-center justify-center text-[#999999] hover:text-[#F7F3EA]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers: Lun, Mar, Mer, Jeu, Ven, Sam, Dim */}
          <div className="grid grid-cols-7 gap-1 text-center font-luxury text-[10px] text-[#777777] font-semibold pb-1">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mer</span>
            <span>Jeu</span>
            <span>Ven</span>
            <span>Sam</span>
            <span>Dim</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-xl opacity-0" />
            ))}

            {/* Actual Month Days */}
            {calendarDays.map((day) => {
              const isSelected = selectedDay?.dayNumber === day.dayNumber;

              let statusDotColor = 'bg-[#4C9B67]'; // Disponible
              if (day.status === 'partiel') statusDotColor = 'bg-[#C89443]';
              if (day.status === 'reserve') statusDotColor = 'bg-[#B94B49]';

              return (
                <button
                  key={`day-${day.dayNumber}`}
                  id={`calendar-day-${day.dayNumber}`}
                  onClick={() => handleSelectDay(day)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all text-xs font-semibold ${
                    isSelected
                      ? 'bg-[#D7B45A] text-[#080808] font-bold shadow-[0_0_12px_rgba(215,180,90,0.4)] scale-105'
                      : 'bg-[#0E0E0E] text-[#E0E0E0] border border-[#222222] hover:border-[#D7B45A]/50'
                  }`}
                >
                  <span>{day.dayNumber}</span>
                  {/* Status dot */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      isSelected ? 'bg-[#080808]' : statusDotColor
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Color Legend (🟢 Disponible 🟠 Partiellement 🔴 Réservé) */}
          <div className="pt-3 border-t border-[#222222] flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-[#CCCCCC]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4C9B67]" />
              <span className="text-[11px]">Disponible</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#CCCCCC]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C89443]" />
              <span className="text-[11px]">Partiellement disponible</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#CCCCCC]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B94B49]" />
              <span className="text-[11px]">Réservé</span>
            </div>
          </div>

          {/* Interactive Selected Day Feedback */}
          {availabilityMessage && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between ${
                availabilityMessage.type === 'disponible'
                  ? 'bg-[#4C9B67]/10 border-[#4C9B67]/30 text-[#4C9B67]'
                  : availabilityMessage.type === 'partiel'
                  ? 'bg-[#C89443]/10 border-[#C89443]/30 text-[#C89443]'
                  : 'bg-[#B94B49]/10 border-[#B94B49]/30 text-[#B94B49]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Le {selectedDay?.dayNumber} {monthNamesFr[currentDate.getMonth()]} :</strong>{' '}
                  {availabilityMessage.text}
                </span>
              </div>

              {availabilityMessage.type !== 'reserve' && (
                <button
                  id="calendar-book-selected-date-btn"
                  onClick={() => setIsReservationOpen(true)}
                  className="px-3 py-1 rounded-xl bg-[#D7B45A] text-[#080808] font-bold text-[11px] shrink-0 ml-2"
                >
                  Réserver cette date
                </button>
              )}
            </motion.div>
          )}
        </div>

        {/* SECTION 9: Horaires (Working hours) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#151515] border border-[#222222] shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#D7B45A]" />
            <h2 className="font-luxury text-base font-bold text-[#D7B45A] uppercase tracking-wider">
              Horaires de réception & visites
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
            {/* Matin */}
            <div className="p-4 rounded-2xl bg-[#080808] border border-[#222222] flex flex-col items-center text-center">
              <span className="text-[11px] uppercase tracking-wider text-[#999999] font-medium">Matin</span>
              <span className="font-luxury text-sm font-bold text-[#F7F3EA] mt-1">
                {business.morning_hours || '08:00 — 12:00'}
              </span>
            </div>

            {/* Après-midi */}
            <div className="p-4 rounded-2xl bg-[#080808] border border-[#222222] flex flex-col items-center text-center">
              <span className="text-[11px] uppercase tracking-wider text-[#999999] font-medium">Après-midi</span>
              <span className="font-luxury text-sm font-bold text-[#F7F3EA] mt-1">
                {business.afternoon_hours || '14:00 — 19:00'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 10: FIXED BOTTOM RESERVATION BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#080808]/95 backdrop-blur-md border-t border-[#222222] p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#999999] block">Tarif estimé</span>
            <span className="font-luxury text-lg font-bold text-[#D7B45A]">
              {business.price.toLocaleString('fr-FR')} {business.price_unit}
            </span>
          </div>

          <button
            id="detail-main-reservation-btn"
            onClick={() => setIsReservationOpen(true)}
            className="flex-1 max-w-xs py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D7B45A] via-[#F0D38A] to-[#C89443] text-[#080808] font-luxury font-bold text-sm tracking-wider uppercase shadow-[0_4px_20px_rgba(215,180,90,0.3)] hover:shadow-[0_6px_25px_rgba(215,180,90,0.45)] active:scale-95 transition-all text-center"
          >
            Demander une réservation
          </button>
        </div>
      </div>

      {/* LIGHTBOX POPUP FOR PORTFOLIO */}
      <AnimatePresence>
        {activeLightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          >
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#151515] border border-[#333333] flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-w-3xl w-full max-h-[80vh] flex items-center justify-center">
              <img
                src={portfolio[activeLightboxIndex].image_url}
                alt={portfolio[activeLightboxIndex].title || 'Photo'}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-[#222222]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="mt-4 text-center">
              <p className="font-luxury text-sm font-semibold text-[#D7B45A]">
                {portfolio[activeLightboxIndex].title}
              </p>
              <p className="text-xs text-[#999999]">
                {activeLightboxIndex + 1} / {portfolio.length}
              </p>
            </div>

            {/* Prev / Next controls in Lightbox */}
            {portfolio.length > 1 && (
              <div className="absolute inset-y-1/2 inset-x-4 flex items-center justify-between pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : portfolio.length - 1));
                  }}
                  className="w-10 h-10 rounded-full bg-[#151515]/90 border border-[#333333] flex items-center justify-center text-white pointer-events-auto hover:text-[#D7B45A]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLightboxIndex((prev) => (prev! < portfolio.length - 1 ? prev! + 1 : 0));
                  }}
                  className="w-10 h-10 rounded-full bg-[#151515]/90 border border-[#333333] flex items-center justify-center text-white pointer-events-auto hover:text-[#D7B45A]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESERVATION MODAL */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        business={business}
        initialDate={selectedDay?.dateStr}
      />
    </div>
  );
};
