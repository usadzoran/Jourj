import React from 'react';
import { User, Phone, Heart, Calendar, LogOut, ArrowLeft, Crown, Shield, Sparkles } from 'lucide-react';
import { UserProfile, AppView } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  onBack: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onNavigate,
  onLogout,
  onBack
}) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#222222] pb-4">
        <button
          id="profile-back-btn"
          onClick={onBack}
          className="w-10 h-10 rounded-2xl bg-[#151515] border border-[#262626] flex items-center justify-center text-[#F7F3EA] hover:text-[#D7B45A] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-luxury text-xl sm:text-2xl font-bold text-[#F7F3EA]">
            Mon Espace JOUR J
          </h1>
          <p className="text-xs text-[#999999]">Profil et préférences</p>
        </div>
      </div>

      {/* User Card */}
      <div className="p-6 rounded-3xl bg-[#151515] border border-[#222222] text-center flex flex-col items-center space-y-3 shadow-lg">
        <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#D7B45A] to-[#C89443] text-[#080808] flex items-center justify-center font-luxury font-extrabold text-2xl shadow-[0_0_20px_rgba(215,180,90,0.3)]">
          {user.full_name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2 className="font-luxury text-lg font-bold text-[#F7F3EA]">
            {user.full_name}
          </h2>
          {user.phone && (
            <p className="text-xs text-[#999999] mt-0.5 flex items-center justify-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#D7B45A]" />
              <span>{user.phone}</span>
            </p>
          )}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D7B45A]/10 border border-[#D7B45A]/30 text-[11px] font-semibold text-[#D7B45A]">
          <Crown className="w-3.5 h-3.5" />
          <span>Membre Privilège Oran</span>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="space-y-2.5">
        <button
          id="profile-goto-favs"
          onClick={() => onNavigate('favorites')}
          className="w-full p-4 rounded-2xl bg-[#151515] border border-[#222222] hover:border-[#D7B45A]/50 flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#201515] text-[#B94B49] flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#F7F3EA] group-hover:text-[#D7B45A]">
                Mes prestataires favoris
              </p>
              <p className="text-[11px] text-[#777777]">Salles, photographes, traiteurs</p>
            </div>
          </div>
          <span className="text-xs text-[#777777] group-hover:text-[#D7B45A]">→</span>
        </button>

        <button
          id="profile-goto-bookings"
          onClick={() => onNavigate('reservations')}
          className="w-full p-4 rounded-2xl bg-[#151515] border border-[#222222] hover:border-[#D7B45A]/50 flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#181818] text-[#D7B45A] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#F7F3EA] group-hover:text-[#D7B45A]">
                Mes demandes de réservations
              </p>
              <p className="text-[11px] text-[#777777]">Dates demandées et statuts</p>
            </div>
          </div>
          <span className="text-xs text-[#777777] group-hover:text-[#D7B45A]">→</span>
        </button>

        {user.role === 'admin' && (
          <button
            id="profile-goto-admin"
            onClick={() => onNavigate('admin')}
            className="w-full p-4 rounded-2xl bg-[#151515] border border-[#D7B45A]/30 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D7B45A]/20 text-[#D7B45A] flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#D7B45A]">Administration Générale</p>
                <p className="text-[11px] text-[#777777]">Gestion des prestataires & statistiques</p>
              </div>
            </div>
            <span className="text-xs text-[#D7B45A]">→</span>
          </button>
        )}
      </div>

      {/* Logout Button */}
      <button
        id="profile-logout-btn"
        onClick={onLogout}
        className="w-full py-3.5 rounded-2xl bg-[#151515] border border-[#B94B49]/40 text-xs font-bold text-[#B94B49] hover:bg-[#201515] flex items-center justify-center gap-2 transition-colors mt-6"
      >
        <LogOut className="w-4 h-4" />
        <span>Se déconnecter de mon espace</span>
      </button>
    </div>
  );
};
