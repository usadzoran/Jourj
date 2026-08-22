import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Home, User, Heart, Calendar, Settings, Sparkles, LogOut, Shield } from 'lucide-react';
import { AppView, UserProfile } from '../types';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onNavigate: (view: AppView) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNavigate,
  onOpenLogin,
  onLogout
}) => {
  const handleItemClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#080808]/80 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] bg-[#0F0F0F] border-r border-[#262626] flex flex-col shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#222222] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#D7B45A]/50 bg-[#151515] flex items-center justify-center text-[#D7B45A]">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-luxury text-lg font-bold tracking-wider text-[#F7F3EA]">
                    JOUR <span className="text-[#D7B45A]">J</span>
                  </h2>
                  <p className="font-luxury text-[10px] tracking-widest text-[#D7B45A] uppercase">
                    Le moment qu'on attend
                  </p>
                </div>
              </div>

              <button
                id="drawer-close-btn"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-[#151515] border border-[#262626] flex items-center justify-center text-[#999999] hover:text-[#F7F3EA] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Greeting if logged in */}
            {currentUser && (
              <div className="px-6 py-4 bg-[#151515]/60 border-b border-[#222222] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#D7B45A]/20 border border-[#D7B45A]/40 flex items-center justify-center text-[#D7B45A] font-bold text-sm">
                  {currentUser.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#999999]">Bienvenue</p>
                  <p className="text-sm font-semibold text-[#F7F3EA] truncate">
                    {currentUser.full_name}
                  </p>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
              <button
                id="drawer-nav-home"
                onClick={() => handleItemClick(() => onNavigate('home'))}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium text-[#F7F3EA] hover:bg-[#151515] hover:text-[#D7B45A] transition-all"
              >
                <Home className="w-5 h-5 text-[#D7B45A]" />
                <span>Accueil</span>
              </button>

              {!currentUser ? (
                <button
                  id="drawer-nav-login"
                  onClick={() => handleItemClick(onOpenLogin)}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium text-[#F7F3EA] hover:bg-[#151515] hover:text-[#D7B45A] transition-all"
                >
                  <User className="w-5 h-5 text-[#D7B45A]" />
                  <span>Se connecter</span>
                </button>
              ) : (
                <button
                  id="drawer-nav-profile"
                  onClick={() => handleItemClick(() => onNavigate('moi'))}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium text-[#F7F3EA] hover:bg-[#151515] hover:text-[#D7B45A] transition-all"
                >
                  <User className="w-5 h-5 text-[#D7B45A]" />
                  <span>Mon Espace ({currentUser.full_name})</span>
                </button>
              )}

              <button
                id="drawer-nav-favorites"
                onClick={() => handleItemClick(() => onNavigate('favorites'))}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium text-[#F7F3EA] hover:bg-[#151515] hover:text-[#D7B45A] transition-all"
              >
                <Heart className="w-5 h-5 text-[#D7B45A]" />
                <span>Mes favoris</span>
              </button>

              <button
                id="drawer-nav-reservations"
                onClick={() => handleItemClick(() => onNavigate('reservations'))}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium text-[#F7F3EA] hover:bg-[#151515] hover:text-[#D7B45A] transition-all"
              >
                <Calendar className="w-5 h-5 text-[#D7B45A]" />
                <span>Mes réservations</span>
              </button>

              <div className="pt-4 pb-2">
                <div className="h-[1px] bg-[#222222] my-2" />
                <span className="px-4 text-[11px] font-semibold tracking-wider text-[#777777] uppercase">
                  Professionnels
                </span>
              </div>

              <button
                id="drawer-nav-partner"
                onClick={() => handleItemClick(() => onNavigate('owner_login'))}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-medium text-[#999999] hover:bg-[#151515] hover:text-[#D7B45A] transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#D7B45A]" />
                <span>Espace Prestataire</span>
              </button>

              {currentUser?.role === 'admin' && (
                <button
                  id="drawer-nav-admin"
                  onClick={() => handleItemClick(() => onNavigate('admin'))}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-medium text-[#D7B45A] hover:bg-[#151515] transition-all"
                >
                  <Shield className="w-4 h-4 text-[#D7B45A]" />
                  <span>Administration JOUR J</span>
                </button>
              )}
            </div>

            {/* Footer Logout if logged in */}
            {currentUser && (
              <div className="p-4 border-t border-[#222222]">
                <button
                  id="drawer-logout-btn"
                  onClick={() => handleItemClick(onLogout)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#151515] text-xs font-semibold text-[#B94B49] hover:bg-[#201515] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
