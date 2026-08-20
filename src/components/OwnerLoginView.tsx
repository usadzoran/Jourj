import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, ArrowLeft, LogIn, Sparkles } from 'lucide-react';
import { UserProfile, Business } from '../types';
import { DataService } from '../services/dataService';

interface OwnerLoginViewProps {
  onSuccess: (user: UserProfile, business?: Business) => void;
  onBackToHome: () => void;
}

export const OwnerLoginView: React.FC<OwnerLoginViewProps> = ({
  onSuccess,
  onBackToHome
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setLoading(true);
    try {
      const res = await DataService.login(email.trim(), password);
      if (res.success && res.user) {
        onSuccess(res.user, res.business);
      } else {
        setError(res.error || 'فشل تسجيل الدخول، تأكد من صحة البريد الإلكتروني');
      }
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123456');
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#1C1C1C] border border-[#D4AD54]/40 flex items-center justify-center mx-auto text-[#D4AD54] shadow-lg mb-3">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="font-luxury text-2xl md:text-3xl font-extrabold text-[#FFFFFF]">
          دخول أصحاب الأقسام
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-1">
          تسجيل الدخول لإدارة صفحة قسمك، الصور، والأسعار على jour j
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-[#1A1A1A] p-6 border border-[#2A2A2A] space-y-4 shadow-xl">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@example.dz"
              className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 pr-10 text-sm text-[#F7F5F0] outline-none transition-colors"
            />
            <Mail className="absolute right-3.5 top-3 w-4 h-4 text-[#737373]" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
            كلمة المرور
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

        <button
          id="owner-login-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#D4AD54] via-[#E2BA65] to-[#B88E2D] hover:opacity-95 text-[#121212] font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>دخول إلى لوحة التحكم</span>
            </>
          )}
        </button>

        {/* Demo Fast Login Helpers */}
        <div className="pt-4 mt-4 border-t border-[#262626] text-center">
          <span className="text-[11px] text-[#737373] block mb-2">
            حسابات تجريبية سريعة للاختبار:
          </span>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleQuickDemo('contact@el-louloua-oran.dz')}
              className="px-2.5 py-1 rounded-lg bg-[#262626] hover:bg-[#333333] text-[11px] text-[#E5C378] border border-[#3A3A3A] transition-colors"
            >
              قاعة اللؤلؤة
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('traiteur@saveurs-oran.dz')}
              className="px-2.5 py-1 rounded-lg bg-[#262626] hover:bg-[#333333] text-[11px] text-[#E5C378] border border-[#3A3A3A] transition-colors"
            >
              Saveurs d'Oran
            </button>
          </div>
        </div>
      </form>

      <div className="text-center mt-4">
        <button
          onClick={onBackToHome}
          className="text-xs text-[#A3A3A3] hover:text-[#D4AD54] flex items-center justify-center gap-1 mx-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>العودة إلى الصفحة الرئيسية للزوار</span>
        </button>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-[#141414] border border-[#262626] text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#D4AD54] font-medium mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ملاحظة لأصحاب الخدمات الجدد</span>
        </div>
        <p className="text-[11px] text-[#737373] leading-relaxed">
          يتم تسجيل أصحاب الأقسام حصريًا من خلال رابط دعوة خاص يرسله مدير المنصة عبر واتساب، ولا يتوفر تسجيل عام للزوار.
        </p>
      </div>
    </div>
  );
};
