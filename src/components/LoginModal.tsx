import React, { useState, useMemo } from 'react';
import { Profile, Business, Category, RegistrationLink } from '../types';
import { api } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: Profile[];
  businesses?: Business[];
  categories?: Category[];
  registrationLinks?: RegistrationLink[];
  onSelectUser: (profile: Profile) => void;
  onEnterToken: (token: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  profiles,
  businesses = [],
  categories = [],
  registrationLinks = [],
  onSelectUser,
  onEnterToken
}) => {
  // Tabs: 'link' (Special admin link / token), 'credentials' (Email/Password), 'quick' (Demo quick access)
  const [activeTab, setActiveTab] = useState<'link' | 'credentials' | 'quick'>('link');

  // Link / Token form state
  const [inputLinkOrToken, setInputLinkOrToken] = useState('');
  const [tokenChecking, setTokenChecking] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Email / Password credentials form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [credError, setCredError] = useState<string | null>(null);

  // Helper to extract clean token from URL or raw text
  const cleanToken = useMemo(() => {
    const raw = inputLinkOrToken.trim();
    if (!raw) return '';
    try {
      if (raw.includes('token=')) {
        const match = raw.match(/[?&]token=([^&#]+)/);
        if (match && match[1]) return decodeURIComponent(match[1]).trim();
      }
      return raw;
    } catch {
      return raw;
    }
  }, [inputLinkOrToken]);

  // Detected link details from pre-loaded registrationLinks
  const detectedLink = useMemo(() => {
    if (!cleanToken) return null;
    return registrationLinks.find(
      l => l.token.trim().toLowerCase() === cleanToken.trim().toLowerCase()
    ) || null;
  }, [cleanToken, registrationLinks]);

  const detectedCategory = useMemo(() => {
    if (!detectedLink) return null;
    return categories.find(c => c.id === detectedLink.category_id) || detectedLink.category || null;
  }, [detectedLink, categories]);

  if (!isOpen) return null;

  // Handle Token / Special Link Submission
  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTokenError(null);

    const token = cleanToken;
    if (!token) {
      setTokenError('يرجى إدخال رابط أو رمز الدعوة المرسل من الإدارة.');
      return;
    }

    setTokenChecking(true);

    try {
      // 1. Verify the token with API
      const res = await api.verifyRegistrationToken(token);

      if (!res.valid || !res.link) {
        // Check if this token was already used by an existing owner
        const existingLink = registrationLinks.find(
          l => l.token.trim().toLowerCase() === token.toLowerCase()
        );

        if (existingLink && existingLink.used) {
          // Find associated business/owner if possible
          const matchedBiz = businesses.find(b => b.category_id === existingLink.category_id);
          const matchedOwner = matchedBiz ? profiles.find(p => p.id === matchedBiz.owner_id) : null;

          if (matchedOwner) {
            setTokenChecking(false);
            onSelectUser(matchedOwner);
            onClose();
            return;
          }
        }

        setTokenError(res.error || 'الرابط أو الرمز غير صالح أو منتهي الصلاحية.');
        setTokenChecking(false);
        return;
      }

      // Valid and ready for registration/access!
      setTokenChecking(false);
      onEnterToken(token);
      onClose();
    } catch (err: any) {
      setTokenChecking(false);
      setTokenError(err?.message || 'حدث خطأ أثناء التحقق من الرابط.');
    }
  };

  // Handle Email / Password Submission for Section Owners or Admin
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCredError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setCredError('يرجى إدخال البريد الإلكتروني أو اسم المستخدم.');
      return;
    }

    // Match profile by email or part of name
    const foundProfile = profiles.find(
      p => p.email.toLowerCase() === cleanEmail || p.full_name.toLowerCase() === cleanEmail
    );

    if (!foundProfile) {
      setCredError('لم يتم العثور على حساب بهذا البريد. إذا كان لديك رابط خاص من الآدمن، استخدم تبويب "الرابط الخاص".');
      return;
    }

    // Successful owner / admin login
    onSelectUser(foundProfile);
    onClose();
  };

  const adminProfiles = profiles.filter(p => p.role === 'admin');
  const ownerProfiles = profiles.filter(p => p.role === 'owner');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-[#D7B45A]/30 bg-[#141414] p-6 sm:p-8 space-y-6 shadow-2xl relative text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#202020] text-[#aaa] hover:text-white flex items-center justify-center text-sm cursor-pointer border border-[#333] transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-12 h-12 rounded-full border border-[#D7B45A]/50 bg-[#1a1a1a] flex items-center justify-center mx-auto mb-2 text-[#D7B45A] text-xl font-bold shadow-lg shadow-[#D7B45A]/10">
            ♛
          </div>
          <h2 className="text-xl font-bold font-serif text-[#F7F3EA] tracking-wide">
            تسجيل دخول أصحاب الأقسام والمشرفين
          </h2>
          <p className="text-xs text-[#999] max-w-sm mx-auto leading-relaxed">
            يدخل أصحاب الأقسام والمؤسسات عبر الرابط أو المعلومات الخاصة المرسلة لهم من قبل الإدارة (Admin).
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0e0e0e] p-1.5 rounded-2xl border border-[#262626] gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'link'
                ? 'bg-gradient-to-r from-[#F0D38A] to-[#D7B45A] text-[#111] shadow-md'
                : 'text-[#aaa] hover:text-white'
            }`}
          >
            <span>🔗</span>
            <span>الرابط الخاص (Admin)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'credentials'
                ? 'bg-gradient-to-r from-[#F0D38A] to-[#D7B45A] text-[#111] shadow-md'
                : 'text-[#aaa] hover:text-white'
            }`}
          >
            <span>🔐</span>
            <span>حساب مسجل</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'quick'
                ? 'bg-[#222] text-[#D7B45A] border border-[#D7B45A]/30'
                : 'text-[#888] hover:text-[#bbb]'
            }`}
          >
            <span>⚡</span>
            <span>دخول تجريبي</span>
          </button>
        </div>

        {/* TAB 1: SPECIAL LINK OR TOKEN FROM ADMIN */}
        {activeTab === 'link' && (
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs text-[#F7F3EA] font-semibold">
                الصق الرابط الخاص أو رمز الدعوة (Token) المرسل من الآدمن:
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  required
                  value={inputLinkOrToken}
                  onChange={(e) => {
                    setInputLinkOrToken(e.target.value);
                    setTokenError(null);
                  }}
                  placeholder="مثال: https://usadzoran.github.io/Jourj/?token=WEDDING2026 أو الرمز مباشرة"
                  className="w-full px-4 py-3 rounded-2xl bg-[#0b0b0b] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none tracking-wide text-left dir-ltr font-mono"
                />
              </div>

              {/* Realtime Category Detection Feedback */}
              {detectedLink && detectedCategory && (
                <div className="p-3 rounded-xl bg-[#D7B45A]/10 border border-[#D7B45A]/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#D7B45A]">✓ تم التعرف على القسم:</span>
                    <span className="font-bold text-[#F7F3EA]">{detectedCategory.name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#D7B45A]/20 text-[#D7B45A] text-[10px] font-mono font-bold">
                    {detectedLink.token}
                  </span>
                </div>
              )}

              <p className="text-[11px] text-[#777] leading-relaxed">
                * كل رابط خاص يمنحه الآدمن يكون مخصصاً لقسم معين (مثل قاعة الأعراس، Traiteur، مصورون، إلخ) لربط مؤسستك به تلقائياً.
              </p>
            </div>

            {tokenError && (
              <div className="p-3 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#fca5a5] text-xs text-center font-medium">
                {tokenError}
              </div>
            )}

            <button
              type="submit"
              disabled={tokenChecking}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#F0D38A] to-[#D7B45A] text-[#111] font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {tokenChecking ? (
                <span>جارٍ التحقق من الرابط...</span>
              ) : (
                <>
                  <span>التحقق والدخول إلى القسم المخصص</span>
                  <span>↗</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: CREDENTIALS LOGIN (Email / Password) */}
        {activeTab === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[#aaa] mb-1 font-medium">
                  البريد الإلكتروني المسجل لصاحب المؤسسة
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setCredError(null);
                  }}
                  placeholder="مثال: owner@louloua.dz أو admin@jourj.dz"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0b0b] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none dir-ltr text-left"
                />
              </div>

              <div>
                <label className="block text-xs text-[#aaa] mb-1 font-medium">
                  كلمة المرور أو رمز الأمان
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0b0b] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none dir-ltr text-left"
                />
              </div>
            </div>

            {credError && (
              <div className="p-3 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#fca5a5] text-xs text-center font-medium">
                {credError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#F0D38A] to-[#D7B45A] text-[#111] font-bold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              دخول إلى لوحة التحكم ♛
            </button>
          </form>
        )}

        {/* TAB 3: QUICK DEMO ACCOUNTS */}
        {activeTab === 'quick' && (
          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
            {/* Admin Profile */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#D7B45A]">الإدارة العامة (Super Admin):</span>
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
                  <span className="px-2.5 py-1 rounded-md bg-[#D7B45A]/20 text-[#D7B45A] text-[10px] font-bold">
                    Super Admin ♛
                  </span>
                </button>
              ))}
            </div>

            {/* Owner Profiles */}
            <div className="space-y-2 pt-2 border-t border-[#222]">
              <span className="text-[11px] font-bold text-[#D7B45A]">أصحاب المؤسسات المسجلين في الأقسام:</span>
              {ownerProfiles.map((p) => {
                const biz = businesses.find(b => b.owner_id === p.id);
                const cat = biz ? categories.find(c => c.id === biz.category_id) : null;

                return (
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
                      <div className="text-[10px] text-[#777]">
                        {biz?.name || p.email} {cat ? `(${cat.name})` : ''}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-[#252525] text-[#aaa] text-[10px] font-medium border border-[#333]">
                      {cat?.name || 'مالك مؤسسة'} 🏛️
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
