import React, { useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { PortfolioItem } from '../types';

interface PortfolioLightboxProps {
  items: PortfolioItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const PortfolioLightbox: React.FC<PortfolioLightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate
}) => {
  const currentItem = items[currentIndex];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight' && currentIndex > 0) onNavigate(currentIndex - 1);
    if (e.key === 'ArrowLeft' && currentIndex < items.length - 1) onNavigate(currentIndex + 1);
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      id="portfolio-lightbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C0C0C]/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3 bg-[#1A1A1A]/80 px-4 py-2 rounded-full border border-[#D4AD54]/30 text-xs text-[#E5C378]">
          <span className="font-bold text-[#D4AD54]">{currentIndex + 1}</span> / {items.length}
          {currentItem.title && (
            <>
              <span className="text-[#525252]">•</span>
              <span className="text-[#F7F5F0] font-medium">{currentItem.title}</span>
            </>
          )}
        </div>

        <button
          id="lightbox-close-btn"
          onClick={onClose}
          className="p-2.5 rounded-full bg-[#1A1A1A]/80 border border-[#333333] hover:border-[#D4AD54] text-[#F7F5F0] hover:text-[#D4AD54] transition-colors"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            id="lightbox-prev-btn"
            disabled={currentIndex === 0}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex - 1);
            }}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#1A1A1A]/80 border border-[#333333] text-[#F7F5F0] transition-all ${
              currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:border-[#D4AD54] hover:text-[#D4AD54]'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <button
            id="lightbox-next-btn"
            disabled={currentIndex === items.length - 1}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex + 1);
            }}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#1A1A1A]/80 border border-[#333333] text-[#F7F5F0] transition-all ${
              currentIndex === items.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:border-[#D4AD54] hover:text-[#D4AD54]'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image View */}
      <div
        className="relative max-w-4xl max-h-[80vh] flex flex-col items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentItem.image_url}
          alt={currentItem.title || 'صورة المعرض'}
          className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-[#262626]"
        />
        {currentItem.title && (
          <p className="mt-3 text-sm text-[#E5C378] font-medium text-center">
            {currentItem.title}
          </p>
        )}
      </div>
    </div>
  );
};
