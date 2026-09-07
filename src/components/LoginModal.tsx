import React, { useState } from 'react';
import { Profile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: Profile[];
  onSelectUser: (profile: Profile) => void;
  onEnterToken: (token: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onSelectUser,
  onEnterToken
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'token'>('quick');
  const [manualToken, setManualToken] = useState('');

  if (!isOpen) return null;

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    onEnterToken(manualToken.trim());
    onClose();
  };

  const adminProfiles = profiles.filter(p => p.role === 'admin');
  const ownerProfiles = profiles.filter(p => p.role === 'owner');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#333] bg-[#141414] p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#222] text-[#aaa] hover:text-white flex items-center justify-center text-sm"
        >
          ✕
        </button>

        <div className="text-center space-y-1 pt-2">
          <div className="w-10 h-10 rounded-full border border-[#D7B45A]/50 bg-[#1a1a1a] flex items-center justify-center mx-auto mb-2 text-[#D7B45A] font-bold">
            ♛
          </div>
          <h2 className="text-lg font-bold text-[#F7F3EA]">تسجيل الدخول إلى JOUR J</h2>
          <p className="text-xs text-[#888]">
            اختر الحساب المطلوب لتجربة النظام أو أدخل رمز دعوة التسجيل
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#0e0e0e] p-1 rounded-xl border border-[#262626]">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'quick'
                ? 'bg-[#D7B45A] text-[#111]'
                : 'text-[#aaa] hover:text-[#fff]'
            }`}
          >
            الحسابات التجريبية
          </button>
          <button
            onClick={() => setActiveTab('token')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'token'
                ? 'bg-[#D7B45A] text-[#111]'
                : 'text-[#aaa] hover:text-[#fff]'
            }`}
          >
            رمز دعوة (Token)
          </button>
        </div>

        {activeTab === 'quick' ? (
          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {/* Admin Profile */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#D7B45A]">حساب الإدارة العامة:</span>
              {adminProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectUser(p);
                    onClose();
                  }}
                  className="w-full p-3 rounded-xl bg-[#1e1e1e] hover:bg-[#252525] border border-[#333] flex items-center justify-between text-right transition-all group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[#F7F3EA] group-hover:text-[#D7B45A]">
                      {p.full_name}
                    </div>
                    <div className="text-[10px] text-[#777]">{p.email}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[#D7B45A]/20 text-[#D7B45A] text-[10px] font-bold">
                    Super Admin ♛
                  </span>
                </button>
              ))}
            </div>

            {/* Owner Profiles */}
            <div className="space-y-2 pt-2 border-t border-[#222]">
              <span className="text-[11px] font-bold text-[#D7B45A]">حسابات أصحاب المؤسسات (Owners):</span>
              {ownerProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectUser(p);
                    onClose();
                  }}
                  className="w-full p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] flex items-center justify-between text-right transition-all group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-[#F7F3EA] group-hover:text-[#D7B45A]">
                      {p.full_name}
                    </div>
                    <div className="text-[10px] text-[#777]">{p.email}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[#2a2a2a] text-[#aaa] text-[10px]">
                    مالك مؤسسة 🏛️
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#aaa] mb-1 font-medium">
                أدخل رمز الدعوة (Registration Token)
              </label>
              <input
                type="text"
                required
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="مثال: WEDDING2026 أو TRAITEUR2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none tracking-widest font-mono"
              />
              <p className="text-[10px] text-[#777] mt-1.5 leading-relaxed">
                الرمز يربط مؤسستك تلقائياً بالقسم المخصص من قبل الإدارة.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F0D38A] to-[#D7B45A] text-[#111] font-bold text-xs shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              متابعة إلى صفحة التسجيل ↗
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
