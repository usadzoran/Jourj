import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Crown, CheckCircle2, Phone, Calendar, User, MessageSquare } from 'lucide-react';
import { DataService } from '../services/dataService';

interface QuickConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickConciergeModal: React.FC<QuickConciergeModalProps> = ({
  isOpen,
  onClose
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('2026-09-12');
  const [selectedServices, setSelectedServices] = useState<string[]>(['Salle', 'Photographe']);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const availableServices = [
    '📸 Photographe',
    '🏛️ Salle',
    '🤵 Costume',
    '🚗 Voiture',
    '🍽️ Traiteur',
    '🌸 Décoration'
  ];

  const toggleService = (s: string) => {
    if (selectedServices.includes(s)) {
      setSelectedServices(selectedServices.filter(item => item !== s));
    } else {
      setSelectedServices([...selectedServices, s]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    await DataService.createBooking({
      business_id: 'concierge-vip',
      business_name: 'Conciergerie Mariage JOUR J Oran',
      date: date,
      time_slot: 'Pack Multi-Services',
      client_name: name,
      client_phone: phone,
      notes: `Services demandés: ${selectedServices.join(', ')}. Remarques: ${notes}`
    });

    setIsSubmitting(false);
    setIsSuccess(true);
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

          {/* Modal Content */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#121212] border border-[#262626] p-6 sm:p-8 z-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <button
              id="concierge-modal-close-btn"
              onClick={handleClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#999999] hover:text-[#F7F3EA] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D7B45A]/15 border border-[#D7B45A]/30 text-[11px] font-semibold text-[#D7B45A] mb-2">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Service Conciergerie VIP</span>
                  </div>
                  <h3 className="font-luxury text-xl sm:text-2xl font-bold text-[#F7F3EA]">
                    Organisez votre JOUR J
                  </h3>
                  <p className="text-xs text-[#999999] mt-1">
                    Sélectionnez les services désirés et nous vous coordonnerons les meilleurs prestataires d'Oran.
                  </p>
                </div>

                {/* Services Pills */}
                <div>
                  <label className="block text-xs font-semibold text-[#D7B45A] uppercase tracking-wider mb-2">
                    Services recherchés
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableServices.map((srv) => {
                      const isSel = selectedServices.includes(srv);
                      return (
                        <button
                          key={srv}
                          type="button"
                          onClick={() => toggleService(srv)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                            isSel
                              ? 'bg-[#D7B45A] text-[#080808] border-[#D7B45A] font-bold shadow-sm'
                              : 'bg-[#181818] text-[#999999] border-[#2A2A2A] hover:text-[#F7F3EA]'
                          }`}
                        >
                          {srv}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-[#D7B45A] uppercase tracking-wider mb-1.5">
                    Date estimée du mariage
                  </label>
                  <div className="relative">
                    <input
                      id="concierge-date-input"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full rounded-2xl bg-[#181818] border border-[#2E2E2E] focus:border-[#D7B45A] px-4 py-3 pl-11 text-xs text-[#F7F3EA] outline-none transition-colors"
                    />
                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-[#D7B45A]" />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#D7B45A] uppercase tracking-wider mb-1.5">
                    Nom & Prénom
                  </label>
                  <div className="relative">
                    <input
                      id="concierge-name-input"
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

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-[#D7B45A] uppercase tracking-wider mb-1.5">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <input
                      id="concierge-phone-input"
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

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-[#D7B45A] uppercase tracking-wider mb-1.5">
                    Détails ou demandes particulières (facultatif)
                  </label>
                  <textarea
                    id="concierge-notes-input"
                    rows={2}
                    placeholder="Ex: Capacité 400 personnes, quartier Canastel ou Akid Lotfi..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-2xl bg-[#181818] border border-[#2E2E2E] focus:border-[#D7B45A] px-4 py-3 text-xs text-[#F7F3EA] outline-none transition-colors placeholder:text-[#666666] resize-none"
                  />
                </div>

                <button
                  id="concierge-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D7B45A] via-[#F0D38A] to-[#C89443] text-[#080808] font-luxury font-bold text-sm tracking-wider uppercase shadow-[0_6px_25px_rgba(215,180,90,0.35)] hover:shadow-[0_8px_30px_rgba(215,180,90,0.5)] active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? 'Enregistrement...' : 'Demander un accompagnement'}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center flex flex-col items-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#4C9B67]/20 border border-[#4C9B67]/50 flex items-center justify-center text-[#4C9B67] shadow-[0_0_25px_rgba(76,155,103,0.3)]">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <h3 className="font-luxury text-2xl font-bold text-[#F7F3EA]">
                  Demande transmise
                </h3>

                <p className="text-xs text-[#CCCCCC] max-w-xs leading-relaxed">
                  Votre demande de conciergerie a été enregistrée avec succès. Notre équipe prendra contact avec vous sous peu pour finaliser vos réservations à Oran.
                </p>

                <button
                  id="concierge-success-close-btn"
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
