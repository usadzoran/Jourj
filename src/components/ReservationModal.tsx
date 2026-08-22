import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, Phone, CheckCircle2, Crown, Sparkles } from 'lucide-react';
import { Business } from '../types';
import { DataService } from '../services/dataService';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: Business;
  initialDate?: string;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  business,
  initialDate
}) => {
  const [date, setDate] = useState(initialDate || '2026-09-12');
  const [timeSlot, setTimeSlot] = useState('Après-midi (14:00 — 19:00)');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
    const user = DataService.getActiveUser();
    if (user) {
      if (!name && user.full_name) setName(user.full_name);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [initialDate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    try {
      await DataService.createBooking({
        business_id: business.id,
        business_name: business.name,
        date: date,
        time_slot: timeSlot,
        client_name: name,
        client_phone: phone,
        notes: notes
      });

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#080808]/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#121212] border border-[#262626] p-6 sm:p-8 z-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              id="reservation-modal-close-btn"
              onClick={handleClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#999999] hover:text-[#F7F3EA] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Header */}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D7B45A]/15 border border-[#D7B45A]/30 text-[11px] font-semibold text-[#D7B45A] mb-2">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Demande de Réservation</span>
                  </div>
                  <h3 className="font-luxury text-xl sm:text-2xl font-bold text-[#F7F3EA]">
                    {business.name}
                  </h3>
                  <p className="text-xs text-[#999999] mt-0.5">
                    Envoyez votre demande directement au prestataire sans intermédiaire.
                  </p>
                </div>

                {/* Date Input */}
                <div>
                  <label className="block text-xs font-semibold text-[#D7B45A] uppercase tracking-wider mb-1.5">
                    Date souhaitée
                  </label>
                  <div className="relative">
                    <input
                      id="reservation-date-input"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full rounded-2xl bg-[#181818] border border-[#2E2E2E] focus:border-[#D7B45A] px-4 py-3 pl-11 text-xs text-[#F7F3EA] outline-none transition-colors"
                    />
                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-[#D7B45A]" />
                  </div>
                </div>

                {/* Time Slot Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#D7B45A] uppercase tracking-wider mb-1.5">
                    Créneau horaire
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      id="slot-matin"
                      onClick={() => setTimeSlot('Matin (08:00 — 12:00)')}
                      className={`py-2.5 px-3 rounded-2xl border text-xs font-semibold transition-all ${
                        timeSlot.startsWith('Matin')
                          ? 'bg-[#D7B45A] text-[#080808] border-[#D7B45A] shadow-md font-bold'
                          : 'bg-[#181818] text-[#999999] border-[#2A2A2A] hover:text-[#F7F3EA]'
                      }`}
                    >
                      Matin (08:00 - 12:00)
                    </button>

                    <button
                      type="button"
                      id="slot-apres-midi"
                      onClick={() => setTimeSlot('Après-midi (14:00 — 19:00)')}
                      className={`py-2.5 px-3 rounded-2xl border text-xs font-semibold transition-all ${
                        timeSlot.startsWith('Après-midi')
                          ? 'bg-[#D7B45A] text-[#080808] border-[#D7B45A] shadow-md font-bold'
                          : 'bg-[#181818] text-[#999999] border-[#2A2A2A] hover:text-[#F7F3EA]'
                      }`}
                    >
                      Après-midi (14:00 - 19:00)
                    </button>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-[#D7B45A] uppercase tracking-wider mb-1.5">
                    Nom & Prénom
                  </label>
                  <div className="relative">
                    <input
                      id="reservation-name-input"
                      type="text"
                      placeholder="Ex: Yacine & Amira"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-2xl bg-[#181818] border border-[#2E2E2E] focus:border-[#D7B45A] px-4 py-3 pl-11 text-xs text-[#F7F3EA] outline-none transition-colors placeholder:text-[#666666]"
                    />
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-[#D7B45A]" />
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-xs font-semibold text-[#D7B45A] uppercase tracking-wider mb-1.5">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <input
                      id="reservation-phone-input"
                      type="tel"
                      placeholder="Ex: 0555 12 34 56"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full rounded-2xl bg-[#181818] border border-[#2E2E2E] focus:border-[#D7B45A] px-4 py-3 pl-11 text-xs text-[#F7F3EA] outline-none transition-colors placeholder:text-[#666666]"
                    />
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-[#D7B45A]" />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  id="reservation-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D7B45A] via-[#F0D38A] to-[#C89443] text-[#080808] font-luxury font-bold text-sm tracking-wider uppercase shadow-[0_6px_25px_rgba(215,180,90,0.35)] hover:shadow-[0_8px_30px_rgba(215,180,90,0.5)] active:scale-[0.99] transition-all disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                </button>
              </form>
            ) : (
              /* Success Screen (✓ Demande envoyée) */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center flex flex-col items-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#4C9B67]/20 border border-[#4C9B67]/50 flex items-center justify-center text-[#4C9B67] shadow-[0_0_25px_rgba(76,155,103,0.3)]">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <h3 className="font-luxury text-2xl font-bold text-[#F7F3EA]">
                  Demande envoyée
                </h3>

                <p className="text-xs text-[#CCCCCC] max-w-xs leading-relaxed">
                  Votre demande de réservation a été enregistrée avec succès. Le prestataire <strong className="text-[#D7B45A]">{business.name}</strong> prendra contact avec vous par téléphone très rapidement.
                </p>

                <div className="p-4 rounded-2xl bg-[#181818] border border-[#2A2A2A] text-left w-full space-y-1.5 text-xs text-[#999999] mt-2">
                  <p><strong className="text-[#F7F3EA]">Date :</strong> {date}</p>
                  <p><strong className="text-[#F7F3EA]">Créneau :</strong> {timeSlot}</p>
                  <p><strong className="text-[#F7F3EA]">Client :</strong> {name} ({phone})</p>
                </div>

                <button
                  id="reservation-success-close-btn"
                  onClick={handleClose}
                  className="w-full py-3.5 rounded-2xl bg-[#222222] hover:bg-[#2A2A2A] text-xs font-bold text-[#D7B45A] transition-colors mt-4"
                >
                  Fermer
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
