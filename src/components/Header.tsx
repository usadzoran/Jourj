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
    <header className="sticky top-0 z-40 w-full bg-[#0d0d0d]/90 backdrop-blur-md border-b border-[#222222] px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-right group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full border border-[#D7B45A]/50 bg-[#161616] p-1 flex items-center justify-center overflow-hidden shadow-md shadow-[#D7B45A]/10 group-hover:border-[#D7B45A] transition-colors">
            <img
              src={`${import.meta.env.BASE_URL}assets/logo.jpg`}
              alt="JOUR J"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-xs font-serif text-[#D7B45A] font-bold">J</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif tracking-widest text-[#F7F3EA] text-base font-bold uppercase">
                JOUR <span className="text-[#D7B45A]">J</span>
              </span>
              <span className="text-[10px] text-[#D7B45A]">♡</span>
            </div>
            <p className="text-[9px] tracking-wider text-[#A0A0A0] uppercase font-sans">
              وهران · الجزائر
            </p>
          </div>
        </button>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Public Home button if not on home */}
          {currentView !== 'home' && (
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-[#F7F3EA] bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] transition-colors"
            >
              الرئيسية
            </button>
          )}

          {/* User Session status */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              {currentUser.role === 'admin' ? (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
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
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
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
                className="p-1.5 rounded-full text-xs text-[#888] hover:text-[#fff] hover:bg-[#222] transition-colors"
              >
                خروج
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#111] bg-gradient-to-r from-[#F0D38A] to-[#D7B45A] hover:brightness-110 shadow-sm transition-all"
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
