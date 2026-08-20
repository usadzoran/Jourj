import { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Search,
  SlidersHorizontal,
  Building2,
  CalendarCheck
} from 'lucide-react';
import { AppView, Category, Business, UserProfile } from './types';
import { DataService } from './services/dataService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CategoryCard } from './components/CategoryCard';
import { BusinessCard } from './components/BusinessCard';
import { BusinessDetailView } from './components/BusinessDetailView';
import { AdminDashboard } from './components/AdminDashboard';
import { OwnerLoginView } from './components/OwnerLoginView';
import { OwnerRegisterView } from './components/OwnerRegisterView';
import { OwnerDashboard } from './components/OwnerDashboard';
import { PWAInstallBanner } from './components/PWAInstallBanner';

export default function App() {
  // Navigation & View States
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [registrationToken, setRegistrationToken] = useState<string>('');

  // Authentication
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Initial routing and hash parser
  useEffect(() => {
    // Check local session
    const activeUser = DataService.getActiveUser();
    if (activeUser) {
      setCurrentUser(activeUser);
    }

    // Parse URL Hash for direct link support (e.g. #owner/register/ABC123XYZ or #admin)
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash.startsWith('owner/register/')) {
        const token = hash.replace('owner/register/', '');
        if (token) {
          setRegistrationToken(token);
          setCurrentView('owner_register');
        }
      } else if (hash === 'admin') {
        setCurrentView('admin');
      } else if (hash === 'owner/login' || hash === 'owner-login') {
        setCurrentView('owner_login');
      } else if (hash === 'owner/dashboard' || hash === 'owner-dashboard') {
        if (activeUser?.role === 'owner') {
          setCurrentView('owner_dashboard');
        } else {
          setCurrentView('owner_login');
        }
      } else if (hash.startsWith('business/')) {
        const id = hash.replace('business/', '');
        setSelectedBusinessId(id);
        setCurrentView('business_detail');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);

    // Load initial categories & businesses
    const loadInitialData = async () => {
      setLoading(true);
      const cats = await DataService.getCategories();
      const bizs = await DataService.getBusinesses();
      setCategories(cats);
      setBusinesses(bizs);
      setLoading(false);
    };

    loadInitialData();

    return () => {
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  const refreshData = async () => {
    const cats = await DataService.getCategories();
    const bizs = await DataService.getBusinesses();
    setCategories(cats);
    setBusinesses(bizs);
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    if (view === 'home') {
      setSelectedCategoryId(null);
      setSelectedBusinessId(null);
      window.location.hash = '';
    } else if (view === 'admin') {
      window.location.hash = 'admin';
    } else if (view === 'owner_login') {
      window.location.hash = 'owner/login';
    } else if (view === 'owner_dashboard') {
      window.location.hash = 'owner/dashboard';
    }
    window.scrollTo(0, 0);
  };

  const handleSelectBusiness = (businessId: string) => {
    setSelectedBusinessId(businessId);
    setCurrentView('business_detail');
    window.location.hash = `business/${businessId}`;
    window.scrollTo(0, 0);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    window.scrollTo(0, 0);
  };

  const handleOwnerAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentView('owner_dashboard');
    window.location.hash = 'owner/dashboard';
    refreshData();
  };

  const handleLogout = () => {
    DataService.logout();
    setCurrentUser(null);
    setCurrentView('home');
    window.location.hash = '';
  };

  const handleNavigateToTokenRegister = (token: string) => {
    setRegistrationToken(token);
    setCurrentView('owner_register');
    window.location.hash = `owner/register/${token}`;
  };

  // Filter businesses
  const filteredBusinesses = businesses.filter(b => {
    if (!b.active) return false;
    if (selectedCategoryId && b.category_id !== selectedCategoryId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = b.name.toLowerCase().includes(q);
      const titleMatch = (b.title || '').toLowerCase().includes(q);
      const locMatch = (b.location || '').toLowerCase().includes(q);
      const catMatch = (categories.find(c => c.id === b.category_id)?.name || '').toLowerCase().includes(q);
      return nameMatch || titleMatch || locMatch || catMatch;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-[#F7F5F0]">
      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        currentUser={currentUser}
        onNavigate={handleNavigate}
      />

      {/* App Body Content */}
      <main className="flex-1">
        {/* 2. PUBLIC VISITOR HOME VIEW */}
        {currentView === 'home' && (
          <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1E1B14] via-[#171717] to-[#141414] border border-[#D4AD54]/40 p-6 md:p-10 shadow-2xl text-center">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#D4AD54]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121212]/80 border border-[#D4AD54]/40 text-xs font-semibold text-[#D4AD54] mb-4 backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5 text-[#D4AD54]" />
                <span>الجزائر • وهران (Oran)</span>
              </div>

              <h1 className="font-luxury text-3xl md:text-5xl font-extrabold text-[#FFFFFF] tracking-tight">
                اكتشف الأقسام
              </h1>

              <p className="font-luxury text-base md:text-xl text-[#E5C378] mt-2 italic">
                اختر المكان المناسب ليومك المميز
              </p>

              <p className="text-xs md:text-sm text-[#A3A3A3] mt-2 max-w-lg mx-auto leading-relaxed">
                دليلك المباشر لحجز أفخم قاعات الأعراس وبوفيهات الـTraiteur الملكية بدون وسيط وبدون تسجيل
              </p>

              {/* Search & Filter Bar */}
              <div className="mt-6 max-w-md mx-auto relative">
                <input
                  id="home-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن قاعة، طعام Traiteur، أو عنوان..."
                  className="w-full rounded-2xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-3.5 pr-11 text-sm text-[#F7F5F0] outline-none shadow-inner transition-colors"
                />
                <Search className="absolute right-4 top-4 w-4 h-4 text-[#737373]" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3.5 top-3.5 text-xs text-[#737373] hover:text-[#D4AD54]"
                  >
                    مسح
                  </button>
                )}
              </div>
            </div>

            {/* Section 1: Categories Cards (الأقسام) */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AD54]" />
                  <h2 className="font-luxury text-2xl font-bold text-[#FFFFFF]">
                    الأقسام الرئيسية
                  </h2>
                </div>

                {selectedCategoryId && (
                  <button
                    onClick={() => setSelectedCategoryId(null)}
                    className="text-xs text-[#D4AD54] hover:underline"
                  >
                    عرض جميع الأقسام
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {categories
                  .filter(c => c.active)
                  .map((cat) => {
                    const count = businesses.filter(b => b.category_id === cat.id && b.active).length;
                    const rating = cat.id === 'wedding-halls' ? 4.9 : 4.8;

                    return (
                      <CategoryCard
                        key={cat.id}
                        category={cat}
                        rating={rating}
                        count={count}
                        onClick={() => handleSelectCategory(cat.id)}
                      />
                    );
                  })}
              </div>
            </div>

            {/* Section 2: Venues & Services (الأماكن والخدمات) */}
            <div className="pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className="font-luxury text-2xl font-bold text-[#FFFFFF]">
                    {selectedCategoryId
                      ? categories.find(c => c.id === selectedCategoryId)?.name
                      : 'أفضل الأماكن والخدمات في وهران'}
                  </h3>
                  <p className="text-xs text-[#A3A3A3] mt-1">
                    {filteredBusinesses.length} خيارات متوفرة للحجز المباشر
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    onClick={() => setSelectedCategoryId(null)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategoryId === null
                        ? 'bg-[#D4AD54] text-[#121212]'
                        : 'bg-[#1C1C1C] text-[#A3A3A3] hover:text-[#FFFFFF]'
                    }`}
                  >
                    الكل ({businesses.filter(b => b.active).length})
                  </button>

                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedCategoryId === cat.id
                          ? 'bg-[#D4AD54] text-[#121212]'
                          : 'bg-[#1C1C1C] text-[#A3A3A3] hover:text-[#FFFFFF]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12 text-[#D4AD54]">
                  <div className="w-8 h-8 border-2 border-[#D4AD54] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span className="text-xs text-[#A3A3A3]">جاري تحميل الخدمات...</span>
                </div>
              ) : filteredBusinesses.length === 0 ? (
                <div className="rounded-2xl bg-[#1A1A1A] p-10 border border-[#2A2A2A] text-center">
                  <SlidersHorizontal className="w-10 h-10 text-[#525252] mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-[#FFFFFF]">لا توجد نتائج مطابقة</h4>
                  <p className="text-xs text-[#737373] mt-1">
                    جرب البحث بكلمات أخرى أو اختر قسمًا مختلفًا.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategoryId(null);
                    }}
                    className="mt-3 px-4 py-1.5 rounded-xl bg-[#262626] text-xs text-[#D4AD54]"
                  >
                    إعادة ضبط الفلاتر
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                  {filteredBusinesses.map((biz) => (
                    <BusinessCard
                      key={biz.id}
                      business={biz}
                      categoryName={categories.find(c => c.id === biz.category_id)?.name}
                      onClick={() => handleSelectBusiness(biz.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Trust & Guarantee Banner */}
            <div className="rounded-2xl bg-[#171717] p-6 border border-[#262626] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-3">
                <Building2 className="w-6 h-6 text-[#D4AD54] mx-auto mb-2" />
                <h4 className="font-bold text-sm text-[#FFFFFF]">أماكن موثوقة ومعتمدة</h4>
                <p className="text-[11px] text-[#737373] mt-1">
                  معاينة دقيقة للصالات وتجهيزات البوفيه الفاخرة
                </p>
              </div>
              <div className="p-3 border-y sm:border-y-0 sm:border-x border-[#262626]">
                <CalendarCheck className="w-6 h-6 text-[#D4AD54] mx-auto mb-2" />
                <h4 className="font-bold text-sm text-[#FFFFFF]">تواصل وحجز مباشر</h4>
                <p className="text-[11px] text-[#737373] mt-1">
                  اتصال وواتساب مع صاحب المكان بدون رسوم وسيط
                </p>
              </div>
              <div className="p-3">
                <Sparkles className="w-6 h-6 text-[#D4AD54] mx-auto mb-2" />
                <h4 className="font-bold text-sm text-[#FFFFFF]">أسعار واضحة بالدينار</h4>
                <p className="text-[11px] text-[#737373] mt-1">
                  شفافية كاملة في الأسعار والوحدات (DZD)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. BUSINESS DETAIL VIEW */}
        {currentView === 'business_detail' && selectedBusinessId && (
          <BusinessDetailView
            businessId={selectedBusinessId}
            onBack={() => handleNavigate('home')}
          />
        )}

        {/* 4. ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          <AdminDashboard
            user={currentUser}
            onLogout={handleLogout}
            onNavigateToTokenRegister={handleNavigateToTokenRegister}
            onNavigateToHome={() => handleNavigate('home')}
          />
        )}

        {/* 5. OWNER REGISTRATION VIEW (via Token invitation) */}
        {currentView === 'owner_register' && (
          <OwnerRegisterView
            token={registrationToken}
            onSuccess={handleOwnerAuthSuccess}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {/* 6. OWNER LOGIN VIEW */}
        {currentView === 'owner_login' && (
          <OwnerLoginView
            onSuccess={handleOwnerAuthSuccess}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {/* 7. OWNER DASHBOARD */}
        {currentView === 'owner_dashboard' && currentUser && (
          <OwnerDashboard
            user={currentUser}
            onPreview={handleSelectBusiness}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* PWA Mobile Install Floating Banner */}
      <PWAInstallBanner />

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
