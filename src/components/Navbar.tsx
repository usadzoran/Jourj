import React from 'react';
import { Sparkles, Shield, UserCheck } from 'lucide-react';
import { UserProfile, AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  currentUser: UserProfile | null;
  onNavigate: (view: AppView) => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  currentUser,
  onNavigate
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#121212]/90 backdrop-blur-md border-b border-[#262626] transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Slogan */}
        <div
          id="navbar-brand-logo"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-full border border-[#D4AD54]/50 flex items-center justify-center bg-gradient-to-b from-[#1C1C1C] to-[#121212] shadow-sm group-hover:border-[#D4AD54] transition-colors">
            <span className="font-luxury text-lg font-bold text-[#D4AD54] italic">
              J
            </span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-luxury text-xl font-bold tracking-tight text-[#FFFFFF] group-hover:text-[#D4AD54] transition-colors">
                jour <span className="text-[#D4AD54]">j</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#D4AD54] bg-[#D4AD54]/10 border border-[#D4AD54]/20 px-1.5 py-0.5 rounded">
                وهران
              </span>
            </div>
            <span className="font-luxury text-[10px] text-[#A3A3A3] italic tracking-wider -mt-0.5">
              Le moment qu'on attend
            </span>
          </div>
        </div>

        {/* Right Navigation & Subtle Partner Portals */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Public Visitors Navigation */}
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              currentView === 'home'
                ? 'bg-[#D4AD54]/15 text-[#D4AD54] border border-[#D4AD54]/30'
                : 'text-[#D4D4D4] hover:text-[#FFFFFF]'
            }`}
          >
            الرئيسية
          </button>

          {/* If Logged in as Owner */}
          {currentUser?.role === 'owner' && (
            <button
              onClick={() => onNavigate('owner_dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                currentView === 'owner_dashboard'
                  ? 'bg-[#D4AD54] text-[#121212]'
                  : 'bg-[#262626] text-[#E5C378] hover:bg-[#333333]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>لوحة قسمي</span>
            </button>
          )}

          {/* If Logged in as Admin */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                currentView === 'admin'
                  ? 'bg-[#D4AD54] text-[#121212]'
                  : 'bg-[#262626] text-[#E5C378] hover:bg-[#333333]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>لوحة الإدارة</span>
            </button>
          )}

          {/* Discreet Access to Owner Login if not logged in (Kept subtle for general visitors) */}
          {!currentUser && currentView !== 'owner_login' && currentView !== 'admin' && (
            <div className="flex items-center gap-1">
              <button
                id="navbar-owner-login-btn"
                onClick={() => onNavigate('owner_login')}
                className="flex items-center gap-1 text-[11px] font-medium text-[#A3A3A3] hover:text-[#D4AD54] px-2 py-1 rounded-lg transition-colors border border-transparent hover:border-[#333333]"
                title="بوابة دخول أصحاب القاعات والخدمات"
              >
                <Sparkles className="w-3 h-3 text-[#D4AD54]" />
                <span className="hidden sm:inline">أصحاب الأقسام</span>
                <span className="sm:hidden">دخول</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
