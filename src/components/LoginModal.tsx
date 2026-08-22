import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, Crown, Sparkles } from 'lucide-react';
import { DataService } from '../services/dataService';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      const user = await DataService.loginSimple(name, phone);
      setIsSubmitting(false);
      onSuccess(user);
      onClose();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
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
            onClick={onClose}
            className="fixed inset-0 bg-[#080808]/85 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-[#121212] border border-[#262626] p-6 sm:p-7 z-10 shadow-2xl overflow-hidden"
          >
            <button
              id="login-modal-close-btn"
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#999999] hover:text-[#F7F3EA] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border border-[#D7B45A]/40 bg-[#1A1A1A] flex items-center justify-center text-[#D7B45A] mx-auto mb-3">
                  <Crown className="w-6 h-6" />
                </div>
                <h3 className="font-luxury text-xl font-bold text-[#F7F3EA]">
                  Mon Espace Mariage
                </h3>
                <p className="text-xs text-[#999999] mt-1">
                  Accédez à vos réservations et vos prestataires favoris
                </p>
              </div>

              {/* Nom */}
              <div>
                <label className="block text-xs font-semibold text-[#D7B45A] uppercase tracking-wider mb-1.5">
                  Nom & Prénom
                </label>
                <div className="relative">
                  <input
                    id="login-name-input"
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

              {/* Téléphone */}
              <div>
                <label className="block text-xs font-semibold text-[#D7B45A] uppercase tracking-wider mb-1.5">
                  Téléphone
                </label>
                <div className="relative">
                  <input
                    id="login-phone-input"
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

              <button
                id="login-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D7B45A] via-[#F0D38A] to-[#C89443] text-[#080808] font-luxury font-bold text-xs tracking-wider uppercase shadow-[0_4px_20px_rgba(215,180,90,0.3)] hover:shadow-[0_6px_25px_rgba(215,180,90,0.45)] active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'Connexion...' : 'Entrer dans mon espace'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
