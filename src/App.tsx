import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Category, Business, RegistrationLink, Profile, PortfolioItem, Availability } from './types';
import { Header } from './components/Header';
import { VisitorHome } from './components/VisitorHome';
import { CategoryView } from './components/CategoryView';
import { BusinessDetailView } from './components/BusinessDetailView';
import { RegistrationView } from './components/RegistrationView';
import { AdminDashboard } from './components/AdminDashboard';
import { OwnerDashboard } from './components/OwnerDashboard';
import { LoginModal } from './components/LoginModal';

type ViewType = 'home' | 'category' | 'business' | 'register' | 'admin' | 'owner';

export default function App() {
  // Navigation & Routing state
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [registrationToken, setRegistrationToken] = useState<string | null>(null);

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [registrationLinks, setRegistrationLinks] = useState<RegistrationLink[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Business detail specific data
  const [businessPortfolio, setBusinessPortfolio] = useState<PortfolioItem[]>([]);
  const [businessAvailability, setBusinessAvailability] = useState<Availability[]>([]);

  // User session state
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Refresh and load all data
  const loadInitialData = async () => {
    try {
      const [cats, bizs, links, profs] = await Promise.all([
        api.getCategories(false).catch((err) => {
          console.error('❌ [JOUR J] Failed to load categories:', err);
          return [];
        }),
        api.adminGetBusinesses().catch((err) => {
          console.error('❌ [JOUR J] Failed to load businesses:', err);
          return [];
        }),
        api.adminGetRegistrationLinks().catch((err) => {
          console.error('❌ [JOUR J] Failed to load links:', err);
          return [];
        }),
        api.getProfiles().catch((err) => {
          console.error('❌ [JOUR J] Failed to load profiles:', err);
          return [];
        })
      ]);
      setCategories(cats);
      setBusinesses(bizs);
      setRegistrationLinks(links);
      setProfiles(profs);
    } catch (err) {
      console.error('❌ [JOUR J] Error loading data in App:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Safety timeout: Ensure page content reveals within 1000ms even on slow or restricted networks
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Subscribe to real-time updates across the platform (Supabase Realtime + Cross-Tab sync)
    const unsubscribe = api.subscribeToRealtime((payload) => {
      console.log('⚡ Realtime event received in App:', payload);
      loadInitialData();
    });

    // Check URL parameters for ?token=...
    try {
      if (typeof window !== 'undefined' && window.location) {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
          setRegistrationToken(token);
          setCurrentView('register');
        }
      }
    } catch {
      // ignore
    }

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  // When a business is selected, load its dedicated portfolio and availability
  useEffect(() => {
    if (selectedBusinessId) {
      api.getPortfolio(selectedBusinessId)
        .then(setBusinessPortfolio)
        .catch(err => {
          console.error('❌ [JOUR J] Error loading business portfolio:', err);
          setBusinessPortfolio([]);
        });
      api.getAvailability(selectedBusinessId)
        .then(setBusinessAvailability)
        .catch(err => {
          console.error('❌ [JOUR J] Error loading business availability:', err);
          setBusinessAvailability([]);
        });
    }
  }, [selectedBusinessId]);

  // Navigation handlers
  const handleNavigate = (view: string, param?: string) => {
    if (view === 'home') {
      setSelectedCategoryId(null);
      setSelectedBusinessId(null);
      setCurrentView('home');
      // clean url query if any
      window.history.replaceState({}, '', window.location.pathname);
    } else if (view === 'category' && param) {
      setSelectedCategoryId(param);
      setSelectedBusinessId(null);
      setCurrentView('category');
    } else if (view === 'business' && param) {
      setSelectedBusinessId(param);
      setCurrentView('business');
    } else if (view === 'admin') {
      setCurrentView('admin');
    } else if (view === 'owner') {
      setCurrentView('owner');
    } else if (view === 'register') {
      if (param) setRegistrationToken(param);
      setCurrentView('register');
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedBusinessId(null);
    setCurrentView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBusiness = (businessId: string) => {
    setSelectedBusinessId(businessId);
    setCurrentView('business');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistrationSuccess = (profile: Profile, business: Business) => {
    setCurrentUser(profile);
    setSelectedBusinessId(business.id);
    setSelectedCategoryId(business.category_id);
    // Reload data so business appears everywhere
    loadInitialData();
    // Direct owner to their dedicated dashboard
    setCurrentView('owner');
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  // Active Category & Business resolution
  const activeCategory = categories.find(c => c.id === selectedCategoryId) || null;
  const activeBusiness = businesses.find(b => b.id === selectedBusinessId) || null;

  return (
    <div className="min-h-screen bg-[#080808] text-[#F7F3EA] flex flex-col justify-between selection:bg-[#D7B45A] selection:text-[#080808]">
      {/* Ambient Luxury Lighting */}
      <div 
        className="fixed -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none blur-[140px] opacity-25 z-0"
        style={{
          background: 'radial-gradient(circle, rgba(215, 180, 90, 0.45) 0%, rgba(138, 107, 39, 0.2) 50%, transparent 80%)'
        }}
      />

      {/* Global Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 w-full pb-12">
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#D7B45A] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-[#888]">جارٍ تحميل منصة JOUR J...</p>
          </div>
        ) : (
          <>
            {/* VIEW 1: VISITOR HOME */}
            {currentView === 'home' && (
              <VisitorHome
                categories={categories.filter(c => c.active)}
                businesses={businesses}
                onSelectCategory={handleSelectCategory}
                onOpenTokenPrompt={() => setIsLoginModalOpen(true)}
              />
            )}

            {/* VIEW 2: CATEGORY VIEW (Businesses inside this category) */}
            {currentView === 'category' && (
              activeCategory ? (
                <CategoryView
                  category={activeCategory}
                  allCategories={categories.filter(c => c.active)}
                  businesses={businesses}
                  onSelectCategory={handleSelectCategory}
                  onSelectBusiness={handleSelectBusiness}
                  onBackToHome={() => handleNavigate('home')}
                />
              ) : (
                <div className="w-full max-w-md mx-auto my-12 p-8 text-center bg-[#141414] rounded-2xl border border-[#2b2b2b] space-y-4">
                  <p className="text-sm text-[#aaa]">لم يتم العثور على الفئة المطلوبة.</p>
                  <button
                    onClick={() => handleNavigate('home')}
                    className="px-5 py-2.5 rounded-xl bg-[#D7B45A] text-[#111] font-bold text-xs cursor-pointer"
                  >
                    العودة للرئيسية
                  </button>
                </div>
              )
            )}

            {/* VIEW 3: SINGLE BUSINESS DETAILS */}
            {currentView === 'business' && (
              activeBusiness ? (
                <BusinessDetailView
                  business={activeBusiness}
                  category={categories.find(c => c.id === activeBusiness.category_id) || null}
                  portfolio={businessPortfolio}
                  availability={businessAvailability}
                  onBackToCategory={() => {
                    if (activeBusiness.category_id) {
                      handleSelectCategory(activeBusiness.category_id);
                    } else {
                      handleNavigate('home');
                    }
                  }}
                />
              ) : (
                <div className="w-full max-w-md mx-auto my-12 p-8 text-center bg-[#141414] rounded-2xl border border-[#2b2b2b] space-y-4">
                  <p className="text-sm text-[#aaa]">لم يتم العثور على المؤسسة المطلوبة.</p>
                  <button
                    onClick={() => handleNavigate('home')}
                    className="px-5 py-2.5 rounded-xl bg-[#D7B45A] text-[#111] font-bold text-xs cursor-pointer"
                  >
                    العودة للرئيسية
                  </button>
                </div>
              )
            )}

            {/* VIEW 4: REGISTRATION VIEW VIA TOKEN */}
            {currentView === 'register' && (
              registrationToken ? (
                <RegistrationView
                  token={registrationToken}
                  onSuccess={handleRegistrationSuccess}
                  onCancel={() => handleNavigate('home')}
                />
              ) : (
                <div className="w-full max-w-md mx-auto my-12 p-8 text-center bg-[#141414] rounded-2xl border border-[#2b2b2b] space-y-4">
                  <p className="text-sm text-[#aaa]">يرجى إدخال رمز دعوة صالح للتسجيل.</p>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#D7B45A] text-[#111] font-bold text-xs cursor-pointer"
                  >
                    إدخال رمز الدعوة
                  </button>
                </div>
              )
            )}

            {/* VIEW 5: ADMIN DASHBOARD */}
            {currentView === 'admin' && (
              <AdminDashboard
                categories={categories}
                businesses={businesses}
                registrationLinks={registrationLinks}
                profiles={profiles}
                onRefreshData={loadInitialData}
                onTestRegisterLink={(token) => {
                  setRegistrationToken(token);
                  setCurrentView('register');
                }}
              />
            )}

            {/* VIEW 6: OWNER DASHBOARD */}
            {currentView === 'owner' && (
              currentUser ? (
                <OwnerDashboard
                  currentUser={currentUser}
                  onPreviewBusiness={(bizId) => handleSelectBusiness(bizId)}
                  onRefreshData={loadInitialData}
                />
              ) : (
                <div className="w-full max-w-md mx-auto my-12 p-8 text-center bg-[#141414] rounded-2xl border border-[#2b2b2b] space-y-4">
                  <p className="text-sm text-[#aaa]">يرجى تسجيل الدخول للوصول إلى لوحة المالك.</p>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#D7B45A] text-[#111] font-bold text-xs cursor-pointer"
                  >
                    تسجيل الدخول
                  </button>
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* Global Footer */}
      <footer className="w-full border-t border-[#1a1a1a] bg-[#0c0c0c] py-6 px-4 text-center relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-[#F7F3EA] uppercase tracking-widest">
              JOUR <span className="text-[#D7B45A]">J</span>
            </span>
            <span className="text-[10px] text-[#D7B45A]">♡</span>
            <span className="text-[11px] text-[#777]">LE MOMENT QU'ON ATTEND</span>
          </div>

          <p className="text-[11px] text-[#666]">
            وهران، الجزائر · منصة تنظيم الأعراس والمناسبات الفاخرة
          </p>

          <div className="flex items-center gap-3 text-xs text-[#888]">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-[#D7B45A] hover:underline"
            >
              دخول المشرفين والملاك ⚙️
            </button>
          </div>
        </div>
      </footer>

      {/* Login & Token Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        profiles={profiles}
        businesses={businesses}
        categories={categories}
        registrationLinks={registrationLinks}
        onSelectUser={(profile) => {
          setCurrentUser(profile);
          if (profile.role === 'admin') {
            setCurrentView('admin');
          } else {
            setCurrentView('owner');
          }
        }}
        onEnterToken={(token) => {
          setRegistrationToken(token);
          setCurrentView('register');
        }}
      />
    </div>
  );
}
