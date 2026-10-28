import React, { useState } from 'react';
import { api } from '../services/api';
import { Category } from '../types';

interface RegistrationViewProps {
  categories: Category[];
  onCancel: () => void;
  onSubmitted: () => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({ categories, onCancel, onSubmitted }) => {
  const [form, setForm] = useState({
    businessName: '', ownerName: '', categoryId: categories[0]?.id || '', wilaya: 'وهران',
    municipality: '', address: '', phone: '', email: '', description: '', priceRange: '', imageUrls: '', notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!form.businessName.trim() || !form.ownerName.trim() || !form.categoryId || !form.wilaya.trim() || !form.municipality.trim() || !form.address.trim() || !form.phone.trim() || !form.description.trim()) {
      setError('يرجى ملء جميع الحقول الأساسية قبل الإرسال.');
      return;
    }
    setSubmitting(true);
    const result = await api.submitJoinRequest({
      business_name: form.businessName.trim(), owner_name: form.ownerName.trim(), category_id: form.categoryId,
      wilaya: form.wilaya.trim(), municipality: form.municipality.trim(), address: form.address.trim(),
      phone: form.phone.trim(), email: form.email.trim() || null, description: form.description.trim(),
      price_range: form.priceRange.trim() || null,
      image_urls: form.imageUrls.split(/\n|,/).map(value => value.trim()).filter(Boolean),
      notes: form.notes.trim() || null
    });
    setSubmitting(false);
    if (!result.success) {
      setError(result.error || 'تعذر إرسال الطلب. حاول مرة أخرى.');
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-16">
        <div className="rounded-3xl border border-[#10b981]/30 bg-[#101b16] p-8 text-center space-y-5 shadow-xl">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] text-3xl flex items-center justify-center">✓</div>
          <h1 className="text-2xl font-serif font-bold text-[#F7F3EA]">تم إرسال طلبك بنجاح</h1>
          <p className="text-sm text-[#b7c9be] leading-relaxed">أُرسل طلب الانضمام إلى إدارة Jour J وهو الآن قيد المراجعة. لن تُنشر المؤسسة ولن تُنشأ صلاحيات دخول قبل موافقة الإدارة.</p>
          <button onClick={onSubmitted} className="gold-button px-6 py-3 rounded-xl text-[#111] font-bold text-xs">العودة إلى الصفحة الرئيسية</button>
        </div>
      </div>
    );
  }

  const field = (label: string, key: keyof typeof form, required = false, type = 'text') => (
    <div>
      <label className="block text-xs text-[#aaa] mb-1 font-medium">{label} {required && <span className="text-[#ef4444]">*</span>}</label>
      <input type={type} required={required} value={form[key]} onChange={event => update(key, event.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none" />
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 space-y-6" dir="rtl">
      <div className="rounded-3xl border border-[#D7B45A]/40 bg-gradient-to-b from-[#191814] to-[#121212] p-6 text-center space-y-3 shadow-xl">
        <span className="px-3 py-1 rounded-full bg-[#D7B45A]/15 border border-[#D7B45A]/30 text-[#D7B45A] text-xs font-semibold">انضم إلى شبكة Jour J</span>
        <h1 className="text-2xl font-serif font-bold text-[#F7F3EA]">أنشئ مؤسستك على منصة JOUR J</h1>
        <p className="text-xs text-[#999] max-w-xl mx-auto">أرسل بيانات مؤسستك. ستراجعها الإدارة قبل اعتمادها ونشرها، ولا تحتاج إلى إنشاء حساب إداري في هذه المرحلة.</p>
      </div>
      <form onSubmit={handleSubmit} className="rounded-3xl border border-[#262626] bg-[#141414] p-6 sm:p-8 space-y-6">
        {error && <div className="p-3.5 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/40 text-[#ff9999] text-xs text-center">{error}</div>}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-[#D7B45A] border-b border-[#222] pb-2">بيانات المؤسسة وصاحبها</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('اسم المؤسسة', 'businessName', true)}
            {field('اسم صاحب المؤسسة', 'ownerName', true)}
            <div><label className="block text-xs text-[#aaa] mb-1 font-medium">القسم <span className="text-[#ef4444]">*</span></label><select required value={form.categoryId} onChange={event => update('categoryId', event.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none">{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
            {field('رقم الهاتف', 'phone', true, 'tel')}
            {field('البريد الإلكتروني (اختياري)', 'email', false, 'email')}
            {field('الولاية', 'wilaya', true)}
            {field('البلدية', 'municipality', true)}
            <div className="sm:col-span-2">{field('العنوان التفصيلي', 'address', true)}</div>
          </div>
        </section>
        <section className="space-y-4 pt-4 border-t border-[#222]">
          <h2 className="text-sm font-bold text-[#D7B45A] border-b border-[#222] pb-2">النشاط والخدمات</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><label className="block text-xs text-[#aaa] mb-1 font-medium">وصف النشاط والخدمات <span className="text-[#ef4444]">*</span></label><textarea required rows={4} value={form.description} onChange={event => update('description', event.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none" /></div>
            {field('الأسعار أو نطاق الأسعار (اختياري)', 'priceRange')}
            <div className="sm:col-span-2"><label className="block text-xs text-[#aaa] mb-1 font-medium">روابط الصور أو نماذج الأعمال (رابط في كل سطر)</label><textarea rows={3} value={form.imageUrls} onChange={event => update('imageUrls', event.target.value)} placeholder="https://..." className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none" /></div>
            <div className="sm:col-span-2"><label className="block text-xs text-[#aaa] mb-1 font-medium">ملاحظات إضافية (اختياري)</label><textarea rows={3} value={form.notes} onChange={event => update('notes', event.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none" /></div>
          </div>
        </section>
        <div className="pt-4 border-t border-[#222] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button type="button" onClick={onCancel} className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1e1e1e] text-xs text-[#aaa]">إلغاء</button>
          <button type="submit" disabled={submitting} className="w-full sm:w-auto gold-button px-7 py-3 rounded-xl text-[#111] font-bold text-xs disabled:opacity-50">{submitting ? 'جارٍ إرسال الطلب...' : 'إرسال الطلب للمراجعة'}</button>
        </div>
      </form>
    </div>
  );
};
