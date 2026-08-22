import React from 'react';
import { Home, Plus, User, Heart, Calendar } from 'lucide-react';
import { AppView, UserProfile } from '../types';

interface BottomNavProps {
  currentView: AppView;
  currentUser: UserProfile | null;
  onNavigate: (view: AppView) => void;
  onOpenConcierge: () => void;
  onOpenLogin: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  currentUser,
  onNavigate,
  onOpenConcierge,
  onOpenLogin
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#080808]/95 backdrop-blur-md border-t border-[#1C1C1C] py-2 px-6 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        
        {/* 1. Accueil (⌂) */}
        <button
          id="bottom-nav-home"
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 py-1 transition-colors select-none ${
            currentView === 'home'
              ? 'text-[#D7B45A]'
              : 'text-[#888888] hover:text-[#F7F3EA]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wider">Accueil</span>
        </button>

        {/* 2. Floating Gold Button (+) in Center */}
        <div className="relative -top-5 flex justify-center">
          <button
            id="bottom-nav-plus-btn"
            onClick={onOpenConcierge}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D7B45A] via-[#F0D38A] to-[#C89443] text-[#080808] flex items-center justify-center shadow-[0_4px_20px_rgba(215,180,90,0.45)] hover:scale-110 active:scale-95 transition-all border-2 border-[#080808]"
            title="Conciergerie & Demande personnalisée"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* 3. Moi (♙) */}
        <button
          id="bottom-nav-moi"
          onClick={() => {
            if (currentUser) {
              onNavigate('moi');
            } else {
              onOpenLogin();
            }
          }}
          className={`flex flex-col items-center gap-1 py-1 transition-colors select-none ${
            currentView === 'moi' || currentView === 'favorites' || currentView === 'reservations'
              ? 'text-[#D7B45A]'
              : 'text-[#888888] hover:text-[#F7F3EA]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-wider">
            {currentUser ? 'Moi' : 'Connexion'}
          </span>
        </button>

      </div>
    </nav>
  );
};
