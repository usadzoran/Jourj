import React from 'react';
import { Profile } from '../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  currentUser: Profile | null;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onLogout,
  onOpenLogin
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#222222] px-3 sm:px-4 py-2.5 sm:py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 sm:gap-3 text-right group cursor-pointer focus:outline-none shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#D7B45A]/50 bg-[#161616] p-0.5 sm:p-1 flex items-center justify-center overflow-hidden shadow-md shadow-[#D7B45A]/10 group-hover:border-[#D7B45A] transition-colors relative">
            <img
              src="./assets/logo.jpg"
              alt="JOUR J"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-xs font-serif text-[#D7B45A] font-bold">J</span>
          </div>
          <div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-serif tracking-wider sm:tracking-widest text-[#F7F3EA] text-sm sm:text-base font-bold uppercase">
                JOUR <span className="text-[#D7B45A]">J</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#D7B45A]">♡</span>
            </div>
            <p className="text-[8px] sm:text-[9px] tracking-wider text-[#A0A0A0] uppercase font-sans">
              وهران · الجزائر
            </p>
          </div>
        </button>

        {/* Navigation Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Public Home button if not on home */}
          {currentView !== 'home' && (
            <button
              onClick={() => onNavigate('home')}
              className="px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-[#F7F3EA] bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] transition-colors"
            >
              الرئيسية
            </button>
          )}

          {/* User Session status */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {currentUser.role === 'admin' ? (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
                    currentView === 'admin'
                      ? 'bg-[#D7B45A] text-[#111] font-bold shadow-md shadow-[#D7B45A]/20'
                      : 'bg-[#1e1e1e] text-[#D7B45A] border border-[#D7B45A]/40 hover:bg-[#D7B45A]/10'
                  }`}
                >
                  لوحة الإدارة ♛
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('owner')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
                    currentView === 'owner'
                      ? 'bg-[#D7B45A] text-[#111] font-bold shadow-md shadow-[#D7B45A]/20'
                      : 'bg-[#1e1e1e] text-[#D7B45A] border border-[#D7B45A]/40 hover:bg-[#D7B45A]/10'
                  }`}
                >
                  لوحة مؤسستي 🏛️
                </button>
              )}

              <button
                onClick={onLogout}
                title="تسجيل الخروج"
                className="px-2 py-1 rounded-full text-[11px] sm:text-xs text-[#888] hover:text-[#fff] hover:bg-[#222] transition-colors cursor-pointer"
              >
                خروج
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={onOpenLogin}
                className="px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-[#111] bg-gradient-to-r from-[#F0D38A] to-[#D7B45A] hover:brightness-110 shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                تسجيل الدخول
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
