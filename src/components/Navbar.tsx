import React from 'react';
import { Menu, User, Heart, Crown } from 'lucide-react';
import { UserProfile, AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  currentUser: UserProfile | null;
  onOpenDrawer: () => void;
  onOpenLogin: () => void;
  onNavigate: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  currentUser,
  onOpenDrawer,
  onOpenLogin,
  onNavigate
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#080808]/95 backdrop-blur-md border-b border-[#1A1A1A] transition-colors">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left: ☰ Menu Drawer Button */}
        <button
          id="navbar-menu-drawer-btn"
          onClick={onOpenDrawer}
          className="w-10 h-10 rounded-2xl bg-[#151515] border border-[#222222] flex items-center justify-center text-[#F7F3EA] hover:text-[#D7B45A] hover:border-[#D7B45A]/40 active:scale-95 transition-all shadow-sm"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center: Brand Title & Subtitle */}
        <div
          id="navbar-brand-center"
          onClick={() => onNavigate('home')}
          className="flex flex-col items-center cursor-pointer select-none group"
        >
          <div className="flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-[#D7B45A] group-hover:rotate-12 transition-transform" />
            <h1 className="font-luxury text-xl md:text-2xl font-bold tracking-[0.15em] text-[#F7F3EA] uppercase group-hover:text-[#D7B45A] transition-colors">
              JOUR <span className="text-[#D7B45A]">J</span>
            </h1>
          </div>
          <span className="font-luxury text-[9px] md:text-[10px] tracking-[0.25em] text-[#D7B45A] uppercase -mt-0.5">
            LE MOMENT QU'ON ATTEND
          </span>
        </div>

        {/* Right: User / Login Button (◉ Moi) */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <button
              id="navbar-user-profile-btn"
              onClick={() => onNavigate('moi')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#151515] border border-[#D7B45A]/40 text-xs font-semibold text-[#D7B45A] hover:bg-[#1C1C1C] transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-[#D7B45A] text-[#080808] flex items-center justify-center text-[10px] font-bold">
                {currentUser.full_name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline">{currentUser.full_name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              id="navbar-login-btn"
              onClick={onOpenLogin}
              className="w-10 h-10 rounded-2xl bg-[#151515] border border-[#222222] flex items-center justify-center text-[#F7F3EA] hover:text-[#D7B45A] hover:border-[#D7B45A]/40 active:scale-95 transition-all shadow-sm"
              aria-label="Mon compte"
              title="Se connecter"
            >
              <User className="w-5 h-5" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
