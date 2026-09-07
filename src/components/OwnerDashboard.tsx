import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Profile, Business, Category, PortfolioItem, Availability, DayOfWeek } from '../types';

interface OwnerDashboardProps {
  currentUser: Profile;
  onPreviewBusiness: (businessId: string) => void;
  onRefreshData: () => Promise<void>;
}

const DAYS: DayOfWeek[] = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  currentUser,
  onPreviewBusiness,
  onRefreshData
}) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit form states
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState<number>(100000);
  const [priceUnit, setPriceUnit] = useState('دج');
  const [mainImage, setMainImage] = useState('');

  // Status
  const [savingInfo, setSavingInfo] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Portfolio add
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');

  // Load owner's specific business ONLY (strict isolation)
  const loadData = async () => {
    setLoading(true);
    // Strict lookup: owner_id = currentUser.id
    const biz = await api.ownerGetMyBusiness(currentUser.id);
    if (biz) {
      setBusiness(biz);
      setName(biz.name);
      setTitle(biz.title || '');
      setDescription(biz.description || '');
      setPhone(biz.phone);
      setAddress(biz.address);
      setLocation(biz.location);
      setPrice(biz.price);
      setPriceUnit(biz.price_unit);
      setMainImage(biz.main_image);

      // Load category
      const cat = await api.getCategoryById(biz.category_id);
      setCategory(cat);

      // Load portfolio & availability
      const ports = await api.getPortfolio(biz.id);
      setPortfolio(ports);

      const avails = await api.getAvailability(biz.id);
      setAvailability(avails);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [currentUser.id]);

  // Handle Save Info (with Category Lock Enforcement!)
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    setSavingInfo(true);
    setSaveError(null);
    setSaveSuccess(false);

    // CRITICAL: We NEVER pass category_id to update!
    const res = await api.ownerUpdateBusiness(business.id, currentUser.id, {
      name: name.trim(),
      title: title.trim(),
      description: description.trim() || null,
      phone: phone.trim(),
      address: address.trim(),
      location: location.trim(),
      price: Number(price),
      price_unit: priceUnit.trim(),
      main_image: mainImage.trim()
    });

    setSavingInfo(false);

    if (!res.success || !res.business) {
      setSaveError(res.error || 'فشل حفظ التعديلات.');
      return;
    }

    setBusiness(res.business);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    await onRefreshData();
  };

  // Portfolio Actions
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !newPhotoUrl.trim()) return;

    const newItem: PortfolioItem = {
      id: 'port-' + Math.random().toString(36).substring(2, 9),
      business_id: business.id,
      image_url: newPhotoUrl.trim(),
      title: newPhotoTitle.trim() || null,
      sort_order: portfolio.length + 1,
      created_at: new Date().toISOString()
    };

    const updated = [...portfolio, newItem];
    const saved = await api.ownerSavePortfolio(business.id, currentUser.id, updated);
    setPortfolio(saved);
    setNewPhotoUrl('');
    setNewPhotoTitle('');
  };

  const handleRemovePhoto = async (id: string) => {
    if (!business) return;
    const updated = portfolio.filter(p => p.id !== id);
    const saved = await api.ownerSavePortfolio(business.id, currentUser.id, updated);
    setPortfolio(saved);
  };

  // Availability Actions
  const handleToggleDay = async (day: DayOfWeek, currentStatus: boolean) => {
    if (!business) return;
    const updatedList = availability.map(a => 
      a.day === day ? { ...a, available: !currentStatus } : a
    );
    const saved = await api.ownerSaveAvailability(business.id, currentUser.id, updatedList);
    setAvailability(saved);
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto py-16 text-center space-y-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#D7B45A] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-[#888]">جارٍ تحميل بيانات مؤسستك...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="w-full max-w-md mx-auto py-16 px-4 text-center">
        <div className="p-8 rounded-3xl border border-[#2b2b2b] bg-[#141414] space-y-4">
          <div className="text-3xl">🏛️</div>
          <h2 className="text-lg font-bold text-[#F7F3EA]">لم يتم العثور على مؤسسة مسجلة</h2>
          <p className="text-xs text-[#888]">
            حسابك مسجل كمالك ({currentUser.email}) ولكن لم يتم ربط مؤسسة به بعد. استخدم رابط الدعوة للتسجيل.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner with Preview Button */}
      <div className="rounded-3xl border border-[#D7B45A]/30 bg-gradient-to-r from-[#171612] via-[#1a1914] to-[#171612] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D7B45A]/20 text-[#D7B45A] text-xs font-bold border border-[#D7B45A]/40">
              لوحة تحكم المؤسسة الخاصة
            </span>
            <span className="text-xs text-[#888]">إدارة معزولة بالكامل</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F7F3EA]">
            {business.name}
          </h1>
          <p className="text-xs text-[#999]">
            مرحباً {currentUser.full_name}. يمكنك هنا تحديث بيانات مؤسستك، معرض الصور، وجدول التوفر الأسبوعي.
          </p>
        </div>

        {/* Action button: preview as visitor */}
        <button
          onClick={() => onPreviewBusiness(business.id)}
          className="px-4 py-2.5 rounded-xl bg-[#242424] hover:bg-[#2c2c2c] text-[#D7B45A] border border-[#D7B45A]/40 text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
        >
          <span>👁️</span>
          <span>معاينة صفحة المؤسسة كما يراها الزوار</span>
        </button>
      </div>

      {/* Main Grid: Info + Portfolio + Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Business Information */}
        <div className="lg:col-span-2 space-y-8">
          {/* Form */}
          <form onSubmit={handleSaveInfo} className="rounded-3xl border border-[#262626] bg-[#141414] p-6 sm:p-8 space-y-6 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
              <h2 className="text-base font-bold text-[#F7F3EA] flex items-center gap-2">
                <span className="text-[#D7B45A]">✦</span> البيانات الأساسية للمؤسسة
              </h2>
              {saveSuccess && (
                <span className="text-xs font-bold text-[#10b981] bg-[#10b981]/15 px-3 py-1 rounded-full border border-[#10b981]/30">
                  تم حفظ التعديلات بنجاح ✓
                </span>
              )}
            </div>

            {saveError && (
              <div className="p-3 rounded-xl bg-[#ef4444]/20 border border-[#ef4444]/30 text-[#ef4444] text-xs">
                {saveError}
              </div>
            )}

            {/* LOCKED CATEGORY DISPLAY */}
            <div className="p-3.5 rounded-2xl bg-[#0c0c0c] border border-[#2b2b2b] flex items-center justify-between">
              <div>
                <span className="block text-[11px] text-[#777]">فئة المؤسسة (مقفلة وغير قابلة للتغيير):</span>
                <span className="text-xs font-bold text-[#D7B45A]">
                  {category ? category.name : business.category_id}
                </span>
              </div>
              <span className="text-[10px] text-[#888] px-2.5 py-1 rounded-md bg-[#181818] border border-[#333] flex items-center gap-1">
                <span>🔒</span>
                <span>محمية أمنياً</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#aaa] mb-1 font-medium">اسم المؤسسة</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#aaa] mb-1 font-medium">عنوان فرعي / شعار</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#aaa] mb-1 font-medium">رقم الهاتف للحجز</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#aaa] mb-1 font-medium">السعر المبدئي</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-2/3 px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
                  />
                  <input
                    type="text"
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                    className="w-1/3 px-2 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white text-center focus:border-[#D7B45A] outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-[#aaa] mb-1 font-medium">العنوان التفصيلي</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-[#aaa] mb-1 font-medium">رابط الصورة الرئيسية</label>
                <input
                  type="url"
                  required
                  value={mainImage}
                  onChange={(e) => setMainImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-[#aaa] mb-1 font-medium">الوصف الشامل للخدمة والمميزات</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e0e] border border-[#333] text-xs text-white focus:border-[#D7B45A] outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#222] flex justify-end">
              <button
                type="submit"
                disabled={savingInfo}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F0D38A] to-[#D7B45A] text-[#111] font-bold text-xs shadow-md hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
              >
                {savingInfo ? 'جارٍ الحفظ...' : 'حفظ التغييرات ✓'}
              </button>
            </div>
          </form>

          {/* Portfolio Section */}
          <div className="rounded-3xl border border-[#262626] bg-[#141414] p-6 sm:p-8 space-y-6 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
              <div>
                <h2 className="text-base font-bold text-[#F7F3EA] flex items-center gap-2">
                  <span className="text-[#D7B45A]">✦</span> معرض الصور (Portfolio)
                </h2>
                <p className="text-xs text-[#888]">
                  أضف صور القاعة، الديكورات، الأطباق لتظهر في صفحتك للزوار.
                </p>
              </div>
              <span className="text-xs text-[#D7B45A] bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#333]">
                {portfolio.length} صور
              </span>
            </div>

            {/* Add Photo Form */}
            <form onSubmit={handleAddPhoto} className="p-4 rounded-2xl bg-[#0e0e0e] border border-[#262626] grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="sm:col-span-2">
                <label className="block text-[10px] text-[#aaa] mb-1">رابط الصورة (URL)</label>
                <input
                  type="url"
                  required
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-[#141414] border border-[#333] text-xs text-white outline-none"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-[#222] hover:bg-[#D7B45A] hover:text-[#111] text-[#D7B45A] border border-[#D7B45A]/40 text-xs font-bold transition-all cursor-pointer"
                >
                  + إضافة للمعرض
                </button>
              </div>
            </form>

            {/* Existing Portfolio Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {portfolio.map((item) => (
                <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden border border-[#2b2b2b] bg-[#181818] group">
                  <img
                    src={item.image_url}
                    alt={item.title || 'صورة المعرض'}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemovePhoto(item.id)}
                    className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/80 text-[#ef4444] text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    حذف ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Availability Management */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#262626] bg-[#141414] p-6 space-y-4 shadow-lg">
            <div className="space-y-1 border-b border-[#222] pb-3">
              <h3 className="text-sm font-bold text-[#F7F3EA] flex items-center gap-2">
                <span>📅</span> جدول الأيام المتاحة
              </h3>
              <p className="text-[11px] text-[#888]">
                حدد أيام الأسبوع المتاحة للحجز والاستقبال. تظهر هذه التحديثات فوراً للزوار.
              </p>
            </div>

            <div className="space-y-2">
              {DAYS.map((day) => {
                const match = availability.find(a => a.day === day);
                const isAvail = match ? match.available : true;
                return (
                  <div
                    key={day}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0e0e0e] border border-[#222]"
                  >
                    <span className="text-xs font-medium text-[#E0E0E0]">{day}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleDay(day, isAvail)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        isAvail
                          ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                          : 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40'
                      }`}
                    >
                      {isAvail ? 'متاح للحجز ✓' : 'غير متاح ✕'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Support Card */}
          <div className="rounded-2xl border border-[#262626] bg-[#111] p-5 space-y-2 text-xs text-[#888]">
            <span className="font-bold text-[#D7B45A] block">الدعم الفني لمنصة JOUR J</span>
            <p className="leading-relaxed">
              إذا كنت بحاجة لتحديث بيانات الفئة أو إعدادات متقدمة، يمكنك التواصل مع إدارة JOUR J عبر البريد: admin@jourj.dz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
