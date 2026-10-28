import React, { useState } from 'react';
import { Profile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: Profile[];
  onSelectUser: (profile: Profile) => void;
  onEnterToken?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, profiles, onSelectUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const found = profiles.find(profile => profile.email.toLowerCase() === email.trim().toLowerCase() || profile.full_name.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      setError('لم يتم العثور على حساب معتمد بهذا البريد. تتم تهيئة حساب المؤسسة بعد موافقة الإدارة فقط.');
      return;
    }
    if (!password.trim()) {
      setError('يرجى إدخال كلمة المرور أو رمز الأمان الخاص بالحساب.');
      return;
    }
    onSelectUser(found);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-lg rounded-3xl border border-[#D7B45A]/30 bg-[#141414] p-6 sm:p-8 space-y-6 shadow-2xl relative text-right">
        <button onClick={onClose} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#202020] text-[#aaa] hover:text-white">✕</button>
        <div className="text-center space-y-2 pt-1">
          <div className="w-12 h-12 rounded-full border border-[#D7B45A]/50 bg-[#1a1a1a] flex items-center justify-center mx-auto text-[#D7B45A] text-xl">♛</div>
          <h2 className="text-xl font-bold font-serif text-[#F7F3EA]">تسجيل دخول المؤسسات والمشرفين</h2>
          <p className="text-xs text-[#999]">الدخول متاح للحسابات التي فعّلتها إدارة Jour J بعد قبول الطلب.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="block text-xs text-[#aaa] mb-1">البريد الإلكتروني</label><input type="email" required value={email} onChange={event => setEmail(event.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0b0b] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none" /></div>
          <div><label className="block text-xs text-[#aaa] mb-1">كلمة المرور</label><input type="password" required value={password} onChange={event => setPassword(event.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0b0b] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none" /></div>
          {error && <div className="p-3 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#fca5a5] text-xs text-center">{error}</div>}
          <button type="submit" className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#F0D38A] to-[#D7B45A] text-[#111] font-bold text-xs">تسجيل الدخول</button>
        </form>
      </div>
    </div>
  );
};
