import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if not dismissed recently
      const dismissed = localStorage.getItem('jourj_pwa_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('jourj_pwa_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 z-50 max-w-sm rounded-2xl bg-[#1A1A1A] border border-[#D4AD54]/50 p-4 shadow-2xl animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AD54] text-[#121212] flex items-center justify-center font-luxury font-bold text-lg shrink-0">
            J
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-[#FFFFFF]">تثبيت تطبيق jour j</h4>
              <Sparkles className="w-3 h-3 text-[#D4AD54]" />
            </div>
            <p className="text-[11px] text-[#A3A3A3] mt-0.5">
              ثبّت المنصة على هاتفك للوصول السريع بدون تحميل
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 rounded-lg text-[#737373] hover:text-[#FFFFFF]"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#D4AD54] to-[#B88E2D] text-[#121212] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
        >
          <Download className="w-3.5 h-3.5" />
          <span>تثبيت التطبيق الآن</span>
        </button>

        <button
          onClick={handleDismiss}
          className="px-3 py-2 rounded-xl bg-[#262626] text-[11px] text-[#A3A3A3] hover:text-[#FFFFFF]"
        >
          لاحقًا
        </button>
      </div>
    </div>
  );
};
