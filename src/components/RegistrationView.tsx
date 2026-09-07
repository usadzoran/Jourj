import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Category, RegistrationLink, Profile, Business } from '../types';

interface RegistrationViewProps {
  token: string;
  onSuccess: (profile: Profile, business: Business) => void;
  onCancel: () => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  token,
  onSuccess,
  onCancel
}) => {
  const [loading, setLoading] = useState(true);
  const [verifyingError, setVerifyingError] = useState<string | null>(null);
  const [verifiedLink, setVerifiedLink] = useState<RegistrationLink | null>(null);
  const [assignedCategory, setAssignedCategory] = useState<Category | null>(null);

  // Form states
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  
  const [businessName, setBusinessName] = useState('');
  const [businessTitle, setBusinessTitle] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessLocation, setBusinessLocation] = useState('وهران، الجزائر');
  const [businessPrice, setBusinessPrice] = useState<number>(100000);
  const [businessPriceUnit, setBusinessPriceUnit] = useState('دج');
  const [businessMainImage, setBusinessMainImage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const verify = async () => {
      setLoading(true);
      setVerifyingError(null);
      
      const res = await api.verifyRegistrationToken(token);
      if (!isMounted) return;

      if (!res.valid || !res.link || !res.category) {
        setVerifyingError(res.error || 'رابط التسجيل غير صالح.');
        setLoading(false);
        return;
      }

      setVerifiedLink(res.link);
      setAssignedCategory(res.category);
      setBusinessMainImage(res.category.image_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80');
      setLoading(false);
    };

    verify();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedLink || !assignedCategory) return;

    if (!ownerName.trim() || !ownerEmail.trim() || !businessName.trim() || !businessAddress.trim()) {
      setSubmitError('يرجى ملء جميع الحقول الإلزامية.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const res = await api.registerOwnerAndBusiness({
      token,
      ownerName,
      ownerEmail,
      ownerPhone,
      businessName,
      businessTitle: businessTitle || businessName,
      businessDescription,
      businessPhone: ownerPhone,
      businessAddress,
      businessLocation,
      businessPrice,
      businessPriceUnit,
      businessMainImage: businessMainImage || assignedCategory.image_url || ''
    });

    setSubmitting(false);

    if (!res.success || !res.profile || !res.business) {
      setSubmitError(res.error || 'حدث خطأ أثناء إتمام عملية التسجيل.');
      return;
    }

    // Success! Redirect to Owner dashboard
    onSuccess(res.profile, res.business);
  };

  if (loading) {
    return (
      <div className="w-full max-w-lg mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#D7B45A] border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-[#888]">جارٍ التحقق من صلاحية رابط الدعوة...</p>
      </div>
    );
  }

  if (verifyingError) {
    return (
      <div className="w-full max-w-md mx-auto py-12 px-4">
        <div className="p-8 rounded-3xl border border-[#ef4444]/30 bg-[#161212] text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/40 text-[#ef4444] text-2xl flex items-center justify-center mx-auto">
            ✕
          </div>
          <h2 className="text-lg font-bold text-[#F7F3EA]">تعذر المتابعة</h2>
          <p className="text-xs sm:text-sm text-[#ff9999] leading-relaxed">
            {verifyingError}
          </p>
          <div className="pt-2">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 rounded-full bg-[#222] hover:bg-[#333] text-xs text-[#E0E0E0] transition-colors cursor-pointer"
            >
              العودة إلى الصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-[#D7B45A]/40 bg-gradient-to-b from-[#191814] to-[#121212] p-6 text-center space-y-3 shadow-xl">
        <span className="px-3 py-1 rounded-full bg-[#D7B45A]/15 border border-[#D7B45A]/30 text-[#D7B45A] text-xs font-semibold">
          رابط دعوة حصري معتمد
        </span>
        <h1 className="text-2xl font-serif font-bold text-[#F7F3EA]">
          تسجيل مؤسسة جديدة في منصة JOUR J
        </h1>
        <p className="text-xs text-[#999] max-w-md mx-auto">
          أهلاً بك! يرجى إدخال بيانات مؤسستك وحساب المالك للانضمام إلى شبكتنا في وهران.
        </p>

        {/* LOCKED CATEGORY BADGE */}
        {assignedCategory && (
          <div className="pt-3 border-t border-[#262626] flex items-center justify-center gap-3">
            <div className="text-xs text-[#aaa]">الفئة المحددة للرابط:</div>
            <div className="px-4 py-1.5 rounded-xl bg-[#000] border border-[#D7B45A] text-[#D7B45A] text-xs font-bold flex items-center gap-2">
              <span>🔒</span>
              <span>{assignedCategory.name}</span>
              <span className="text-[10px] text-[#888] font-normal">(غير قابلة للتغيير)</span>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-3xl border border-[#262626] bg-[#141414] p-6 sm:p-8 space-y-6">
        {submitError && (
          <div className="p-3.5 rounded-xl bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#ef4444] text-xs text-center">
            {submitError}
          </div>
        )}

        {/* Section 1: Owner Profile */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#D7B45A] border-b border-[#222] pb-2 flex items-center gap-2">
            <span>👤</span> بيانات صاحب المؤسسة (Business Owner)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#aaa] mb-1 font-medium">
                الاسم الكامل للمالك <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="مثال: يوسف بلحاج"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#aaa] mb-1 font-medium">
                البريد الإلكتروني <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="owner@example.dz"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-[#aaa] mb-1 font-medium">
                رقم هاتف المالك / الواتساب <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="tel"
                required
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                placeholder="+213 550 12 34 56"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Business Profile */}
        <div className="space-y-4 pt-4 border-t border-[#222]">
          <h2 className="text-sm font-bold text-[#D7B45A] border-b border-[#222] pb-2 flex items-center gap-2">
            <span>🏛️</span> بيانات المؤسسة والخدمة
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#aaa] mb-1 font-medium">
                اسم المؤسسة التجاري <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="مثال: قاعة الأندلس الملكية"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#aaa] mb-1 font-medium">
                عنوان فرعي / وصف مختصر
              </label>
              <input
                type="text"
                value={businessTitle}
                onChange={(e) => setBusinessTitle(e.target.value)}
                placeholder="مثال: أرقى قاعة للمناسبات والأعراس"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#aaa] mb-1 font-medium">
                السعر المبدئي للخدمة <span className="text-[#ef4444]">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  required
                  min="0"
                  step="500"
                  value={businessPrice}
                  onChange={(e) => setBusinessPrice(Number(e.target.value))}
                  className="w-2/3 px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
                />
                <input
                  type="text"
                  value={businessPriceUnit}
                  onChange={(e) => setBusinessPriceUnit(e.target.value)}
                  placeholder="دج"
                  className="w-1/3 px-2 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white text-center focus:border-[#D7B45A] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#aaa] mb-1 font-medium">
                المدينة / المنطقة
              </label>
              <input
                type="text"
                value={businessLocation}
                onChange={(e) => setBusinessLocation(e.target.value)}
                placeholder="وهران، الجزائر"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-[#aaa] mb-1 font-medium">
                العنوان التفصيلي <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                required
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="مثال: حي العقيد لطفي، بالقرب من المركز التجاري"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-[#aaa] mb-1 font-medium">
                رابط الصورة الرئيسية للمؤسسة
              </label>
              <input
                type="url"
                value={businessMainImage}
                onChange={(e) => setBusinessMainImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
              />
              <p className="text-[10px] text-[#777] mt-1">
                يمكنك استخدام صورة مؤقتة وتغييرها لاحقاً من لوحة تحكم مؤسستك.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-[#aaa] mb-1 font-medium">
                وصف شامل لخدمات ومميزات المؤسسة
              </label>
              <textarea
                rows={3}
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="اكتب نبذة عن السعة، الديكورات، التجهيزات، العروض والخدمات المتاحة..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-[#222] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1e1e1e] hover:bg-[#252525] text-xs text-[#aaa] transition-colors"
          >
            إلغاء
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#F0D38A] to-[#D7B45A] text-[#111] font-bold text-xs shadow-lg hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'جارٍ تسجيل المؤسسة والحساب...' : 'تأكيد التسجيل وإنشاء المؤسسة ✓'}
          </button>
        </div>
      </form>
    </div>
  );
};
