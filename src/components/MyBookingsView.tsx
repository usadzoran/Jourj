import React, { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, Clock, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { BookingRequest } from '../types';
import { DataService } from '../services/dataService';

interface MyBookingsViewProps {
  onBack: () => void;
  onSelectBusiness?: (id: string) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  onBack,
  onSelectBusiness
}) => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const all = await DataService.getBookings();
    setBookings(all);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222222] pb-4">
        <div className="flex items-center gap-3">
          <button
            id="bookings-view-back-btn"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-[#151515] border border-[#262626] flex items-center justify-center text-[#F7F3EA] hover:text-[#D7B45A] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-luxury text-xl sm:text-2xl font-bold text-[#F7F3EA]">
              Mes Demandes de Réservation
            </h1>
            <p className="text-xs text-[#999999]">
              Suivi en temps réel de vos demandes auprès des prestataires
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#D7B45A]">
          <div className="w-8 h-8 border-2 border-[#D7B45A] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs text-[#999999]">Chargement de vos réservations...</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-10 rounded-3xl bg-[#151515] border border-[#222222] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#181818] border border-[#D7B45A]/40 flex items-center justify-center text-[#D7B45A] mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-luxury text-lg font-bold text-[#F7F3EA]">
            Aucune demande de réservation
          </h3>
          <p className="text-xs text-[#999999] max-w-sm mx-auto">
            Sélectionnez une date sur la fiche d'un prestataire pour envoyer votre première demande.
          </p>
          <button
            id="bookings-browse-btn"
            onClick={onBack}
            className="px-6 py-2.5 rounded-2xl bg-[#D7B45A] text-[#080808] font-luxury font-bold text-xs uppercase mt-2"
          >
            Trouver un prestataire
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-3xl bg-[#151515] border border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#D7B45A]/15 text-[10px] font-bold text-[#D7B45A] uppercase">
                    {b.status === 'confirmee' ? 'Confirmée' : 'En attente'}
                  </span>
                  <span className="text-xs text-[#888888]">
                    {new Date(b.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <h3 className="font-luxury text-lg font-bold text-[#F7F3EA]">
                  {b.business_name}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#999999] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D7B45A]" />
                    <span>{b.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D7B45A]" />
                    <span>{b.time_slot}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#D7B45A]" />
                    <span>{b.client_phone}</span>
                  </div>
                </div>

                {b.notes && (
                  <p className="text-xs text-[#777777] italic mt-1">
                    "{b.notes}"
                  </p>
                )}
              </div>

              {b.business_id !== 'concierge-vip' && onSelectBusiness && (
                <button
                  onClick={() => onSelectBusiness(b.business_id)}
                  className="px-4 py-2 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] text-xs font-semibold text-[#D7B45A] transition-colors shrink-0 text-center"
                >
                  Voir la fiche
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
