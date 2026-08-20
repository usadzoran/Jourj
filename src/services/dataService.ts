import { Category, Business, PortfolioItem, AvailabilityItem, RegistrationLink, UserProfile, WeekDay } from '../types';
import { getSupabase } from '../lib/supabase';

const SEED_CATEGORIES: Category[] = [
  {
    id: 'wedding-halls',
    name: 'قاعة الأعراس',
    description: 'أفخم وأرقى قاعات الحفلات والأعراس المصممة لأجمل الليالي بأحدث التجهيزات',
    image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'traiteur',
    name: 'Traiteur',
    description: 'أشهى المأكولات الجزائرية والعالمية وبوفيهات الحلويات الراقية للمناسبات',
    image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString()
  }
];

const SEED_BUSINESSES: Business[] = [
  {
    id: 'salle-el-louloua',
    category_id: 'wedding-halls',
    owner_id: null,
    name: 'قاعة اللؤلؤة',
    title: 'قاعة اللؤلؤة للأعراس والاحتفالات الفاخرة',
    description: 'قاعة راقية متكاملة تتسع لأكثر من 500 ضيف، مزودة بأحدث أنظمة الإضاءة الليزرية والصوتية، ديكورات ملكية ذهبية، جناح ملكي مخصص للعروسين، صالة استقبال، ومواقف سيارات واسعة ومحروسة.',
    phone: '+213 555 12 34 56',
    email: 'contact@el-louloua-oran.dz',
    address: 'حي العقيد لطفي، بالقرب من الواجهة البحرية',
    location: 'وهران، الجزائر',
    price: 120000,
    price_unit: 'دج',
    rating: 4.9,
    main_image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'saveurs-doran',
    category_id: 'traiteur',
    owner_id: null,
    name: 'Saveurs d\'Oran Traiteur',
    title: 'خدمات الإطعام الفاخر والبوفيهات الملكية للأعراس والمناسبات',
    description: 'نقدم أرقى تشكيلات الأطباق التقليدية الجزائرية الأصيلة (طاجين الزيتون، الشواء الجزائري، الحريرة الوهرانية) بالإضافة إلى بوفيهات مقبلات عصرية، حلويات شرقية وغربية فاخرة، وتنسيق طاولات احترافي.',
    phone: '+213 661 98 76 54',
    email: 'traiteur@saveurs-oran.dz',
    address: 'شارع العربي بن مهيدي، وسط المدينة',
    location: 'وهران، الجزائر',
    price: 3500,
    price_unit: 'دج / شخص',
    rating: 4.8,
    main_image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const SEED_PORTFOLIO: PortfolioItem[] = [
  // قاعة اللؤلؤة
  {
    id: 'port-1',
    business_id: 'salle-el-louloua',
    image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80',
    title: 'ديكور القاعة الملكي',
    sort_order: 1
  },
  {
    id: 'port-2',
    business_id: 'salle-el-louloua',
    image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    title: 'تنسيق الطاولات والورود',
    sort_order: 2
  },
  {
    id: 'port-3',
    business_id: 'salle-el-louloua',
    image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
    title: 'أعراس وكوشة العروسين',
    sort_order: 3
  },
  {
    id: 'port-4',
    business_id: 'salle-el-louloua',
    image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80',
    title: 'أنظمة الإضاءة الحديثة',
    sort_order: 4
  },
  {
    id: 'port-5',
    business_id: 'salle-el-louloua',
    image_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80',
    title: 'بوفيه الاستقبال والضيافة',
    sort_order: 5
  },

  // Saveurs d'Oran Traiteur
  {
    id: 'port-6',
    business_id: 'saveurs-doran',
    image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1000&q=80',
    title: 'أطباق رئيسية فاخرة',
    sort_order: 1
  },
  {
    id: 'port-7',
    business_id: 'saveurs-doran',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    title: 'مقبلات وسلطات برستيج',
    sort_order: 2
  },
  {
    id: 'port-8',
    business_id: 'saveurs-doran',
    image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&q=80',
    title: 'حلويات جزائرية وشرقية',
    sort_order: 3
  },
  {
    id: 'port-9',
    business_id: 'saveurs-doran',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80',
    title: 'أطباق فاخرة ولحوم مشوية',
    sort_order: 4
  },
  {
    id: 'port-10',
    business_id: 'saveurs-doran',
    image_url: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=1000&q=80',
    title: 'بوفيه فواكه وعصائر طازجة',
    sort_order: 5
  }
];

export const ALL_WEEK_DAYS: WeekDay[] = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

const SEED_AVAILABILITY: AvailabilityItem[] = [
  // قاعة اللؤلؤة: All available except Monday
  { business_id: 'salle-el-louloua', day: 'السبت', available: true },
  { business_id: 'salle-el-louloua', day: 'الأحد', available: true },
  { business_id: 'salle-el-louloua', day: 'الإثنين', available: false },
  { business_id: 'salle-el-louloua', day: 'الثلاثاء', available: true },
  { business_id: 'salle-el-louloua', day: 'الأربعاء', available: true },
  { business_id: 'salle-el-louloua', day: 'الخميس', available: true },
  { business_id: 'salle-el-louloua', day: 'الجمعة', available: true },

  // Saveurs d'Oran: All available
  { business_id: 'saveurs-doran', day: 'السبت', available: true },
  { business_id: 'saveurs-doran', day: 'الأحد', available: true },
  { business_id: 'saveurs-doran', day: 'الإثنين', available: true },
  { business_id: 'saveurs-doran', day: 'الثلاثاء', available: true },
  { business_id: 'saveurs-doran', day: 'الأربعاء', available: true },
  { business_id: 'saveurs-doran', day: 'الخميس', available: true },
  { business_id: 'saveurs-doran', day: 'الجمعة', available: true },
];

const SEED_REGISTRATION_LINKS: RegistrationLink[] = [
  {
    id: 'link-1',
    business_id: 'salle-el-louloua',
    token: 'ABC123XYZ',
    used: false,
    expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'link-2',
    business_id: 'saveurs-doran',
    token: '7Fh82Ks91Lm',
    used: false,
    expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    created_at: new Date().toISOString()
  }
];

const SEED_PROFILES: UserProfile[] = [
  {
    id: 'admin-001',
    full_name: 'مدير منصة jour j',
    email: 'admin@jourj.dz',
    phone: '+213 550 00 00 00',
    role: 'admin',
    created_at: new Date().toISOString()
  }
];

// Local persistence storage keys
const STORAGE_KEYS = {
  CATEGORIES: 'jourj_categories_data',
  BUSINESSES: 'jourj_businesses_data',
  PORTFOLIO: 'jourj_portfolio_data',
  AVAILABILITY: 'jourj_availability_data',
  REG_LINKS: 'jourj_reg_links_data',
  PROFILES: 'jourj_profiles_data',
  ACTIVE_USER: 'jourj_active_user',
};

// Helper for local data management with fallback initialization
class LocalSyncStore {
  static get<T>(key: string, seed: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(data);
    } catch {
      return seed;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }
}

// ----------------- DATA SERVICE IMPLEMENTATION -----------------
export const DataService = {
  // ---- CATEGORIES ----
  async getCategories(): Promise<Category[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        if (!error && data && data.length > 0) {
          LocalSyncStore.set(STORAGE_KEYS.CATEGORIES, data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase getCategories fallback to local storage:', err);
      }
    }
    return LocalSyncStore.get<Category[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
  },

  async addCategory(category: Omit<Category, 'created_at'>): Promise<Category> {
    const newCat: Category = {
      ...category,
      created_at: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('categories').insert([newCat]);
      } catch (err) {
        console.warn('Supabase addCategory error:', err);
      }
    }

    const current = await this.getCategories();
    const updated = [newCat, ...current];
    LocalSyncStore.set(STORAGE_KEYS.CATEGORIES, updated);
    return newCat;
  },

  async updateCategory(category: Category): Promise<Category> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('categories').update(category).eq('id', category.id);
      } catch (err) {
        console.warn('Supabase updateCategory error:', err);
      }
    }

    const current = await this.getCategories();
    const updated = current.map(c => c.id === category.id ? category : c);
    LocalSyncStore.set(STORAGE_KEYS.CATEGORIES, updated);
    return category;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteCategory error:', err);
      }
    }

    const current = await this.getCategories();
    const updated = current.filter(c => c.id !== id);
    LocalSyncStore.set(STORAGE_KEYS.CATEGORIES, updated);
    return true;
  },

  // ---- BUSINESSES ----
  async getBusinesses(): Promise<Business[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .order('name');
        if (!error && data && data.length > 0) {
          LocalSyncStore.set(STORAGE_KEYS.BUSINESSES, data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase getBusinesses fallback to local storage:', err);
      }
    }
    return LocalSyncStore.get<Business[]>(STORAGE_KEYS.BUSINESSES, SEED_BUSINESSES);
  },

  async getBusinessById(id: string): Promise<Business | null> {
    const list = await this.getBusinesses();
    return list.find(b => b.id === id) || null;
  },

  async createBusiness(business: Omit<Business, 'created_at' | 'updated_at'>): Promise<Business> {
    const newBiz: Business = {
      ...business,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('businesses').insert([newBiz]);
      } catch (err) {
        console.warn('Supabase createBusiness error:', err);
      }
    }

    const current = await this.getBusinesses();
    const updated = [newBiz, ...current];
    LocalSyncStore.set(STORAGE_KEYS.BUSINESSES, updated);

    // Also initialize default availability for all 7 days
    const days = ALL_WEEK_DAYS.map(day => ({
      business_id: newBiz.id,
      day,
      available: true
    }));
    await this.updateAvailability(newBiz.id, days);

    return newBiz;
  },

  async updateBusiness(business: Business): Promise<Business> {
    const updatedBiz: Business = {
      ...business,
      updated_at: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('businesses').update(updatedBiz).eq('id', business.id);
      } catch (err) {
        console.warn('Supabase updateBusiness error:', err);
      }
    }

    const current = await this.getBusinesses();
    const updated = current.map(b => b.id === business.id ? updatedBiz : b);
    LocalSyncStore.set(STORAGE_KEYS.BUSINESSES, updated);
    return updatedBiz;
  },

  async deleteBusiness(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('businesses').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteBusiness error:', err);
      }
    }

    const current = await this.getBusinesses();
    const updated = current.filter(b => b.id !== id);
    LocalSyncStore.set(STORAGE_KEYS.BUSINESSES, updated);
    return true;
  },

  // ---- PORTFOLIO ----
  async getPortfolio(businessId: string): Promise<PortfolioItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*')
          .eq('business_id', businessId)
          .order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase getPortfolio error:', err);
      }
    }

    const allPortfolio = LocalSyncStore.get<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, SEED_PORTFOLIO);
    return allPortfolio.filter(item => item.business_id === businessId).sort((a, b) => a.sort_order - b.sort_order);
  },

  async addPortfolioItem(item: Omit<PortfolioItem, 'id' | 'created_at'>): Promise<PortfolioItem> {
    const newItem: PortfolioItem = {
      ...item,
      id: 'port-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      created_at: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('portfolio').insert([newItem]);
      } catch (err) {
        console.warn('Supabase addPortfolioItem error:', err);
      }
    }

    const allPortfolio = LocalSyncStore.get<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, SEED_PORTFOLIO);
    allPortfolio.push(newItem);
    LocalSyncStore.set(STORAGE_KEYS.PORTFOLIO, allPortfolio);
    return newItem;
  },

  async deletePortfolioItem(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('portfolio').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deletePortfolioItem error:', err);
      }
    }

    const allPortfolio = LocalSyncStore.get<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, SEED_PORTFOLIO);
    const updated = allPortfolio.filter(item => item.id !== id);
    LocalSyncStore.set(STORAGE_KEYS.PORTFOLIO, updated);
    return true;
  },

  // ---- AVAILABILITY ----
  async getAvailability(businessId: string): Promise<AvailabilityItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('availability')
          .select('*')
          .eq('business_id', businessId);
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase getAvailability error:', err);
      }
    }

    const all = LocalSyncStore.get<AvailabilityItem[]>(STORAGE_KEYS.AVAILABILITY, SEED_AVAILABILITY);
    const items = all.filter(a => a.business_id === businessId);
    
    // Ensure all 7 days exist
    if (items.length < 7) {
      return ALL_WEEK_DAYS.map(day => {
        const found = items.find(i => i.day === day);
        return found || { business_id: businessId, day, available: true };
      });
    }

    return items;
  },

  async updateAvailability(businessId: string, days: AvailabilityItem[]): Promise<AvailabilityItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('availability').upsert(days, { onConflict: 'business_id,day' });
      } catch (err) {
        console.warn('Supabase updateAvailability error:', err);
      }
    }

    const all = LocalSyncStore.get<AvailabilityItem[]>(STORAGE_KEYS.AVAILABILITY, SEED_AVAILABILITY);
    const filtered = all.filter(a => a.business_id !== businessId);
    const updated = [...filtered, ...days];
    LocalSyncStore.set(STORAGE_KEYS.AVAILABILITY, updated);
    return days;
  },

  // ---- REGISTRATION LINKS & INVITATIONS ----
  async getRegistrationLinks(): Promise<RegistrationLink[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('registration_links')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          LocalSyncStore.set(STORAGE_KEYS.REG_LINKS, data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase getRegistrationLinks error:', err);
      }
    }
    return LocalSyncStore.get<RegistrationLink[]>(STORAGE_KEYS.REG_LINKS, SEED_REGISTRATION_LINKS);
  },

  async createRegistrationLink(businessId: string, expiryDays: number = 30): Promise<RegistrationLink> {
    // Generate secure random alphanumeric token (e.g. 7Fh82Ks91Lm)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let token = '';
    for (let i = 0; i < 11; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newLink: RegistrationLink = {
      id: 'link-' + Date.now(),
      business_id: businessId,
      token,
      used: false,
      expires_at: new Date(Date.now() + expiryDays * 86400000).toISOString(),
      created_at: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('registration_links').insert([newLink]);
      } catch (err) {
        console.warn('Supabase createRegistrationLink error:', err);
      }
    }

    const current = await this.getRegistrationLinks();
    const updated = [newLink, ...current];
    LocalSyncStore.set(STORAGE_KEYS.REG_LINKS, updated);
    return newLink;
  },

  async verifyRegistrationToken(token: string): Promise<{ valid: boolean; link?: RegistrationLink; business?: Business; error?: string }> {
    const links = await this.getRegistrationLinks();
    const link = links.find(l => l.token.trim().toLowerCase() === token.trim().toLowerCase());

    if (!link) {
      return { valid: false, error: 'رابط التسجيل غير صالح أو غير موجود' };
    }

    if (link.used) {
      return { valid: false, error: 'تم استخدام رابط التسجيل هذا مسبقًا' };
    }

    if (new Date(link.expires_at).getTime() < Date.now()) {
      return { valid: false, error: 'انتهت صلاحية رابط التسجيل هذا' };
    }

    const business = await this.getBusinessById(link.business_id);
    if (!business) {
      return { valid: false, error: 'القسم المرتبط بهذا الرابط لم يعد متوفرًا' };
    }

    return { valid: true, link, business };
  },

  async registerOwnerWithToken(
    token: string,
    userData: { fullName: string; phone: string; email: string; password: string }
  ): Promise<{ success: boolean; user?: UserProfile; business?: Business; error?: string }> {
    const verification = await this.verifyRegistrationToken(token);
    if (!verification.valid || !verification.link || !verification.business) {
      return { success: false, error: verification.error || 'رابط غير صالح' };
    }

    const newProfile: UserProfile = {
      id: 'owner-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      full_name: userData.fullName,
      phone: userData.phone,
      email: userData.email.toLowerCase().trim(),
      role: 'owner',
      created_at: new Date().toISOString()
    };

    // 1. Try Supabase Auth sign up if configured
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: authData } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              full_name: userData.fullName,
              phone: userData.phone,
              role: 'owner'
            }
          }
        });
        if (authData.user) {
          newProfile.id = authData.user.id;
        }
        await supabase.from('profiles').insert([newProfile]);
      } catch (err) {
        console.warn('Supabase Auth signUp fallback to local:', err);
      }
    }

    // 2. Mark link as used
    const links = await this.getRegistrationLinks();
    const updatedLinks = links.map(l => l.token === token ? { ...l, used: true } : l);
    LocalSyncStore.set(STORAGE_KEYS.REG_LINKS, updatedLinks);

    // 3. Save profile
    const profiles = LocalSyncStore.get<UserProfile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
    profiles.push(newProfile);
    LocalSyncStore.set(STORAGE_KEYS.PROFILES, profiles);

    // 4. Bind business to owner
    const updatedBusiness: Business = {
      ...verification.business,
      owner_id: newProfile.id,
      updated_at: new Date().toISOString()
    };
    await this.updateBusiness(updatedBusiness);

    // 5. Set active user session
    this.setActiveUser(newProfile);

    return {
      success: true,
      user: newProfile,
      business: updatedBusiness
    };
  },

  // ---- PROFILES & AUTHENTICATION ----
  async getProfiles(): Promise<UserProfile[]> {
    return LocalSyncStore.get<UserProfile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
  },

  async login(email: string, _password?: string): Promise<{ success: boolean; user?: UserProfile; business?: Business; error?: string }> {
    const cleanEmail = email.toLowerCase().trim();

    // Check if Admin
    if (cleanEmail === 'admin@jourj.dz' || cleanEmail === 'admin') {
      const adminUser: UserProfile = {
        id: 'admin-001',
        full_name: 'مدير المنصة',
        email: 'admin@jourj.dz',
        phone: '+213 550 00 00 00',
        role: 'admin',
        created_at: new Date().toISOString()
      };
      this.setActiveUser(adminUser);
      return { success: true, user: adminUser };
    }

    // Check profiles
    const profiles = await this.getProfiles();
    let profile = profiles.find(p => p.email.toLowerCase() === cleanEmail);

    if (!profile) {
      // Demo convenience: allow logging in as owner of salle-el-louloua or saveurs-doran for testing
      const businesses = await this.getBusinesses();
      const matchedBiz = businesses.find(b => b.email?.toLowerCase() === cleanEmail);
      if (matchedBiz) {
        profile = {
          id: matchedBiz.owner_id || 'owner-' + matchedBiz.id,
          full_name: `صاحب ${matchedBiz.name}`,
          email: cleanEmail,
          phone: matchedBiz.phone,
          role: 'owner',
          created_at: new Date().toISOString()
        };
        // Auto-assign owner_id if missing
        if (!matchedBiz.owner_id) {
          matchedBiz.owner_id = profile.id;
          await this.updateBusiness(matchedBiz);
        }
      }
    }

    if (!profile) {
      return { success: false, error: 'البريد الإلكتروني غير مسجل، أو لم يتم إنشاء حساب من خلال رابط دعوة بعد' };
    }

    this.setActiveUser(profile);

    // Find business owned by this profile
    const businesses = await this.getBusinesses();
    const userBusiness = businesses.find(b => b.owner_id === profile!.id || (profile!.email && b.email?.toLowerCase() === profile!.email.toLowerCase()));

    return {
      success: true,
      user: profile,
      business: userBusiness
    };
  },

  getActiveUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setActiveUser(user: UserProfile | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    }
  },

  logout(): void {
    this.setActiveUser(null);
    const supabase = getSupabase();
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  },

  // ---- IMAGE STORAGE HELPER ----
  async uploadImage(file: File, bucket: 'business-images' | 'portfolio' = 'business-images'): Promise<string> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (!uploadError) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
          if (data?.publicUrl) {
            return data.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload error, falling back to data URL:', err);
      }
    }

    // Fallback: Read as base64 Data URL so it is fully functional offline & local
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
};
