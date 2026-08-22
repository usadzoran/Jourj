import React, { useState, useEffect } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { Business } from '../types';
import { DataService } from '../services/dataService';
import { BusinessCard } from './BusinessCard';

interface FavoritesViewProps {
  onBack: () => void;
  onSelectBusiness: (id: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  onBack,
  onSelectBusiness
}) => {
  const [favoriteBusinesses, setFavoriteBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    const favIds = DataService.getFavorites();
    const all = await DataService.getBusinesses();
    const filtered = all.filter(b => favIds.includes(b.id));
    setFavoriteBusinesses(filtered);
    setLoading(false);
  };

  const handleToggleFavorite = (bizId: string) => {
    DataService.toggleFavorite(bizId);
    loadFavorites();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#222222] pb-4">
        <div className="flex items-center gap-3">
          <button
            id="fav-view-back-btn"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-[#151515] border border-[#262626] flex items-center justify-center text-[#F7F3EA] hover:text-[#D7B45A] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-luxury text-xl sm:text-2xl font-bold text-[#F7F3EA]">
              Mes Prestataires Favoris
            </h1>
            <p className="text-xs text-[#999999]">
              {favoriteBusinesses.length} professionnels enregistrés pour votre JOUR J
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#D7B45A]">
          <div className="w-8 h-8 border-2 border-[#D7B45A] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs text-[#999999]">Chargement des favoris...</span>
        </div>
      ) : favoriteBusinesses.length === 0 ? (
        <div className="p-10 rounded-3xl bg-[#151515] border border-[#222222] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#201515] border border-[#B94B49]/40 flex items-center justify-center text-[#B94B49] mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-luxury text-lg font-bold text-[#F7F3EA]">
            Aucun favori pour le moment
          </h3>
          <p className="text-xs text-[#999999] max-w-sm mx-auto">
            Explorez les salles, photographes et traiteurs d'Oran et cliquez sur le cœur pour les retrouver ici.
          </p>
          <button
            id="fav-browse-btn"
            onClick={onBack}
            className="px-6 py-2.5 rounded-2xl bg-[#D7B45A] text-[#080808] font-luxury font-bold text-xs uppercase mt-2"
          >
            Découvrir les services
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favoriteBusinesses.map((biz) => (
            <BusinessCard
              key={biz.id}
              business={biz}
              isFavorite={true}
              onToggleFavorite={() => handleToggleFavorite(biz.id)}
              onClick={() => onSelectBusiness(biz.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
