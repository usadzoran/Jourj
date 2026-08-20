import React from 'react';
import { Heart, ShieldCheck } from 'lucide-react';
import { AppView } from '../types';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#0E0E0E] border-t border-[#222222] text-[#A3A3A3] text-xs py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-6">
        
        {/* Brand Center */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-10 h-10 rounded-full border border-[#D4AD54]/40 flex items-center justify-center bg-[#171717]">
            <span className="font-luxury text-base font-bold text-[#D4AD54] italic">
              J
            </span>
          </div>
          <h3 className="font-luxury text-xl font-bold text-[#FFFFFF]">
            jour <span className="text-[#D4AD54]">j</span>
          </h3>
          <p className="font-luxury text-xs text-[#E5C378] tracking-widest italic">
            Le moment qu'on attend
          </p>
          <p className="text-xs text-[#737373] max-w-sm">
            المنصة الجزائرية المتخصصة في أرقى قاعات الحفلات وخدمات الإطعام Traiteur لتنظيم يومك المميز.
          </p>
        </div>

        {/* Golden separator */}
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#D4AD54]/50 to-transparent" />

        {/* Badges and City */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#A3A3A3]">
          <span className="flex items-center gap-1">
            🇩🇿 الجزائر — وهران (Oran)
          </span>
          <span>•</span>
          <span>دفع بالدينار الجزائري (DZD)</span>
          <span>•</span>
          <span>تصفح مباشر ومجاني للزوار</span>
        </div>

        {/* Discreet Management Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#737373] pt-2 border-t border-[#1C1C1C] w-full max-w-md">
          <button
            onClick={() => onNavigate('owner_login')}
            className="hover:text-[#D4AD54] transition-colors"
          >
            دخول أصحاب الأقسام
          </button>
          <span>•</span>
          <button
            onClick={() => onNavigate('admin')}
            className="hover:text-[#D4AD54] transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-[#D4AD54]" />
            <span>لوحة تحكم Admin</span>
          </button>
        </div>

        {/* Copyright */}
        <div className="flex items-center justify-center gap-1 text-[11px] text-[#525252]">
          <span>جميع الحقوق محفوظة © {new Date().getFullYear()} jour j. صُمم بحب</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
          <span>للجزائر</span>
        </div>

      </div>
    </footer>
  );
};
