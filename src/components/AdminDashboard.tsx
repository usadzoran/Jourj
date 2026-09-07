import React, { useState } from 'react';
import { api } from '../services/api';
import { Category, Business, RegistrationLink, Profile } from '../types';

interface AdminDashboardProps {
  categories: Category[];
  businesses: Business[];
  registrationLinks: RegistrationLink[];
  profiles: Profile[];
  onRefreshData: () => Promise<void>;
  onTestRegisterLink: (token: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  categories,
  businesses,
  registrationLinks,
  profiles,
  onRefreshData,
  onTestRegisterLink
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'businesses' | 'links'>('links');

  // Category modal / edit state
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [categorySaving, setCategorySaving] = useState(false);

  // Link generation state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || 'wedding-halls');
  const [linkDurationDays, setLinkDurationDays] = useState<number>(30);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Business filter
  const [businessCategoryFilter, setBusinessCategoryFilter] = useState<string>('all');

  // 1. Category Actions
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name || !editingCategory.id) return;
    setCategorySaving(true);
    await api.adminSaveCategory({
      id: editingCategory.id.trim().toLowerCase().replace(/\s+/g, '-'),
      name: editingCategory.name.trim(),
      description: editingCategory.description || null,
      image_url: editingCategory.image_url || null,
      active: editingCategory.active !== false,
      created_at: editingCategory.created_at || new Date().toISOString()
    });
    setCategorySaving(false);
    setEditingCategory(null);
    await onRefreshData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الفئة؟ سيتم حذف أو تعطيل المؤسسات التابعة لها.')) return;
    await api.adminDeleteCategory(id);
    await onRefreshData();
  };

  // 2. Link Generation Action
  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) return;
    setGeneratingLink(true);
    await api.adminCreateRegistrationLink(selectedCategoryId, linkDurationDays);
    setGeneratingLink(false);
    await onRefreshData();
  };

  const handleCopyLink = (token: string) => {
    const fullUrl = `${window.location.origin}${window.location.pathname}?token=${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  // 3. Business Toggle
  const handleToggleBusiness = async (id: string, currentStatus: boolean) => {
    await api.adminToggleBusinessStatus(id, !currentStatus);
    await onRefreshData();
  };

  const filteredBusinesses = businesses.filter(b => 
    businessCategoryFilter === 'all' ? true : b.category_id === businessCategoryFilter
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl border border-[#333] bg-gradient-to-r from-[#181818] via-[#1c1a14] to-[#181818] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#D7B45A] font-bold px-2.5 py-0.5 rounded-full bg-[#D7B45A]/15 border border-[#D7B45A]/30">
              لوحة الإدارة المركزية
            </span>
            <span className="text-xs text-[#888]">Super Admin Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F3EA]">
            إدارة منصة JOUR J
          </h1>
          <p className="text-xs text-[#999]">
            التحكم في الأقسام (Categories)، والمؤسسات (Businesses)، وتوليد روابط التسجيل للملاك الجدد.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#111] p-1.5 rounded-2xl border border-[#2b2b2b]">
          <button
            onClick={() => setActiveTab('links')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'links'
                ? 'bg-[#D7B45A] text-[#111] shadow-md'
                : 'text-[#aaa] hover:text-[#fff]'
            }`}
          >
            روابط التسجيل 🔗
          </button>
          <button
            onClick={() => setActiveTab('businesses')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'businesses'
                ? 'bg-[#D7B45A] text-[#111] shadow-md'
                : 'text-[#aaa] hover:text-[#fff]'
            }`}
          >
            المؤسسات ({businesses.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'categories'
                ? 'bg-[#D7B45A] text-[#111] shadow-md'
                : 'text-[#aaa] hover:text-[#fff]'
            }`}
          >
            الأقسام ({categories.length})
          </button>
        </div>
      </div>

      {/* TAB 1: REGISTRATION LINKS (Category-Based!) */}
      {activeTab === 'links' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Generator Card */}
          <div className="rounded-3xl border border-[#D7B45A]/30 bg-[#141414] p-6 sm:p-8 space-y-6 shadow-lg">
            <div className="space-y-1 border-b border-[#222] pb-4">
              <h2 className="text-lg font-bold text-[#F7F3EA] flex items-center gap-2">
                <span className="text-[#D7B45A]">✦</span> توليد رابط تسجيل جديد مرتبط بقسم محدد
              </h2>
              <p className="text-xs text-[#888]">
                اختر القسم (Category) الذي ينتمي إليه صاحب المؤسسة لتوليد رابط دعوة حصري مشفر وغير قابل للتلاعب بالفئة.
              </p>
            </div>

            <form onSubmit={handleCreateLink} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs text-[#aaa] mb-1 font-medium">
                  اختر الفئة المحددة (Category) <span className="text-[#ef4444]">*</span>
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-[#fff] focus:border-[#D7B45A] outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#aaa] mb-1 font-medium">
                  صلاحية الرابط (بالأيام)
                </label>
                <select
                  value={linkDurationDays}
                  onChange={(e) => setLinkDurationDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-[#fff] focus:border-[#D7B45A] outline-none"
                >
                  <option value={7}>7 أيام</option>
                  <option value={15}>15 يوماً</option>
                  <option value={30}>30 يوماً (الافتراضي)</option>
                  <option value={60}>60 يوماً</option>
                  <option value={90}>90 يوماً</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={generatingLink}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#F0D38A] to-[#D7B45A] text-[#111] font-bold text-xs shadow-md hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
                >
                  {generatingLink ? 'جارٍ التوليد...' : '+ توليد رابط الدعوة الآن'}
                </button>
              </div>
            </form>
          </div>

          {/* Links Table */}
          <div className="rounded-3xl border border-[#262626] bg-[#141414] overflow-hidden">
            <div className="p-5 border-b border-[#222] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F7F3EA] flex items-center gap-2">
                <span>📋</span> جميع روابط التسجيل المولدة ({registrationLinks.length})
              </h3>
              <span className="text-xs text-[#777]">مرتبطة تلقائياً بالفئات</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-[#181818] text-[#888] border-b border-[#262626]">
                    <th className="p-3.5 font-medium">الفئة المرتبطة (Category)</th>
                    <th className="p-3.5 font-medium">الرمز (Token)</th>
                    <th className="p-3.5 font-medium">الحالة</th>
                    <th className="p-3.5 font-medium">تاريخ الانتهاء</th>
                    <th className="p-3.5 font-medium text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]">
                  {registrationLinks.map((link) => {
                    const isExpired = new Date(link.expires_at) < new Date();
                    const categoryName = link.category?.name || categories.find(c => c.id === link.category_id)?.name || link.category_id;
                    const fullUrl = `${window.location.origin}${window.location.pathname}?token=${link.token}`;

                    return (
                      <tr key={link.id} className="hover:bg-[#1a1a1a]/50 transition-colors">
                        <td className="p-3.5 font-bold text-[#D7B45A] flex items-center gap-2">
                          <span>🏷️</span>
                          <span>{categoryName}</span>
                        </td>
                        <td className="p-3.5 font-mono text-[#F7F3EA] tracking-wider">
                          {link.token}
                        </td>
                        <td className="p-3.5">
                          {link.used ? (
                            <span className="px-2.5 py-1 rounded-full bg-[#6b7280]/20 text-[#9ca3af] text-[10px] font-bold border border-[#6b7280]/30">
                              تم الاستخدام ✕
                            </span>
                          ) : isExpired ? (
                            <span className="px-2.5 py-1 rounded-full bg-[#ef4444]/20 text-[#ef4444] text-[10px] font-bold border border-[#ef4444]/30">
                              منتهي الصلاحية ⚠️
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-[#10b981]/20 text-[#10b981] text-[10px] font-bold border border-[#10b981]/30">
                              صالح للتسجيل ✓
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-[#888]">
                          {new Date(link.expires_at).toLocaleDateString('ar-DZ')}
                        </td>
                        <td className="p-3.5 text-left">
                          <div className="flex items-center justify-end gap-2">
                            {/* Copy button */}
                            <button
                              onClick={() => handleCopyLink(link.token)}
                              className="px-3 py-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-[#D7B45A] text-[11px] font-medium transition-colors cursor-pointer"
                              title={fullUrl}
                            >
                              {copiedToken === link.token ? 'تم النسخ ✓' : 'نسخ الرابط'}
                            </button>

                            {/* Direct Test button if not used */}
                            {!link.used && !isExpired && (
                              <button
                                onClick={() => onTestRegisterLink(link.token)}
                                className="px-3 py-1.5 rounded-lg bg-[#D7B45A]/20 hover:bg-[#D7B45A]/30 text-[#D7B45A] text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                تجربة التسجيل ↗
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUSINESSES (Hierarchical Category ├── Businesses View) */}
      {activeTab === 'businesses' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#141414] border border-[#262626]">
            <div>
              <h2 className="text-base font-bold text-[#F7F3EA]">
                هيكلية المؤسسات حسب الفئات (Category ├── Businesses)
              </h2>
              <p className="text-xs text-[#888]">
                متابعة حالة كل مؤسسة، المالك المسند لها، وإمكانية التفعيل أو التعطيل.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#aaa]">تصفية:</span>
              <select
                value={businessCategoryFilter}
                onChange={(e) => setBusinessCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-[#fff] outline-none"
              >
                <option value="all">جميع الفئات ({businesses.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grouped by Category */}
          <div className="space-y-6">
            {categories
              .filter(cat => businessCategoryFilter === 'all' || cat.id === businessCategoryFilter)
              .map(cat => {
                const catBusinesses = businesses.filter(b => b.category_id === cat.id);
                return (
                  <div key={cat.id} className="rounded-2xl border border-[#2b2b2b] bg-[#141414] overflow-hidden">
                    {/* Category Group Header */}
                    <div className="p-4 bg-[#1a1a1a] border-b border-[#2b2b2b] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-base text-[#D7B45A]">📁</span>
                        <div>
                          <h3 className="text-sm font-bold text-[#F7F3EA]">{cat.name}</h3>
                          <span className="text-[10px] text-[#777] font-mono">{cat.id}</span>
                        </div>
                      </div>
                      <span className="text-xs text-[#D7B45A] bg-black/60 px-3 py-1 rounded-full border border-[#333]">
                        {catBusinesses.length} مؤسسات
                      </span>
                    </div>

                    {/* Businesses List */}
                    {catBusinesses.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#777]">
                        لا توجد مؤسسات مسجلة في هذا القسم بعد.
                      </div>
                    ) : (
                      <div className="divide-y divide-[#1f1f1f]">
                        {catBusinesses.map((biz) => {
                          const owner = profiles.find(p => p.id === biz.owner_id);
                          return (
                            <div key={biz.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#181818]/60 transition-colors">
                              <div className="flex items-center gap-3">
                                <img
                                  src={biz.main_image}
                                  alt={biz.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-[#333]"
                                />
                                <div>
                                  <h4 className="text-sm font-bold text-[#F7F3EA]">{biz.name}</h4>
                                  <div className="text-[11px] text-[#888] flex flex-wrap items-center gap-2">
                                    <span>📍 {biz.address}</span>
                                    <span>·</span>
                                    <span>📞 {biz.phone}</span>
                                    <span>·</span>
                                    <span>⭐ {biz.rating}</span>
                                  </div>
                                  <div className="text-[10px] text-[#D7B45A] mt-0.5">
                                    المالك: {owner ? `${owner.full_name} (${owner.email})` : 'غير محدد'}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 self-end sm:self-auto">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                  biz.active 
                                    ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30'
                                    : 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30'
                                }`}>
                                  {biz.active ? 'نشط ومعروض' : 'معطل ومخفي'}
                                </span>

                                <button
                                  onClick={() => handleToggleBusiness(biz.id, biz.active)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    biz.active
                                      ? 'bg-[#ef4444]/20 text-[#ef4444] hover:bg-[#ef4444]/30'
                                      : 'bg-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/30'
                                  }`}
                                >
                                  {biz.active ? 'تعطيل ✕' : 'تفعيل ✓'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141414] border border-[#262626]">
            <div>
              <h2 className="text-base font-bold text-[#F7F3EA]">إدارة الأقسام (Categories)</h2>
              <p className="text-xs text-[#888]">
                الأقسام هي المجموعات الرئيسية التي يراها الزائر في الصفحة الأولى.
              </p>
            </div>
            <button
              onClick={() => setEditingCategory({ active: true, id: '', name: '', description: '', image_url: '' })}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F0D38A] to-[#D7B45A] text-[#111] font-bold text-xs shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              + إضافة قسم جديد
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((c) => (
              <div key={c.id} className="rounded-2xl border border-[#2b2b2b] bg-[#141414] overflow-hidden flex flex-col justify-between">
                <div className="relative h-32 w-full bg-[#1e1e1e]">
                  <img
                    src={c.image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'}
                    alt={c.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[#D7B45A] text-[10px] font-mono">
                    {c.id}
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1">
                  <h3 className="text-base font-bold text-[#F7F3EA]">{c.name}</h3>
                  <p className="text-xs text-[#888] line-clamp-2">{c.description || 'لا يوجد وصف'}</p>
                </div>

                <div className="p-3 bg-[#181818] border-t border-[#222] flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.active ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>
                    {c.active ? 'نشط' : 'معطل'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCategory(c)}
                      className="text-xs text-[#D7B45A] hover:underline"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="text-xs text-[#ef4444] hover:underline"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCategory}
            className="w-full max-w-md rounded-3xl border border-[#333] bg-[#141414] p-6 space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-bold text-[#F7F3EA] border-b border-[#262626] pb-3">
              {editingCategory.created_at ? 'تعديل القسم' : 'إضافة قسم جديد'}
            </h3>

            <div>
              <label className="block text-xs text-[#aaa] mb-1">المعرف الفريد (ID بالإنجليزية)</label>
              <input
                type="text"
                required
                disabled={Boolean(editingCategory.created_at)}
                value={editingCategory.id || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, id: e.target.value })}
                placeholder="wedding-halls"
                className="w-full px-3 py-2 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-[#fff] outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs text-[#aaa] mb-1">اسم القسم بالعربية</label>
              <input
                type="text"
                required
                value={editingCategory.name || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                placeholder="قاعة الأعراس"
                className="w-full px-3 py-2 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-[#fff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#aaa] mb-1">رابط الصورة</label>
              <input
                type="url"
                value={editingCategory.image_url || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, image_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-[#fff] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#aaa] mb-1">الوصف</label>
              <textarea
                rows={2}
                value={editingCategory.description || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                placeholder="وصف مختصر للقسم..."
                className="w-full px-3 py-2 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-[#fff] outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="cat-active"
                checked={editingCategory.active !== false}
                onChange={(e) => setEditingCategory({ ...editingCategory, active: e.target.checked })}
              />
              <label htmlFor="cat-active" className="text-xs text-[#E0E0E0]">تفعيل هذا القسم في الواجهة</label>
            </div>

            <div className="pt-3 border-t border-[#262626] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 rounded-xl bg-[#222] text-xs text-[#aaa] hover:bg-[#333]"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={categorySaving}
                className="px-5 py-2 rounded-xl bg-[#D7B45A] text-xs font-bold text-[#111] hover:brightness-110"
              >
                {categorySaving ? 'جارٍ الحفظ...' : 'حفظ القسم'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
