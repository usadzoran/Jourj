import React, { useState, useEffect } from 'react';
import {
  Building2,
  Image as ImageIcon,
  Calendar,
  Eye,
  LogOut,
  Save,
  Trash2,
  Upload,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Business, PortfolioItem, AvailabilityItem, UserProfile, WeekDay } from '../types';
import { DataService, ALL_WEEK_DAYS } from '../services/dataService';

interface OwnerDashboardProps {
  user: UserProfile;
  assignedBusiness?: Business;
  onPreview: (businessId: string) => void;
  onLogout: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  user,
  assignedBusiness,
  onPreview,
  onLogout
}) => {
  const [business, setBusiness] = useState<Business | null>(assignedBusiness || null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('وهران، الجزائر');
  const [price, setPrice] = useState<number>(0);
  const [priceUnit, setPriceUnit] = useState('دج');
  const [mainImage, setMainImage] = useState('');

  // Active section tab in dashboard
  const [activeTab, setActiveTab] = useState<'info' | 'images' | 'days'>('info');

  // Status feedback
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newImageTitle, setNewImageTitle] = useState('');

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      let currentBiz = assignedBusiness;
      if (!currentBiz) {
        const list = await DataService.getBusinesses();
        currentBiz = list.find(b => b.owner_id === user.id || (user.email && b.email?.toLowerCase() === user.email.toLowerCase())) || list[0];
      }

      if (currentBiz) {
        setBusiness(currentBiz);
        setName(currentBiz.name);
        setTitle(currentBiz.title || '');
        setDescription(currentBiz.description || '');
        setPhone(currentBiz.phone);
        setEmail(currentBiz.email || '');
        setAddress(currentBiz.address);
        setLocation(currentBiz.location || 'وهران، الجزائر');
        setPrice(currentBiz.price);
        setPriceUnit(currentBiz.price_unit || 'دج');
        setMainImage(currentBiz.main_image);

        const port = await DataService.getPortfolio(currentBiz.id);
        setPortfolio(port);

        const avail = await DataService.getAvailability(currentBiz.id);
        setAvailability(avail);
      }
      setLoading(false);
    };

    init();
  }, [user, assignedBusiness]);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    setSaving(true);
    setErrorMsg(null);
    try {
      const updated: Business = {
        ...business,
        name: name.trim(),
        title: title.trim(),
        description: description.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        location: location.trim(),
        price: Number(price),
        price_unit: priceUnit.trim(),
        main_image: mainImage,
      };

      await DataService.updateBusiness(updated);
      setBusiness(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'فشل حفظ التعديلات');
    } finally {
      setSaving(false);
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !business) return;

    setUploadingImage(true);
    try {
      const url = await DataService.uploadImage(file, 'business-images');
      setMainImage(url);
      const updatedBiz = { ...business, main_image: url };
      await DataService.updateBusiness(updatedBiz);
      setBusiness(updatedBiz);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: any) {
      setErrorMsg('فشل رفع الصورة الرئيسية');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !business) return;

    setUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await DataService.uploadImage(file, 'portfolio');
        const newItem = await DataService.addPortfolioItem({
          business_id: business.id,
          image_url: url,
          title: newImageTitle.trim() || file.name.split('.')[0] || 'صورة من المعرض',
          sort_order: portfolio.length + i + 1
        });
        setPortfolio(prev => [...prev, newItem]);
      }
      setNewImageTitle('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch {
      setErrorMsg('فشل رفع صور المعرض');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeletePortfolioItem = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة من المعرض؟')) return;
    await DataService.deletePortfolioItem(id);
    setPortfolio(prev => prev.filter(p => p.id !== id));
  };

  const handleToggleDay = async (day: WeekDay) => {
    if (!business) return;
    const current = availability.find(a => a.day === day);
    const updatedStatus = current ? !current.available : false;

    const newAvailability = availability.map(a =>
      a.day === day ? { ...a, available: updatedStatus } : a
    );

    setAvailability(newAvailability);
    await DataService.updateAvailability(business.id, newAvailability);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-[#D4AD54]">
        <div className="w-10 h-10 border-2 border-[#D4AD54] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#A3A3A3]">جاري فتح لوحة التحكم...</span>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-[#1A1A1A] border border-[#333333] text-center">
        <h3 className="text-xl font-bold text-[#FFFFFF]">لا يوجد قسم مرتبط</h3>
        <p className="text-sm text-[#A3A3A3] mt-2">
          لم يتم العثور على قسم مخصص لهذا الحساب. يرجى التواصل مع الإدارة.
        </p>
        <button
          onClick={onLogout}
          className="mt-4 px-6 py-2.5 rounded-xl bg-[#262626] text-[#D4AD54]"
        >
          تسجيل الخروج
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* Top Header Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1E1B14] via-[#171717] to-[#141414] p-5 md:p-6 border border-[#D4AD54]/40 shadow-xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">حالة القسم: نشط 🟢</span>
            <span className="text-[#525252]">•</span>
            <span className="text-xs text-[#E5C378]">مرحبًا، {user.full_name}</span>
          </div>

          <h1 className="font-luxury text-2xl md:text-3xl font-extrabold text-[#FFFFFF]">
            لوحة إدارة {business.name}
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-1">
            تحكم كامل بالمعلومات، الأسعار، الأيام المتاحة، ومعرض الصور الخاص بك
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="owner-preview-btn"
            onClick={() => onPreview(business.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#262626] hover:bg-[#333333] border border-[#D4AD54]/50 text-xs font-bold text-[#D4AD54] transition-all shadow-sm"
          >
            <Eye className="w-4 h-4" />
            <span>معاينة الصفحة</span>
          </button>

          <button
            id="owner-logout-btn"
            onClick={onLogout}
            className="p-2.5 rounded-xl bg-[#1C1C1C] hover:bg-red-500/20 text-[#A3A3A3] hover:text-red-400 border border-[#333333] transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation (Mobile First) */}
      <div className="flex border-b border-[#262626] mb-6 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'info'
              ? 'border-[#D4AD54] text-[#D4AD54] bg-[#1A1A1A]'
              : 'border-transparent text-[#A3A3A3] hover:text-[#FFFFFF]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>معلومات القسم والأسعار</span>
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'images'
              ? 'border-[#D4AD54] text-[#D4AD54] bg-[#1A1A1A]'
              : 'border-transparent text-[#A3A3A3] hover:text-[#FFFFFF]'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>إدارة الصور والمعرض ({portfolio.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('days')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'days'
              ? 'border-[#D4AD54] text-[#D4AD54] bg-[#1A1A1A]'
              : 'border-transparent text-[#A3A3A3] hover:text-[#FFFFFF]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>إدارة الأيام المتاحة</span>
        </button>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs md:text-sm text-emerald-400 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>تم حفظ التعديلات بنجاح! تظهر الآن مباشرة للزوار.</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs md:text-sm text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. TAB: INFO & PRICING */}
      {activeTab === 'info' && (
        <form onSubmit={handleSaveInfo} className="rounded-2xl bg-[#1A1A1A] p-5 md:p-6 border border-[#2A2A2A] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
                اسم القسم / المكان *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 text-sm text-[#F7F5F0] outline-none"
              />
            </div>

            {/* Title / Slogan */}
            <div>
              <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
                العنوان التعريفي
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: للأعراس والاحتفالات الفاخرة"
                className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 text-sm text-[#F7F5F0] outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
                رقم الهاتف (اتصال وواتساب) *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 pr-10 text-sm text-[#F7F5F0] outline-none font-mono"
                />
                <Phone className="absolute right-3.5 top-3 w-4 h-4 text-[#737373]" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 pr-10 text-sm text-[#F7F5F0] outline-none"
                />
                <Mail className="absolute right-3.5 top-3 w-4 h-4 text-[#737373]" />
              </div>
            </div>

            {/* Location City */}
            <div>
              <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
                المدينة / الولاية
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="وهران، الجزائر"
                className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 text-sm text-[#F7F5F0] outline-none"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
                العنوان التفصيلي
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: حي العقيد لطفي"
                  className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 pr-10 text-sm text-[#F7F5F0] outline-none"
                />
                <MapPin className="absolute right-3.5 top-3 w-4 h-4 text-[#737373]" />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
                السعر الأساسي (يبدأ من) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 text-sm text-[#F7F5F0] outline-none font-bold"
              />
            </div>

            {/* Price Unit */}
            <div>
              <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
                وحدة التسعير (مثال: دج أو دج / شخص)
              </label>
              <input
                type="text"
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                placeholder="دج أو دج / شخص"
                className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 text-sm text-[#F7F5F0] outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
              الوصف الكامل والتجهيزات
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] p-4 text-sm text-[#F7F5F0] outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Rating (Read-only notice) */}
          <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#A3A3A3]">
              <Sparkles className="w-4 h-4 text-[#D4AD54]" />
              <span>التقييم العام المعتمد:</span>
              <span className="font-bold text-[#D4AD54]">⭐ {business.rating.toFixed(1)} / 5</span>
            </div>
            <span className="text-[11px] text-[#737373]">
              (يتم حسابه تلقائيًا بناءً على آراء الزوار)
            </span>
          </div>

          {/* Submit Button */}
          <button
            id="owner-save-info-btn"
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#D4AD54] to-[#B88E2D] hover:opacity-95 text-[#121212] font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>حفظ وتحديث المعلومات</span>
          </button>
        </form>
      )}

      {/* 2. TAB: IMAGES & PORTFOLIO */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          {/* Main Cover Image */}
          <div className="rounded-2xl bg-[#1A1A1A] p-5 md:p-6 border border-[#2A2A2A]">
            <h3 className="font-luxury text-lg font-bold text-[#FFFFFF] mb-3">
              الصورة الرئيسية للغلاف (Hero Image)
            </h3>
            
            <div className="relative h-48 md:h-64 rounded-xl overflow-hidden border border-[#333333] mb-4 group bg-[#121212]">
              <img
                src={mainImage || business.main_image}
                alt="الصورة الرئيسية"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-[#D4AD54] text-[#121212] font-bold text-xs flex items-center gap-2 shadow-lg">
                  <Upload className="w-4 h-4" />
                  <span>تغيير صورة الغلاف</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="w-full sm:w-auto cursor-pointer px-4 py-2.5 rounded-xl bg-[#262626] hover:bg-[#333333] border border-[#3A3A3A] text-xs font-semibold text-[#E5C378] flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                <span>{uploadingImage ? 'جاري الرفع...' : 'رفع صورة غلاف جديدة'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>

              <span className="text-[11px] text-[#737373]">
                يُفضل استخدام صورة عالية الدقة بصيغة JPG أو PNG
              </span>
            </div>
          </div>

          {/* Portfolio Gallery */}
          <div className="rounded-2xl bg-[#1A1A1A] p-5 md:p-6 border border-[#2A2A2A]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-luxury text-lg font-bold text-[#FFFFFF]">
                  معرض الصور (Portfolio)
                </h3>
                <p className="text-xs text-[#A3A3A3]">
                  أضف صورًا للديكور، الطاولات، البوفيه، الإضاءة والأطباق
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="عنوان الصورة (اختياري)"
                  value={newImageTitle}
                  onChange={(e) => setNewImageTitle(e.target.value)}
                  className="rounded-xl bg-[#121212] border border-[#333333] px-3 py-1.5 text-xs text-[#F7F5F0] outline-none"
                />
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-[#D4AD54] text-[#121212] font-bold text-xs flex items-center gap-1.5 shadow-md">
                  <Upload className="w-3.5 h-3.5" />
                  <span>إضافة صور</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePortfolioUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {portfolio.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-[#333333] rounded-xl text-xs text-[#737373]">
                لا توجد صور في المعرض حاليًا. اضغط على "إضافة صور" للبدء.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="group relative h-36 rounded-xl overflow-hidden border border-[#333333] bg-[#141414]"
                  >
                    <img
                      src={item.image_url}
                      alt={item.title || 'معرض'}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-2">
                      <button
                        onClick={() => handleDeletePortfolioItem(item.id)}
                        className="self-end p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-colors"
                        title="حذف الصورة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {item.title && (
                        <span className="text-[11px] text-[#F7F5F0] font-medium truncate">
                          {item.title}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. TAB: AVAILABILITY DAYS */}
      {activeTab === 'days' && (
        <div className="rounded-2xl bg-[#1A1A1A] p-5 md:p-6 border border-[#2A2A2A]">
          <div className="mb-4">
            <h3 className="font-luxury text-lg font-bold text-[#FFFFFF]">
              تحديد أيام العمل والاستقبال
            </h3>
            <p className="text-xs text-[#A3A3A3] mt-0.5">
              حدد الأيام التي يكون فيها القسم مفتوحًا وجاهزًا للحجوزات.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ALL_WEEK_DAYS.map((day) => {
              const item = availability.find(a => a.day === day);
              const isAvailable = item ? item.available : true;

              return (
                <div
                  key={day}
                  onClick={() => handleToggleDay(day)}
                  className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all ${
                    isAvailable
                      ? 'bg-[#1E1B14] border-[#D4AD54] text-[#D4AD54]'
                      : 'bg-[#141414] border-[#2A2A2A] text-[#737373]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isAvailable
                          ? 'border-[#D4AD54] bg-[#D4AD54] text-[#121212]'
                          : 'border-[#404040] bg-[#1C1C1C]'
                      }`}
                    >
                      {isAvailable && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-bold">{day}</span>
                  </div>

                  <span className="text-xs font-semibold">
                    {isAvailable ? 'متاح ✅' : 'مغلق ❌'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-[#141414] border border-[#262626] text-xs text-[#A3A3A3] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4AD54] shrink-0" />
            <span>يتم حفظ وتحديث الأيام المتاحة تلقائيًا وبشكل فوري في صفحة الزوار.</span>
          </div>
        </div>
      )}
    </div>
  );
};
