import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Building2,
  CalendarCheck,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { AppView, Category, Business, UserProfile } from './types';
import { DataService } from './services/dataService';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { DrawerMenu } from './components/DrawerMenu';
import { CategoryScroll } from './components/CategoryScroll';
import { HeroSection } from './components/HeroSection';
import { BusinessCard } from './components/BusinessCard';
import { BusinessDetailView } from './components/BusinessDetailView';
import { BottomNav } from './components/BottomNav';
import { LoginModal } from './components/LoginModal';
import { QuickConciergeModal } from './components/QuickConciergeModal';
import { FavoritesView } from './components/FavoritesView';
import { MyBookingsView } from './components/MyBookingsView';
import { ProfileView } from './components/ProfileView';
import { AdminDashboard } from './components/AdminDashboard';
import { OwnerLoginView } from './components/OwnerLoginView';
import { OwnerRegisterView } from './components/OwnerRegisterView';
import { OwnerDashboard } from './components/OwnerDashboard';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation & View States
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash) {
      if (hash.startsWith('business/')) return 'business_detail';
      if (hash === 'favorites') return 'favorites';
      if (hash === 'reservations') return 'reservations';
      if (hash === 'moi') return 'moi';
      if (hash === 'admin') return 'admin';
      if (hash.startsWith('owner/register/')) return 'owner_register';
      if (hash.startsWith('owner')) return 'owner_login';
      return 'home';
    }
    return 'splash';
  });

  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash.startsWith('business/')) {
      return hash.replace('business/', '');
    }
    return null;
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [registrationToken, setRegistrationToken] = useState<string>('');

  // Modals & Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isConciergeModalOpen, setIsConciergeModalOpen] = useState(false);

  // Authentication & Favorites
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Initial routing and hash parser
  useEffect(() => {
    // Check local user session
    const activeUser = DataService.getActiveUser();
    if (activeUser) {
      setCurrentUser(activeUser);
    }
    setFavorites(DataService.getFavorites());

    // Parse URL Hash
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) {
        // Keep current view or home
        return;
      }

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
      } else if (hash === 'favorites') {
        setCurrentView('favorites');
      } else if (hash === 'reservations') {
        setCurrentView('reservations');
      } else if (hash === 'moi') {
        setCurrentView('moi');
      } else if (hash === 'home') {
        setCurrentView('home');
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
    setFavorites(DataService.getFavorites());
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    if (view === 'home') {
      setSelectedCategoryId(null);
      setSelectedBusinessId(null);
      window.location.hash = 'home';
    } else if (view === 'favorites') {
      window.location.hash = 'favorites';
    } else if (view === 'reservations') {
      window.location.hash = 'reservations';
    } else if (view === 'moi') {
      window.location.hash = 'moi';
    } else if (view === 'admin') {
      window.location.hash = 'admin';
    } else if (view === 'owner_login') {
      window.location.hash = 'owner/login';
    } else if (view === 'owner_dashboard') {
      window.location.hash = 'owner/dashboard';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterFromSplash = () => {
    setCurrentView('home');
    window.location.hash = 'home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBusiness = (businessId: string) => {
    setSelectedBusinessId(businessId);
    setCurrentView('business_detail');
    window.location.hash = `business/${businessId}`;
  };

  const handleToggleFavorite = (bizId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    DataService.toggleFavorite(bizId);
    setFavorites(DataService.getFavorites());
  };

  const handleOwnerAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    DataService.setActiveUser(user);
    setCurrentView('owner_dashboard');
    window.location.hash = 'owner/dashboard';
    refreshData();
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    DataService.setActiveUser(user);
    refreshData();
  };

  const handleLogout = () => {
    DataService.logout();
    setCurrentUser(null);
    setCurrentView('home');
    window.location.hash = 'home';
  };

  const handleNavigateToTokenRegister = (token: string) => {
    setRegistrationToken(token);
    setCurrentView('owner_register');
    window.location.hash = `owner/register/${token}`;
  };

  // Filter businesses by Category and Search
  const filteredBusinesses = businesses.filter((b) => {
    if (!b.active) return false;
    if (selectedCategoryId && b.category_id !== selectedCategoryId) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = b.name.toLowerCase().includes(q);
      const titleMatch = (b.title || '').toLowerCase().includes(q);
      const descMatch = (b.description || '').toLowerCase().includes(q);
      const locMatch = (b.location || '').toLowerCase().includes(q) || (b.address || '').toLowerCase().includes(q);
      const catMatch = (categories.find(c => c.id === b.category_id)?.name || '').toLowerCase().includes(q);
      return nameMatch || titleMatch || descMatch || locMatch || catMatch;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#080808] text-[#F7F3EA] selection:bg-[#D7B45A] selection:text-[#080808]">
      
      {/* 1. SPLASH SCREEN (Accès Initial) */}
      {currentView === 'splash' && (
        <SplashScreen onEnter={handleEnterFromSplash} />
      )}

      {/* 2. TOP NAVBAR & DRAWER */}
      {currentView !== 'splash' && (
        <>
          <Navbar
            currentView={currentView}
            currentUser={currentUser}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onNavigate={handleNavigate}
          />

          <DrawerMenu
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onLogout={handleLogout}
          />
        </>
      )}

      {/* 3. APP BODY */}
      <main className="flex-1">
        
        {/* PUBLIC VISITOR HOME VIEW */}
        {currentView === 'home' && (
          <div className="pb-28">
            
            {/* Category Scroll Bar (Horizontal Smooth Scroll) */}
            <CategoryScroll
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />

            {/* Hero Section Banner */}
            <HeroSection />

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto px-4 pt-4 space-y-6">
              
              {/* Search Bar */}
              <div className="relative">
                <input
                  id="home-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une salle, photographe, traiteur à Oran..."
                  className="w-full rounded-2xl bg-[#151515] border border-[#262626] focus:border-[#D7B45A] px-4 py-3.5 pl-11 text-xs text-[#F7F3EA] outline-none shadow-inner transition-colors placeholder:text-[#666666]"
                />
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#777777]" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-3.5 text-xs text-[#888888] hover:text-[#D7B45A]"
                  >
                    Effacer
                  </button>
                )}
              </div>

              {/* Title Row: "Services populaires" & "Oran" */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D7B45A]" />
                  <h2 className="font-luxury text-lg sm:text-xl font-bold tracking-wide text-[#F7F3EA] uppercase">
                    Services populaires
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151515] border border-[#2A2A2A] text-xs font-semibold text-[#D7B45A]">
                  <MapPin className="w-3 h-3 text-[#D7B45A]" />
                  <span>Oran</span>
                </div>
              </div>

              {/* Business Cards Grid */}
              {loading ? (
                <div className="text-center py-16 text-[#D7B45A]">
                  <div className="w-8 h-8 border-2 border-[#D7B45A] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span className="text-xs text-[#999999]">Chargement des prestataires...</span>
                </div>
              ) : filteredBusinesses.length === 0 ? (
                <div className="rounded-3xl bg-[#151515] p-10 border border-[#222222] text-center space-y-3">
                  <SlidersHorizontal className="w-10 h-10 text-[#555555] mx-auto" />
                  <h4 className="font-luxury font-bold text-base text-[#F7F3EA]">
                    Aucun prestataire trouvé
                  </h4>
                  <p className="text-xs text-[#888888] max-w-xs mx-auto">
                    Essayez d'autres mots-clés ou réinitialisez les filtres par catégorie.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategoryId(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-[#222222] text-xs font-semibold text-[#D7B45A] hover:bg-[#2A2A2A]"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {filteredBusinesses.map((biz) => (
                    <BusinessCard
                      key={biz.id}
                      business={biz}
                      isFavorite={favorites.includes(biz.id)}
                      onToggleFavorite={(e) => handleToggleFavorite(biz.id, e)}
                      onClick={() => handleSelectBusiness(biz.id)}
                    />
                  ))}
                </div>
              )}

              {/* Trust & Prestige Banner */}
              <div className="rounded-3xl bg-[#121212] p-6 border border-[#222222] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-8">
                <div className="p-3">
                  <ShieldCheck className="w-6 h-6 text-[#D7B45A] mx-auto mb-2" />
                  <h4 className="font-luxury font-bold text-xs sm:text-sm text-[#F7F3EA]">
                    Prestataires Certifiés
                  </h4>
                  <p className="text-[11px] text-[#777777] mt-1">
                    Sélection rigoureuse des meilleurs professionnels d'Oran.
                  </p>
                </div>

                <div className="p-3 border-y sm:border-y-0 sm:border-x border-[#222222]">
                  <CalendarCheck className="w-6 h-6 text-[#D7B45A] mx-auto mb-2" />
                  <h4 className="font-luxury font-bold text-xs sm:text-sm text-[#F7F3EA]">
                    Contact & Réservation Directe
                  </h4>
                  <p className="text-[11px] text-[#777777] mt-1">
                    Appel, WhatsApp et calendrier en temps réel sans intermédiaire.
                  </p>
                </div>

                <div className="p-3">
                  <Sparkles className="w-6 h-6 text-[#D7B45A] mx-auto mb-2" />
                  <h4 className="font-luxury font-bold text-xs sm:text-sm text-[#F7F3EA]">
                    Tarifs Transparents
                  </h4>
                  <p className="text-[11px] text-[#777777] mt-1">
                    Prix clairs et forfaits adaptés en Dinars Algériens (DA).
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* BUSINESS DETAIL VIEW */}
        {currentView === 'business_detail' && selectedBusinessId && (
          <BusinessDetailView
            businessId={selectedBusinessId}
            onBack={() => handleNavigate('home')}
            onSelectBusiness={handleSelectBusiness}
          />
        )}

        {/* FAVORITES VIEW */}
        {currentView === 'favorites' && (
          <FavoritesView
            onBack={() => handleNavigate('home')}
            onSelectBusiness={handleSelectBusiness}
          />
        )}

        {/* MY BOOKINGS VIEW */}
        {currentView === 'reservations' && (
          <MyBookingsView
            onBack={() => handleNavigate('home')}
            onSelectBusiness={handleSelectBusiness}
          />
        )}

        {/* PROFILE / MON ESPACE VIEW */}
        {currentView === 'moi' && (
          currentUser ? (
            <ProfileView
              user={currentUser}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              onBack={() => handleNavigate('home')}
            />
          ) : (
            <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#151515] border border-[#D7B45A]/40 flex items-center justify-center text-[#D7B45A] mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="font-luxury text-xl font-bold text-[#F7F3EA]">
                Mon Espace Mariage
              </h2>
              <p className="text-xs text-[#999999]">
                Connectez-vous pour retrouver vos réservations et vos prestataires enregistrés.
              </p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#D7B45A] via-[#F0D38A] to-[#C89443] text-[#080808] font-luxury font-bold text-xs uppercase"
              >
                Se connecter
              </button>
            </div>
          )
        )}

        {/* ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          <AdminDashboard
            user={currentUser}
            onLogout={handleLogout}
            onNavigateToTokenRegister={handleNavigateToTokenRegister}
            onNavigateToHome={() => handleNavigate('home')}
          />
        )}

        {/* OWNER REGISTRATION VIEW */}
        {currentView === 'owner_register' && (
          <OwnerRegisterView
            token={registrationToken}
            onSuccess={handleOwnerAuthSuccess}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {/* OWNER LOGIN VIEW */}
        {currentView === 'owner_login' && (
          <OwnerLoginView
            onSuccess={handleOwnerAuthSuccess}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {/* OWNER DASHBOARD */}
        {currentView === 'owner_dashboard' && currentUser && (
          <OwnerDashboard
            user={currentUser}
            onPreview={handleSelectBusiness}
            onLogout={handleLogout}
          />
        )}

      </main>

      {/* 4. FIXED BOTTOM NAVIGATION BAR */}
      {currentView !== 'splash' && currentView !== 'business_detail' && (
        <BottomNav
          currentView={currentView}
          currentUser={currentUser}
          onNavigate={handleNavigate}
          onOpenConcierge={() => setIsConciergeModalOpen(true)}
          onOpenLogin={() => setIsLoginModalOpen(true)}
        />
      )}

      {/* 5. GLOBAL FOOTER */}
      {currentView !== 'splash' && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* 6. MODALS */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <QuickConciergeModal
        isOpen={isConciergeModalOpen}
        onClose={() => setIsConciergeModalOpen(false)}
      />

    </div>
  );
}
