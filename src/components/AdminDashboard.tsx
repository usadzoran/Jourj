import React, { useState, useEffect } from 'react';
import {
  Layers,
  Building2,
  Users,
  Link as LinkIcon,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  MessageCircle,
  Database,
  RefreshCw,
  LogOut,
  Sparkles,
  Lock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Category, Business, RegistrationLink, UserProfile } from '../types';
import { DataService } from '../services/dataService';
import { getStoredSupabaseConfig, saveSupabaseConfig, testSupabaseConnection } from '../lib/supabase';

interface AdminDashboardProps {
  user: UserProfile | null;
  onLogout: () => void;
  onNavigateToTokenRegister: (token: string) => void;
  onNavigateToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onNavigateToTokenRegister,
  onNavigateToHome
}) => {
  // Admin auth states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(user?.role === 'admin');
  const [adminEmail, setAdminEmail] = useState('admin@jourj.dz');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active sub-tab
  const [currentTab, setCurrentTab] = useState<'overview' | 'categories' | 'businesses' | 'invitations' | 'supabase'>('overview');

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [regLinks, setRegLinks] = useState<RegistrationLink[]>([]);
  const [loading, setLoading] = useState(false);

  // Category modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');

  // Business modal
  const [showBizModal, setShowBizModal] = useState(false);
  const [editingBiz, setEditingBiz] = useState<Business | null>(null);
  const [bizName, setBizName] = useState('');
  const [bizTitle, setBizTitle] = useState('');
  const [bizCatId, setBizCatId] = useState('');
  const [bizPhone, setBizPhone] = useState('');
  const [bizEmail, setBizEmail] = useState('');
  const [bizAddress, setBizAddress] = useState('');
  const [bizPrice, setBizPrice] = useState(100000);
  const [bizPriceUnit, setBizPriceUnit] = useState('دج');
  const [bizImage, setBizImage] = useState('');

  // Invitation creation
  const [selectedBizForInvite, setSelectedBizForInvite] = useState('');
  const [inviteDays, setInviteDays] = useState(30);
  const [creatingInvite, setCreatingInvite] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Supabase Config State
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [supabaseStatus, setSupabaseStatus] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const loadAllData = async () => {
    setLoading(true);
    const cats = await DataService.getCategories();
    const bizs = await DataService.getBusinesses();
    const links = await DataService.getRegistrationLinks();
    setCategories(cats);
    setBusinesses(bizs);
    setRegLinks(links);
    if (bizs.length > 0 && !selectedBizForInvite) {
      setSelectedBizForInvite(bizs[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAllData();
      const cfg = getStoredSupabaseConfig();
      setSupabaseUrl(cfg.url);
      setSupabaseKey(cfg.key);
    }
  }, [isAdminLoggedIn]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (adminEmail.trim() === 'admin@jourj.dz' || adminEmail.trim() === 'admin') {
      const res = await DataService.login('admin@jourj.dz', adminPassword);
      if (res.success) {
        setIsAdminLoggedIn(true);
      }
    } else {
      setLoginError('البريد الإلكتروني للإدارة غير صحيح (استخدم admin@jourj.dz)');
    }
  };

  // --- Category Handlers ---
  const handleOpenCatModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatDesc(cat.description);
      setCatImage(cat.image_url);
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatDesc('');
      setCatImage('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80');
    }
    setShowCatModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCategory) {
      await DataService.updateCategory({
        ...editingCategory,
        name: catName.trim(),
        description: catDesc.trim(),
        image_url: catImage
      });
    } else {
      const id = 'cat-' + Date.now();
      await DataService.addCategory({
        id,
        name: catName.trim(),
        description: catDesc.trim(),
        image_url: catImage,
        active: true
      });
    }
    setShowCatModal(false);
    loadAllData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    await DataService.deleteCategory(id);
    loadAllData();
  };

  const handleToggleCategoryActive = async (cat: Category) => {
    await DataService.updateCategory({ ...cat, active: !cat.active });
    loadAllData();
  };

  // --- Business Handlers ---
  const handleOpenBizModal = (biz?: Business) => {
    if (biz) {
      setEditingBiz(biz);
      setBizName(biz.name);
      setBizTitle(biz.title || '');
      setBizCatId(biz.category_id);
      setBizPhone(biz.phone);
      setBizEmail(biz.email || '');
      setBizAddress(biz.address);
      setBizPrice(biz.price);
      setBizPriceUnit(biz.price_unit || 'دج');
      setBizImage(biz.main_image);
    } else {
      setEditingBiz(null);
      setBizName('');
      setBizTitle('');
      setBizCatId(categories[0]?.id || 'wedding-halls');
      setBizPhone('+213 ');
      setBizEmail('');
      setBizAddress('وهران');
      setBizPrice(100000);
      setBizPriceUnit('دج');
      setBizImage('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80');
    }
    setShowBizModal(true);
  };

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName.trim() || !bizPhone.trim()) return;

    if (editingBiz) {
      await DataService.updateBusiness({
        ...editingBiz,
        name: bizName.trim(),
        title: bizTitle.trim(),
        category_id: bizCatId,
        phone: bizPhone.trim(),
        email: bizEmail.trim(),
        address: bizAddress.trim(),
        price: Number(bizPrice),
        price_unit: bizPriceUnit.trim(),
        main_image: bizImage
      });
    } else {
      const id = 'biz-' + Date.now();
      await DataService.createBusiness({
        id,
        category_id: bizCatId,
        owner_id: null,
        name: bizName.trim(),
        title: bizTitle.trim() || bizName.trim(),
        description: 'مكان فاخر مجهز بالكامل للمناسبات والأعراس.',
        phone: bizPhone.trim(),
        email: bizEmail.trim(),
        address: bizAddress.trim(),
        location: 'وهران، الجزائر',
        price: Number(bizPrice),
        price_unit: bizPriceUnit.trim(),
        rating: 5.0,
        main_image: bizImage,
        active: true
      });
    }
    setShowBizModal(false);
    loadAllData();
  };

  const handleDeleteBusiness = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المكان؟')) return;
    await DataService.deleteBusiness(id);
    loadAllData();
  };

  const handleToggleBizActive = async (biz: Business) => {
    await DataService.updateBusiness({ ...biz, active: !biz.active });
    loadAllData();
  };

  // --- Invitation Links Handlers ---
  const handleGenerateInvite = async () => {
    if (!selectedBizForInvite) return;
    setCreatingInvite(true);
    await DataService.createRegistrationLink(selectedBizForInvite, inviteDays);
    setCreatingInvite(false);
    loadAllData();
  };

  const getInviteUrl = (token: string) => {
    const origin = window.location.origin;
    return `${origin}/#owner/register/${token}`;
  };

  const handleCopyLink = (token: string) => {
    const url = getInviteUrl(token);
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleSendWhatsApp = (token: string, biz: Business | undefined) => {
    const inviteUrl = getInviteUrl(token);
    const phone = biz?.phone ? biz.phone.replace(/[^0-9]/g, '') : '';
    const message = encodeURIComponent(
      `مرحبًا، تم إنشاء حساب خاص بك لإدارة قسمك (${biz?.name || 'القسم'}) على منصة jour j. يرجى فتح الرابط التالي لإكمال التسجيل:\n${inviteUrl}`
    );
    const waUrl = phone ? `https://wa.me/${phone}?text=${message}` : `https://wa.me/?text=${message}`;
    window.open(waUrl, '_blank');
  };

  // --- Supabase Config Handlers ---
  const handleSaveSupabase = () => {
    saveSupabaseConfig(supabaseUrl, supabaseKey);
    setSupabaseStatus('تم حفظ إعدادات Supabase بنجاح في المتصفح!');
    setTimeout(() => setSupabaseStatus(null), 3000);
  };

  const handleTestSupabase = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setSupabaseStatus('يرجى إدخال الرابط والمفتاح أولاً');
      return;
    }
    setTestingConnection(true);
    const res = await testSupabaseConnection(supabaseUrl, supabaseKey);
    setSupabaseStatus(res.message);
    setTestingConnection(false);
  };

  const sampleSql = `-- =========================================================
-- جدول الأقسام (Categories)
create table if not exists public.categories (
  id text primary key,
  name text not null,
  description text,
  image_url text,
  active boolean default true not null
);

-- جدول أماكن وخدمات الأعراس (Businesses)
create table if not exists public.businesses (
  id text primary key,
  category_id text references public.categories(id),
  owner_id uuid references public.profiles(id),
  name text not null,
  title text,
  description text,
  phone text not null,
  email text,
  address text not null,
  location text default 'وهران، الجزائر',
  price numeric not null,
  price_unit text default 'دج',
  rating numeric default 5.0,
  main_image text not null,
  active boolean default true not null
);

-- جدول روابط دعوات التسجيل (Registration Links)
create table if not exists public.registration_links (
  id uuid primary key default uuid_generate_v4(),
  business_id text references public.businesses(id),
  token text unique not null,
  used boolean default false,
  expires_at timestamp with time zone not null
);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sampleSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // If not logged in as Admin, show Admin Login Form
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1C1C1C] border border-[#D4AD54]/50 flex items-center justify-center mx-auto text-[#D4AD54] shadow-xl mb-3">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-luxury text-2xl md:text-3xl font-extrabold text-[#FFFFFF]">
            لوحة تحكم إدارة المنصة
          </h2>
          <p className="text-xs text-[#A3A3A3] mt-1">
            منطقة مخصصة لمدير منصة jour j فقط (غير ظاهرة للزوار)
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="rounded-2xl bg-[#1A1A1A] p-6 border border-[#2A2A2A] space-y-4 shadow-2xl">
          {loginError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
              {loginError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
              بريد المشرف (Admin Email)
            </label>
            <input
              type="text"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 text-sm text-[#F7F5F0] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
              كلمة المرور
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 text-sm text-[#F7F5F0] outline-none font-mono"
            />
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AD54] via-[#E2BA65] to-[#B88E2D] hover:opacity-95 text-[#121212] font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>تسجيل الدخول كـ Admin</span>
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={onNavigateToHome}
            className="text-xs text-[#A3A3A3] hover:text-[#D4AD54] flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة للصفحة الرئيسية للزوار</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
      {/* Admin Top Header Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1C1A14] via-[#171717] to-[#141414] p-5 md:p-6 border border-[#D4AD54]/40 shadow-xl mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#D4AD54]/20 border border-[#D4AD54]/40 text-[#D4AD54]">
              Admin Control Panel
            </span>
            <span className="text-xs text-[#A3A3A3]">jour j Algeria</span>
          </div>
          <h1 className="font-luxury text-2xl md:text-3xl font-extrabold text-[#FFFFFF]">
            لوحة الإدارة المركزية
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            التحكم بالأقسام، المنشآت، أصحاب الخدمات، وروابط الدعوات الحصرية
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToHome}
            className="px-3.5 py-2 rounded-xl bg-[#262626] hover:bg-[#333333] text-xs font-semibold text-[#E5C378] border border-[#3A3A3A]"
          >
            معاينة واجهة الزوار
          </button>
          <button
            onClick={() => {
              setIsAdminLoggedIn(false);
              onLogout();
            }}
            className="p-2 rounded-xl bg-[#1C1C1C] hover:bg-red-500/20 text-[#A3A3A3] hover:text-red-400 border border-[#333333]"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-[#262626] mb-6 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCurrentTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            currentTab === 'overview'
              ? 'border-[#D4AD54] text-[#D4AD54] bg-[#1A1A1A]'
              : 'border-transparent text-[#A3A3A3] hover:text-[#FFFFFF]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>نظرة عامة والإحصائيات</span>
        </button>

        <button
          onClick={() => setCurrentTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            currentTab === 'categories'
              ? 'border-[#D4AD54] text-[#D4AD54] bg-[#1A1A1A]'
              : 'border-transparent text-[#A3A3A3] hover:text-[#FFFFFF]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>الأقسام ({categories.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('businesses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            currentTab === 'businesses'
              ? 'border-[#D4AD54] text-[#D4AD54] bg-[#1A1A1A]'
              : 'border-transparent text-[#A3A3A3] hover:text-[#FFFFFF]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>أماكن وخدمات الأعراس ({businesses.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('invitations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            currentTab === 'invitations'
              ? 'border-[#D4AD54] text-[#D4AD54] bg-[#1A1A1A]'
              : 'border-transparent text-[#A3A3A3] hover:text-[#FFFFFF]'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>دعوات وروابط التسجيل ({regLinks.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('supabase')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs md:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            currentTab === 'supabase'
              ? 'border-[#D4AD54] text-[#D4AD54] bg-[#1A1A1A]'
              : 'border-transparent text-[#A3A3A3] hover:text-[#FFFFFF]'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>إعدادات Supabase & SQL</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-[#1A1A1A] p-5 border border-[#2A2A2A]">
              <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
                <span>أماكن وخدمات مسجلة</span>
                <Building2 className="w-4 h-4 text-[#D4AD54]" />
              </div>
              <div className="mt-3 font-luxury text-3xl font-extrabold text-[#FFFFFF]">
                {businesses.length}
              </div>
              <span className="text-[11px] text-emerald-400 mt-1 block">نشطة وجاهزة للحجز</span>
            </div>

            <div className="rounded-2xl bg-[#1A1A1A] p-5 border border-[#2A2A2A]">
              <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
                <span>الأقسام الرئيسية</span>
                <Layers className="w-4 h-4 text-[#D4AD54]" />
              </div>
              <div className="mt-3 font-luxury text-3xl font-extrabold text-[#FFFFFF]">
                {categories.length}
              </div>
              <span className="text-[11px] text-[#A3A3A3] mt-1 block">قاعات، Traiteur...</span>
            </div>

            <div className="rounded-2xl bg-[#1A1A1A] p-5 border border-[#2A2A2A]">
              <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
                <span>دعوات التسجيل</span>
                <LinkIcon className="w-4 h-4 text-[#D4AD54]" />
              </div>
              <div className="mt-3 font-luxury text-3xl font-extrabold text-[#FFFFFF]">
                {regLinks.length}
              </div>
              <span className="text-[11px] text-[#E5C378] mt-1 block">
                {regLinks.filter(l => !l.used).length} دعوة نشطة
              </span>
            </div>

            <div className="rounded-2xl bg-[#1A1A1A] p-5 border border-[#2A2A2A]">
              <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
                <span>الولاية الحالية</span>
                <Users className="w-4 h-4 text-[#D4AD54]" />
              </div>
              <div className="mt-3 font-luxury text-xl font-extrabold text-[#D4AD54]">
                وهران
              </div>
              <span className="text-[11px] text-[#737373] mt-1 block">Oran, Algeria</span>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#1A1A1A] p-6 border border-[#2A2A2A]">
              <h3 className="font-luxury text-lg font-bold text-[#FFFFFF] mb-2">
                دعوة صاحب مكان جديد عبر WhatsApp
              </h3>
              <p className="text-xs text-[#A3A3A3] mb-4 leading-relaxed">
                أنشئ رابط تسجيل مخصص برمز أمان فريد وأرسله فورًا لصاحب القاعة أو الـTraiteur عبر واتساب.
              </p>
              <button
                onClick={() => setCurrentTab('invitations')}
                className="px-5 py-2.5 rounded-xl bg-[#D4AD54] text-[#121212] font-bold text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء رابط دعوة الآن</span>
              </button>
            </div>

            <div className="rounded-2xl bg-[#1A1A1A] p-6 border border-[#2A2A2A]">
              <h3 className="font-luxury text-lg font-bold text-[#FFFFFF] mb-2">
                إضافة قسم أو خدمة جديدة
              </h3>
              <p className="text-xs text-[#A3A3A3] mb-4 leading-relaxed">
                يمكنك التوسع وإضافة أقسام جديدة كالتصوير الفوتوغرافي، تزيين الورود، والفرق الموسيقية.
              </p>
              <button
                onClick={() => handleOpenCatModal()}
                className="px-5 py-2.5 rounded-xl bg-[#262626] hover:bg-[#333333] text-[#D4AD54] font-bold text-xs flex items-center gap-2 border border-[#3A3A3A]"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة قسم جديد</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES MANAGEMENT */}
      {currentTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-luxury text-xl font-bold text-[#FFFFFF]">
              إدارة أقسام المنصة
            </h3>
            <button
              onClick={() => handleOpenCatModal()}
              className="px-4 py-2 rounded-xl bg-[#D4AD54] text-[#121212] font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قسم</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        cat.active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}
                    >
                      {cat.active ? 'نشط' : 'معطل'}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-luxury text-lg font-bold text-[#FFFFFF]">
                      {cat.name}
                    </h4>
                    <p className="text-xs text-[#A3A3A3] mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between">
                    <button
                      onClick={() => handleToggleCategoryActive(cat)}
                      className="text-xs text-[#A3A3A3] hover:text-[#FFFFFF]"
                    >
                      {cat.active ? 'تعطيل القسم' : 'تفعيل القسم'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenCatModal(cat)}
                        className="p-2 rounded-lg bg-[#262626] text-[#E5C378] hover:bg-[#333333]"
                        title="تعديل"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-2 rounded-lg bg-[#262626] text-red-400 hover:bg-red-500/20"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BUSINESSES MANAGEMENT */}
      {currentTab === 'businesses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-luxury text-xl font-bold text-[#FFFFFF]">
              أماكن وخدمات الأعراس (Businesses)
            </h3>
            <button
              onClick={() => handleOpenBizModal()}
              className="px-4 py-2 rounded-xl bg-[#D4AD54] text-[#121212] font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة مكان / خدمة</span>
            </button>
          </div>

          <div className="space-y-3">
            {businesses.map((biz) => (
              <div
                key={biz.id}
                className="rounded-2xl bg-[#1A1A1A] p-4 border border-[#2A2A2A] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={biz.main_image}
                    alt={biz.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#333333] shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-luxury text-base font-bold text-[#FFFFFF]">
                        {biz.name}
                      </h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#262626] text-[#D4AD54]">
                        {categories.find(c => c.id === biz.category_id)?.name || 'قسم'}
                      </span>
                    </div>
                    <p className="text-xs text-[#A3A3A3] mt-0.5">
                      📍 {biz.location} — {biz.address}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[#E5C378] mt-1">
                      <span>📞 {biz.phone}</span>
                      <span>•</span>
                      <span className="font-bold text-[#D4AD54]">
                        {biz.price.toLocaleString()} {biz.price_unit}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => {
                      setSelectedBizForInvite(biz.id);
                      setCurrentTab('invitations');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#D4AD54]/15 hover:bg-[#D4AD54]/25 text-xs font-semibold text-[#D4AD54] border border-[#D4AD54]/30 flex items-center gap-1"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>دعوة صاحب القسم</span>
                  </button>

                  <button
                    onClick={() => handleToggleBizActive(biz)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      biz.active
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {biz.active ? 'نشط' : 'معطل'}
                  </button>

                  <button
                    onClick={() => handleOpenBizModal(biz)}
                    className="p-2 rounded-lg bg-[#262626] text-[#E5C378] hover:bg-[#333333]"
                    title="تعديل"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteBusiness(biz.id)}
                    className="p-2 rounded-lg bg-[#262626] text-red-400 hover:bg-red-500/20"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REGISTRATION INVITATIONS (دعوات التسجيل) */}
      {currentTab === 'invitations' && (
        <div className="space-y-6">
          {/* Create New Link Section */}
          <div className="rounded-2xl bg-[#1A1A1A] p-5 md:p-6 border border-[#2A2A2A]">
            <h3 className="font-luxury text-lg font-bold text-[#FFFFFF] mb-2">
              إنشاء رابط تسجيل ودعوة صاحب قسم جديد
            </h3>
            <p className="text-xs text-[#A3A3A3] mb-4 leading-relaxed">
              اختر القسم المراد ربطه بالدعوة. سيتم توليد رمز عشوائي قوي مشفر صالح للاستخدام مرة واحدة فقط.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
                  اختر المكان / الخدمة *
                </label>
                <select
                  value={selectedBizForInvite}
                  onChange={(e) => setSelectedBizForInvite(e.target.value)}
                  className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-3 py-2.5 text-xs text-[#F7F5F0] outline-none"
                >
                  {businesses.map((biz) => (
                    <option key={biz.id} value={biz.id}>
                      {biz.name} ({categories.find(c => c.id === biz.category_id)?.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D4D4D4] mb-1.5">
                  مدة الصلاحية (أيام)
                </label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={inviteDays}
                  onChange={(e) => setInviteDays(Number(e.target.value))}
                  className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-3 py-2.5 text-xs text-[#F7F5F0] outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  id="generate-invite-btn"
                  onClick={handleGenerateInvite}
                  disabled={creatingInvite || !selectedBizForInvite}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AD54] to-[#B88E2D] hover:opacity-95 text-[#121212] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50"
                >
                  {creatingInvite ? (
                    <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>توليد رابط التسجيل</span>
                </button>
              </div>
            </div>
          </div>

          {/* Links List */}
          <div className="rounded-2xl bg-[#1A1A1A] p-5 md:p-6 border border-[#2A2A2A]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-luxury text-base font-bold text-[#FFFFFF]">
                قائمة روابط الدعوات المولدة ({regLinks.length})
              </h4>
              <button
                onClick={loadAllData}
                className="text-xs text-[#D4AD54] flex items-center gap-1 hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>تحديث</span>
              </button>
            </div>

            <div className="space-y-3">
              {regLinks.map((link) => {
                const biz = businesses.find(b => b.id === link.business_id);
                const isExpired = new Date(link.expires_at).getTime() < Date.now();

                return (
                  <div
                    key={link.id}
                    className="p-4 rounded-xl bg-[#141414] border border-[#262626] flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-luxury font-bold text-sm text-[#FFFFFF]">
                          {biz?.name || 'قسم غير محدد'}
                        </span>
                        {link.used ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-500/20 text-gray-400 border border-gray-500/40">
                            تم التسجيل بنجاح (مستخدم)
                          </span>
                        ) : isExpired ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                            منتهي الصلاحية
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            جاهز للاستخدام 🟢
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 flex items-center gap-2 text-xs text-[#A3A3A3] font-mono">
                        <span className="text-[#D4AD54]">{link.token}</span>
                        <span className="text-[#525252]">•</span>
                        <span className="text-[11px] truncate">{getInviteUrl(link.token)}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        onClick={() => handleCopyLink(link.token)}
                        className="px-3 py-1.5 rounded-lg bg-[#262626] hover:bg-[#333333] text-xs font-semibold text-[#E5C378] border border-[#3A3A3A] flex items-center gap-1.5"
                      >
                        {copiedToken === link.token ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ الرابط</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSendWhatsApp(link.token, biz)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-xs font-semibold text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>إرسال عبر WhatsApp</span>
                      </button>

                      <button
                        onClick={() => onNavigateToTokenRegister(link.token)}
                        className="p-1.5 rounded-lg bg-[#262626] hover:bg-[#333333] text-[#D4AD54]"
                        title="تجربة فتح صفحة التسجيل"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SUPABASE CONFIG & SQL */}
      {currentTab === 'supabase' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#1A1A1A] p-5 md:p-6 border border-[#2A2A2A]">
            <h3 className="font-luxury text-lg font-bold text-[#FFFFFF] mb-2">
              ربط Supabase السحابي المباشر
            </h3>
            <p className="text-xs text-[#A3A3A3] mb-4 leading-relaxed">
              يدعم النظام الاتصال الفوري بقاعدة بيانات Supabase الحقيقية (Authentication, Database, Storage, RLS). في حال عدم إدخال المفاتيح، يعمل النظام تلقائيًا مع محرك المزامنة المحلي الفائق الاستجابة.
            </p>

            {supabaseStatus && (
              <div className="mb-4 p-3 rounded-xl bg-[#262626] border border-[#D4AD54]/40 text-xs text-[#D4AD54]">
                {supabaseStatus}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#D4D4D4] mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 text-xs text-[#F7F5F0] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D4D4D4] mb-1">
                  Supabase Anon Public Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full rounded-xl bg-[#121212] border border-[#333333] focus:border-[#D4AD54] px-4 py-2.5 text-xs text-[#F7F5F0] outline-none font-mono"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={handleSaveSupabase}
                  className="px-5 py-2.5 rounded-xl bg-[#D4AD54] text-[#121212] font-bold text-xs shadow-md"
                >
                  حفظ الإعدادات
                </button>
                <button
                  onClick={handleTestSupabase}
                  disabled={testingConnection}
                  className="px-5 py-2.5 rounded-xl bg-[#262626] hover:bg-[#333333] text-xs font-semibold text-[#E5C378] border border-[#3A3A3A]"
                >
                  {testingConnection ? 'جاري الفحص...' : 'اختبار الاتصال'}
                </button>
              </div>
            </div>
          </div>

          {/* SQL Schema Preview */}
          <div className="rounded-2xl bg-[#1A1A1A] p-5 md:p-6 border border-[#2A2A2A]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-luxury text-base font-bold text-[#FFFFFF]">
                  مخطط قاعدة البيانات SQL (Database Schema & RLS)
                </h4>
                <span className="text-xs text-[#737373]">
                  الملف الكامل محفوظ في: /supabase/schema.sql
                </span>
              </div>
              <button
                onClick={handleCopySql}
                className="px-3 py-1.5 rounded-lg bg-[#262626] hover:bg-[#333333] text-xs text-[#D4AD54] flex items-center gap-1 border border-[#3A3A3A]"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'تم النسخ' : 'نسخ SQL'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[#0F0F0F] border border-[#262626] text-xs text-[#E5C378] font-mono overflow-x-auto max-h-60 leading-relaxed">
              {sampleSql}
            </pre>
          </div>
        </div>
      )}

      {/* Category Modal (Add / Edit) */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#1A1A1A] border border-[#333333] p-6 space-y-4">
            <h3 className="font-luxury text-lg font-bold text-[#FFFFFF]">
              {editingCategory ? 'تعديل القسم' : 'إضافة قسم جديد'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs text-[#D4D4D4] mb-1">اسم القسم *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="مثال: التصوير الفوتوغرافي"
                  className="w-full rounded-xl bg-[#121212] border border-[#333333] px-3 py-2 text-sm text-[#F7F5F0] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#D4D4D4] mb-1">الوصف</label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full rounded-xl bg-[#121212] border border-[#333333] px-3 py-2 text-sm text-[#F7F5F0] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#D4D4D4] mb-1">رابط الصورة</label>
                <input
                  type="text"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full rounded-xl bg-[#121212] border border-[#333333] px-3 py-2 text-xs text-[#F7F5F0] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#262626] text-xs text-[#A3A3A3]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4AD54] text-[#121212] font-bold text-xs"
                >
                  حفظ القسم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Business Modal (Add / Edit) */}
      {showBizModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1A1A1A] border border-[#333333] p-6 space-y-4">
            <h3 className="font-luxury text-lg font-bold text-[#FFFFFF]">
              {editingBiz ? 'تعديل بيانات المكان' : 'إضافة مكان جديد'}
            </h3>

            <form onSubmit={handleSaveBusiness} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#D4D4D4] mb-1">اسم المكان *</label>
                  <input
                    type="text"
                    required
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    className="w-full rounded-xl bg-[#121212] border border-[#333333] px-3 py-2 text-xs text-[#F7F5F0] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#D4D4D4] mb-1">القسم التابع له *</label>
                  <select
                    value={bizCatId}
                    onChange={(e) => setBizCatId(e.target.value)}
                    className="w-full rounded-xl bg-[#121212] border border-[#333333] px-3 py-2 text-xs text-[#F7F5F0] outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#D4D4D4] mb-1">العنوان التعريفي</label>
                <input
                  type="text"
                  value={bizTitle}
                  onChange={(e) => setBizTitle(e.target.value)}
                  className="w-full rounded-xl bg-[#121212] border border-[#333333] px-3 py-2 text-xs text-[#F7F5F0] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#D4D4D4] mb-1">الهاتف *</label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={bizPhone}
                    onChange={(e) => setBizPhone(e.target.value)}
                    className="w-full rounded-xl bg-[#121212] border border-[#333333] px-3 py-2 text-xs text-[#F7F5F0] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#D4D4D4] mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={bizEmail}
                    onChange={(e) => setBizEmail(e.target.value)}
                    className="w-full rounded-xl bg-[#121212] border border-[#333333] px-3 py-2 text-xs text-[#F7F5F0] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#D4D4D4] mb-1">العنوان</label>
                <input
                  type="text"
                  value={bizAddress}
                  onChange={(e) => setBizAddress(e.target.value)}
                  className="w-full rounded-xl bg-[#121212] border border-[#333333] px-3 py-2 text-xs text-[#F7F5F0] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#D4D4D4] mb-1">السعر (دج) *</label>
                  <input
                    type="number"
                    required
                    value={bizPrice}
                    onChange={(e) => setBizPrice(Number(e.target.value))}
                    className="w-full rounded-xl bg-[#121212] border border-[#333333] px-3 py-2 text-xs text-[#F7F5F0] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#D4D4D4] mb-1">وحدة السعر</label>
                  <input
                    type="text"
                    value={bizPriceUnit}
                    onChange={(e) => setBizPriceUnit(e.target.value)}
                    placeholder="دج أو دج / شخص"
                    className="w-full rounded-xl bg-[#121212] border border-[#333333] px-3 py-2 text-xs text-[#F7F5F0] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#D4D4D4] mb-1">رابط الصورة الرئيسية</label>
                <input
                  type="text"
                  value={bizImage}
                  onChange={(e) => setBizImage(e.target.value)}
                  className="w-full rounded-xl bg-[#121212] border border-[#333333] px-3 py-2 text-xs text-[#F7F5F0] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBizModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#262626] text-xs text-[#A3A3A3]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4AD54] text-[#121212] font-bold text-xs"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
