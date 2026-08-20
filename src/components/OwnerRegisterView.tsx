import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, User, Phone, Mail, AlertCircle, ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Business, RegistrationLink, UserProfile } from '../types';
import { DataService } from '../services/dataService';

interface OwnerRegisterViewProps {
  token: string;
  onSuccess: (user: UserProfile, business: Business) => void;
  onBackToHome: () => void;
}

export const OwnerRegisterView: React.FC<OwnerRegisterViewProps> = ({
  token,
  onSuccess,
  onBackToHome
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [_link, setLink] = useState<RegistrationLink | null>(null);

  // Form inputs
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      setLoading(true);
      setError(null);
      const res = await DataService.verifyRegistrationToken(token);
      if (res.valid && res.business && res.link) {
        setBusiness(res.business);
        setLink(res.link);
        if (res.business.phone) setPhone(res.business.phone);
        if (res.business.email) setEmail(res.business.email);
      } else {
        setError(res.error || 'رابط الدعوة غير صالح أو منتهي الصلاحية');
      }
      setLoading(false);
    };

    verify();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !phone.trim() || !email.trim() || !password) {
      setFormError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (password.length < 6) {
      setFormError('كلمة المرور يجب أن تتكون من 6 أحرف على الأقل');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('كلمات المرور غير متطابقة');
      return;
    }

    setSubmitting(true);
    try {
      const res = await DataService.registerOwnerWithToken(token, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password
      });

      if (res.success && res.user && res.business) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AD54', '#E2BA65', '#FFFFFF']
        });

        setTimeout(() => {
          onSuccess(res.user!, res.business!);
        }, 800);
      } else {
        setFormError(res.error || 'حدث خطأ أثناء إنشاء الحساب');
      }
    } catch (err: any) {
      setFormError(err?.message || 'حدث خطأ غير متوقع');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-[#D4AD54]">
        <div className="w-10 h-10 border-2 border-[#D4AD54] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#A3A3A3]">جاري التحقق من رمز الدعوة...</span>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-[#1A1A1A] border border-[#333333] text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-[#FFFFFF]">رابط الدعوة غير متاح</h3>
        <p className="text-sm text-[#A3A3A3] leading-relaxed">
          {error || 'عذرًا، رمز الدعوة غير صالح، تم استخدامه مسبقًا، أو انتهت صلاحيته.'}
        </p>
        <p className="text-xs text-[#737373]">
          يرجى التواصل مع إدارة منصة jour j للحصول على رابط دعوة جديد.
        </p>
        <button
          onClick={onBackToHome}
          className="mt-4 px-6 py-2.5 rounded-xl bg-[#262626] hover:bg-[#333333] text-[#D4AD54] text-sm font-bold transition-colors"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-8 px-4">
      {/* Header card with jour j badge */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AD54]/10 border border-[#D4AD54]/30 text-xs text-[#D4AD54] font-medium mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>دعوة رسمية حصرية لصاحب القسم</span>
        </div>
        <h2 className="font-luxury text-2xl md:text-3xl font-extrabold text-[#FFFFFF]">
          إنشاء حساب صاحب القسم
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-1">
          أكمل التسجيل لإدارة وتحديث بياناتك، صورك، وأسعارك مباشرة على jour j
        </p>
      </div>

      {/* Auto-detected Bound Business Card */}
      <div className="rounded-xl bg-gradient-to-r from-[#1E1B14] to-[#171717] p-4 border border-[#D4AD54]/40 mb-6 flex items-start gap-3.5 shadow-md">
        <div className="w-10 h-10 rounded-lg bg-[#D4AD54]/20 border border-[#D4AD54]/50 flex items-center justify-center text-[#D4AD54] shrink-0 mt-0.5">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-[#A3A3A3]">أنت تقوم بالتسجيل لإدارة:</span>
          <h4 className="font-luxury text-base font-bold text-[#FFFFFF]">
            {business.name}
          </h4>
          <span className="text-xs text-[#D4AD54] font-medium">
            📍 {business.location}
          </span>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl bg-[#1A1A1A] p-6 border border-[#2A2A2A] space-y-4 shadow-xl">
        {formError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
            الاسم الكامل (المسؤول) *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="مثال: محمد بن علي"
              className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 pr-10 text-sm text-[#F7F5F0] outline-none transition-colors"
            />
            <User className="absolute right-3.5 top-3 w-4 h-4 text-[#737373]" />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
            رقم الهاتف للتواصل *
          </label>
          <div className="relative">
            <input
              type="tel"
              required
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+213 555 ..."
              className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 pr-10 text-sm text-[#F7F5F0] outline-none transition-colors font-mono"
            />
            <Phone className="absolute right-3.5 top-3 w-4 h-4 text-[#737373]" />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
            البريد الإلكتروني لتسجيل الدخول *
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@example.com"
              className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 pr-10 text-sm text-[#F7F5F0] outline-none transition-colors"
            />
            <Mail className="absolute right-3.5 top-3 w-4 h-4 text-[#737373]" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
            كلمة المرور *
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 pr-10 text-sm text-[#F7F5F0] outline-none transition-colors font-mono"
            />
            <Lock className="absolute right-3.5 top-3 w-4 h-4 text-[#737373]" />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
            تأكيد كلمة المرور *
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 pr-10 text-sm text-[#F7F5F0] outline-none transition-colors font-mono"
            />
            <Lock className="absolute right-3.5 top-3 w-4 h-4 text-[#737373]" />
          </div>
        </div>

        {/* Submit Button */}
        <button
          id="owner-register-submit-btn"
          type="submit"
          disabled={submitting}
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#D4AD54] via-[#E2BA65] to-[#B88E2D] hover:opacity-90 text-[#121212] font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>إنشاء الحساب وبدء الإدارة</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-4">
        <button
          onClick={onBackToHome}
          className="text-xs text-[#A3A3A3] hover:text-[#D4AD54] flex items-center justify-center gap-1 mx-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>العودة إلى الصفحة الرئيسية</span>
        </button>
      </div>
    </div>
  );
};
