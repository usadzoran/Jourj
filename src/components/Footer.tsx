import React from 'react';
import { Crown, Heart, ShieldCheck } from 'lucide-react';
import { AppView } from '../types';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#080808] border-t border-[#1C1C1C] text-[#999999] text-xs py-10 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-5">
        
        {/* Brand */}
        <div className="flex flex-col items-center space-y-1.5">
          <div className="w-9 h-9 rounded-full border border-[#D7B45A]/40 flex items-center justify-center bg-[#151515] text-[#D7B45A]">
            <Crown className="w-4 h-4" />
          </div>
          <h3 className="font-luxury text-lg font-bold text-[#F7F3EA] uppercase tracking-wider">
            JOUR <span className="text-[#D7B45A]">J</span>
          </h3>
          <p className="font-luxury text-[10px] text-[#D7B45A] tracking-[0.25em] uppercase">
            LE MOMENT QU'ON ATTEND
          </p>
          <p className="text-xs text-[#888888] max-w-sm font-light mt-1">
            La première plateforme d'excellence dédiée aux mariages et réceptions d'exception à Oran.
          </p>
        </div>

        {/* Golden Separator */}
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D7B45A]/40 to-transparent" />

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#888888]">
          <span>📍 Oran, Algérie</span>
          <span>•</span>
          <span>Contact Direct & Sans Frais</span>
          <span>•</span>
          <span>Tarifs en Dinars (DA)</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#777777] pt-2 border-t border-[#181818] w-full max-w-md">
          <button
            onClick={() => onNavigate('owner_login')}
            className="hover:text-[#D7B45A] transition-colors"
          >
            Espace Prestataire
          </button>
          <span>•</span>
          <button
            onClick={() => onNavigate('admin')}
            className="hover:text-[#D7B45A] transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-[#D7B45A]" />
            <span>Administration</span>
          </button>
        </div>

        {/* Copyright */}
        <div className="text-[11px] text-[#555555]">
          © {new Date().getFullYear()} JOUR J — Tous droits réservés. Oran, Algérie.
        </div>
      </div>
    </footer>
  );
};
