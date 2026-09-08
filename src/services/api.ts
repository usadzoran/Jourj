import { supabase, isSupabaseConfigured, testSupabaseConnection } from '../lib/supabase';
import { 
  Category, 
  Business, 
  PortfolioItem, 
  Availability, 
  RegistrationLink, 
  Profile, 
  DayOfWeek 
} from '../types';

// ============================================================================
// INITIAL SEED DATA (Exact match to Supabase schema seed data)
// ============================================================================

const SEED_CATEGORIES: Category[] = [
  {
    id: 'wedding-halls',
    name: 'قاعة الأعراس',
    description: 'أفخم وأرقى قاعات الحفلات والأعراس المصممة لأجمل الليالي',
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
  },
  {
    id: 'photographers',
    name: 'مصورون',
    description: 'استوديوهات تصوير فوتوغرافي وسينمائي احترافي لتخليد أجمل اللحظات',
    image_url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'decorations',
    name: 'ديكور',
    description: 'تنسيق قاعات وكوشات أعراس، زهور طبيعية وتصاميم ديكور فاخرة',
    image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'luxury-cars',
    name: 'سيارات الأعراس',
    description: 'مواكب سيارات فارهة وكلاسيكية مع سائق خاص لمرافقة العروسين',
    image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'sports-clubs',
    name: 'قاعات الرياضة',
    description: 'نوادي رياضية وصحية راقية لتجهيز العروسين قبل اليوم الموعود',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString()
  }
];

const SEED_BUSINESSES: Business[] = [
  {
    id: 'salle-el-louloua',
    category_id: 'wedding-halls',
    owner_id: 'owner-louloua-uuid',
    name: 'قاعة اللؤلؤة',
    title: 'قاعة اللؤلؤة للأعراس والاحتفالات الفاخرة',
    description: 'قاعة راقية متكاملة تتسع لأكثر من 500 ضيف، مزودة بأحدث أنظمة الإضاءة الليزرية، ديكورات ملكية ذهبية، جناح خاص للعروسين، ومواقف سيارات واسعة ومحروسة.',
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
    id: 'salle-nour',
    category_id: 'wedding-halls',
    owner_id: 'owner-nour-uuid',
    name: 'قاعة النور',
    title: 'قاعة النور الكبرى للمناسبات السعيدة',
    description: 'قاعة عصرية تتسع لـ 650 شخص مع جناح فندقي مجهز، إطلالة بانورامية وتكييف مركزي متطور.',
    phone: '+213 550 88 77 66',
    email: 'salle.nour.oran@gmail.com',
    address: 'طريق الميناء الجديد، بئر الجير',
    location: 'وهران، الجزائر',
    price: 110000,
    price_unit: 'دج',
    rating: 4.9,
    main_image: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'salle-layali-oran',
    category_id: 'wedding-halls',
    owner_id: 'owner-layali-uuid',
    name: 'قاعة ليالي وهران',
    title: 'قاعة ليالي وهران الملكية',
    description: 'ديكور أندلسي فاخر، ثريات كريستال عملاقة، خدمة استقبال VIP ومسرح زفاف مضيء بتأثيرات ساحرة.',
    phone: '+213 552 44 33 22',
    email: 'layali.oran@gmail.com',
    address: 'حي كنستال، الواجهة البحرية الشرقية',
    location: 'وهران، الجزائر',
    price: 135000,
    price_unit: 'دج',
    rating: 4.8,
    main_image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'saveurs-doran',
    category_id: 'traiteur',
    owner_id: 'owner-saveurs-uuid',
    name: 'Saveurs d\'Oran Traiteur',
    title: 'خدمات الإطعام الفاخر والبوفيهات الملكية للأعراس والمؤتمرات',
    description: 'نقدم أرقى تشكيلات الأطباق التقليدية الجزائرية (طاجين الزيتون، الشواء، الحريرة الوهرانية) بالإضافة إلى بوفيهات مقبلات عالمية، حلويات شرقية وغربية، وتنسيق طاولات فاخر.',
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
  },
  {
    id: 'studio-el-bahia',
    category_id: 'photographers',
    owner_id: 'owner-bahia-uuid',
    name: 'ستوديو الباهية للتصوير',
    title: 'تغطية فوتوغرافية وسينمائية احترافية',
    description: 'فريق محترف من المصورين والمصورات بخبرة تزيد عن 10 سنوات في تصوير الأعراس والمناسبات الكبرى بألبومات حرارية إيطالية فاخرة.',
    phone: '+213 556 77 88 99',
    email: 'elbahia.studio@gmail.com',
    address: 'حي كاستور، مقابل قصر الثقافة',
    location: 'وهران، الجزائر',
    price: 45000,
    price_unit: 'دج / باقة',
    rating: 4.9,
    main_image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const SEED_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-1',
    business_id: 'salle-el-louloua',
    image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    title: 'ديكور القاعة الملكي',
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'port-2',
    business_id: 'salle-el-louloua',
    image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    title: 'تنسيق الطاولات والورود',
    sort_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'port-3',
    business_id: 'salle-el-louloua',
    image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
    title: 'كوشة العروسين والإضاءة',
    sort_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 'port-4',
    business_id: 'salle-el-louloua',
    image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    title: 'إضاءة المسرح والأعراس',
    sort_order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 'port-5',
    business_id: 'saveurs-doran',
    image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    title: 'أطباق رئيسية فاخرة',
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'port-6',
    business_id: 'saveurs-doran',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    title: 'مقبلات وسلطات برستيج',
    sort_order: 2,
    created_at: new Date().toISOString()
  }
];

const DAYS: DayOfWeek[] = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

const SEED_AVAILABILITY: Availability[] = [
  ...DAYS.map((day, i) => ({
    id: `avail-louloua-${i}`,
    business_id: 'salle-el-louloua',
    day,
    available: day !== 'الإثنين'
  })),
  ...DAYS.map((day, i) => ({
    id: `avail-nour-${i}`,
    business_id: 'salle-nour',
    day,
    available: day !== 'الأربعاء'
  })),
  ...DAYS.map((day, i) => ({
    id: `avail-saveurs-${i}`,
    business_id: 'saveurs-doran',
    day,
    available: true
  }))
];

const SEED_REGISTRATION_LINKS: RegistrationLink[] = [
  {
    id: 'link-1',
    category_id: 'wedding-halls',
    token: 'WEDDING2026',
    used: false,
    expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'link-2',
    category_id: 'traiteur',
    token: 'TRAITEUR2026',
    used: false,
    expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'link-3',
    category_id: 'photographers',
    token: 'PHOTO2026',
    used: false,
    expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    created_at: new Date().toISOString()
  }
];

const SEED_PROFILES: Profile[] = [
  {
    id: 'admin-main-uuid',
    full_name: 'مدير منصة JOUR J',
    phone: '+213 555 00 00 00',
    email: 'admin@jourj.dz',
    role: 'admin',
    created_at: new Date().toISOString()
  },
  {
    id: 'owner-louloua-uuid',
    full_name: 'مسؤول قاعة اللؤلؤة',
    phone: '+213 555 12 34 56',
    email: 'owner@louloua.dz',
    role: 'owner',
    created_at: new Date().toISOString()
  },
  {
    id: 'owner-nour-uuid',
    full_name: 'مسؤول قاعة النور',
    phone: '+213 550 88 77 66',
    email: 'owner@nour.dz',
    role: 'owner',
    created_at: new Date().toISOString()
  },
  {
    id: 'owner-layali-uuid',
    full_name: 'مسؤول قاعة ليالي وهران',
    phone: '+213 552 44 33 22',
    email: 'owner@layali.dz',
    role: 'owner',
    created_at: new Date().toISOString()
  },
  {
    id: 'owner-saveurs-uuid',
    full_name: 'مسؤول Saveurs d\'Oran',
    phone: '+213 661 98 76 54',
    email: 'owner@saveurs.dz',
    role: 'owner',
    created_at: new Date().toISOString()
  },
  {
    id: 'owner-bahia-uuid',
    full_name: 'مسؤول ستوديو الباهية',
    phone: '+213 556 77 88 99',
    email: 'owner@bahia.dz',
    role: 'owner',
    created_at: new Date().toISOString()
  }
];

// ============================================================================
// LOCAL RESILIENT STORAGE ENGINE (Synchronized with Supabase)
// ============================================================================

class LocalStore {
  private categories: Category[];
  private businesses: Business[];
  private portfolio: PortfolioItem[];
  private availability: Availability[];
  private links: RegistrationLink[];
  private profiles: Profile[];

  constructor() {
    this.categories = this.load('jourj_categories', SEED_CATEGORIES);
    this.businesses = this.load('jourj_businesses', SEED_BUSINESSES);
    this.portfolio = this.load('jourj_portfolio', SEED_PORTFOLIO);
    this.availability = this.load('jourj_availability', SEED_AVAILABILITY);
    this.links = this.load('jourj_links', SEED_REGISTRATION_LINKS);
    this.profiles = this.load('jourj_profiles', SEED_PROFILES);
  }

  private load<T>(key: string, fallback: T): T {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          // If fallback is an array with items, ensure parsed is also a non-empty array
          if (Array.isArray(fallback) && fallback.length > 0) {
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed as unknown as T;
            }
            return fallback;
          }
          if (parsed !== null && parsed !== undefined) return parsed;
        }
      }
    } catch {
      // ignore
    }
    return fallback;
  }

  private save(key: string, data: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  // Categories
  getCategories(onlyActive = true): Category[] {
    return onlyActive 
      ? this.categories.filter(c => c.active)
      : [...this.categories];
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.find(c => c.id === id);
  }

  saveCategory(category: Category): Category {
    const idx = this.categories.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      this.categories[idx] = { ...category };
    } else {
      this.categories.push(category);
    }
    this.save('jourj_categories', this.categories);
    return category;
  }

  deleteCategory(id: string): boolean {
    this.categories = this.categories.filter(c => c.id !== id);
    this.save('jourj_categories', this.categories);
    return true;
  }

  // Businesses
  getBusinesses(categoryId?: string, onlyActive = true): Business[] {
    return this.businesses.filter(b => {
      const matchesCat = categoryId ? b.category_id === categoryId : true;
      const matchesActive = onlyActive ? b.active : true;
      return matchesCat && matchesActive;
    });
  }

  getBusinessById(id: string): Business | undefined {
    return this.businesses.find(b => b.id === id);
  }

  getBusinessByOwnerId(ownerId: string): Business | undefined {
    return this.businesses.find(b => b.owner_id === ownerId);
  }

  saveBusiness(business: Business): Business {
    const idx = this.businesses.findIndex(b => b.id === business.id);
    if (idx >= 0) {
      this.businesses[idx] = { ...business, updated_at: new Date().toISOString() };
    } else {
      this.businesses.push(business);
    }
    this.save('jourj_businesses', this.businesses);
    return business;
  }

  // Portfolio
  getPortfolio(businessId: string): PortfolioItem[] {
    return this.portfolio
      .filter(p => p.business_id === businessId)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  setPortfolio(businessId: string, items: PortfolioItem[]): PortfolioItem[] {
    this.portfolio = [
      ...this.portfolio.filter(p => p.business_id !== businessId),
      ...items
    ];
    this.save('jourj_portfolio', this.portfolio);
    return this.getPortfolio(businessId);
  }

  // Availability
  getAvailability(businessId: string): Availability[] {
    const list = this.availability.filter(a => a.business_id === businessId);
    if (list.length === 0) {
      // default full availability
      return DAYS.map((day, idx) => ({
        id: `avail-${businessId}-${idx}`,
        business_id: businessId,
        day,
        available: true
      }));
    }
    return list;
  }

  setAvailability(businessId: string, list: Availability[]): Availability[] {
    this.availability = [
      ...this.availability.filter(a => a.business_id !== businessId),
      ...list
    ];
    this.save('jourj_availability', this.availability);
    return this.getAvailability(businessId);
  }

  // Registration Links (Category-based!)
  getRegistrationLinks(): RegistrationLink[] {
    return this.links.map(l => ({
      ...l,
      category: this.categories.find(c => c.id === l.category_id)
    }));
  }

  getRegistrationLinkByToken(token: string): RegistrationLink | undefined {
    const link = this.links.find(l => l.token.trim().toLowerCase() === token.trim().toLowerCase());
    if (!link) return undefined;
    return {
      ...link,
      category: this.categories.find(c => c.id === link.category_id)
    };
  }

  createRegistrationLink(categoryId: string, expiresDays = 30): RegistrationLink {
    const newLink: RegistrationLink = {
      id: 'link-' + Math.random().toString(36).substring(2, 9),
      category_id: categoryId,
      token: Math.random().toString(36).substring(2, 10).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase(),
      used: false,
      expires_at: new Date(Date.now() + expiresDays * 86400000).toISOString(),
      created_at: new Date().toISOString()
    };
    this.links.unshift(newLink);
    this.save('jourj_links', this.links);
    return {
      ...newLink,
      category: this.categories.find(c => c.id === categoryId)
    };
  }

  markLinkUsed(token: string) {
    const idx = this.links.findIndex(l => l.token.trim().toLowerCase() === token.trim().toLowerCase());
    if (idx >= 0) {
      this.links[idx].used = true;
      this.save('jourj_links', this.links);
    }
  }

  // Profiles
  getProfiles(): Profile[] {
    return [...this.profiles];
  }

  saveProfile(profile: Profile): Profile {
    const idx = this.profiles.findIndex(p => p.id === profile.id || p.email === profile.email);
    if (idx >= 0) {
      this.profiles[idx] = { ...profile };
    } else {
      this.profiles.push(profile);
    }
    this.save('jourj_profiles', this.profiles);
    return profile;
  }
}

const localStore = new LocalStore();

// ============================================================================
// REAL-TIME SYNCHRONIZATION ENGINE (Supabase WebSockets + Cross-Tab Bus)
// ============================================================================

export interface RealtimePayload {
  source: 'supabase' | 'broadcast' | 'storage';
  table?: string;
  action?: string;
  data?: any;
  timestamp?: number;
}

class RealtimeEngine {
  private listeners: Set<(payload: RealtimePayload) => void> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private supabaseChannel: any = null;
  private isSubscribedToSupabase = false;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('jourj_realtime_bus');
        this.broadcastChannel.onmessage = (event) => {
          this.notifyListeners({ source: 'broadcast', ...event.data });
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported:', e);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e: StorageEvent) => {
        if (e.key && e.key.startsWith('jourj_')) {
          this.notifyListeners({ source: 'storage', table: e.key });
        }
      });
    }

    this.initSupabaseRealtime();
  }

  public initSupabaseRealtime() {
    if (this.isSubscribedToSupabase || !isSupabaseConfigured || !supabase) return;

    try {
      this.supabaseChannel = supabase
        .channel('jourj_realtime_public')
        .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
          console.log('⚡ [Supabase Realtime] postgres_changes:', payload);
          this.notifyListeners({
            source: 'supabase',
            table: payload.table,
            action: payload.eventType,
            data: payload.new || payload.old,
            timestamp: Date.now()
          });
        })
        .subscribe((status) => {
          console.log('⚡ [Supabase Realtime] Channel status:', status);
        });

      this.isSubscribedToSupabase = true;
    } catch (err) {
      console.warn('Error connecting to Supabase Realtime channel:', err);
    }
  }

  public broadcast(table: string, action: string, data?: any) {
    const payload: RealtimePayload = {
      source: 'broadcast',
      table,
      action,
      data,
      timestamp: Date.now()
    };

    // 1. Broadcast to other tabs/windows
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch {
        // ignore
      }
    }

    // 2. Broadcast to local components in current tab
    this.notifyListeners(payload);
  }

  private notifyListeners(payload: RealtimePayload) {
    this.listeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (err) {
        console.error('Realtime listener error:', err);
      }
    });
  }

  public subscribe(callback: (payload: RealtimePayload) => void): () => void {
    this.listeners.add(callback);
    this.initSupabaseRealtime();

    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const realtime = new RealtimeEngine();

// ============================================================================
// UNIFIED DATA SERVICE (Supabase with Robust Fallback)
// ============================================================================

export const api = {
  // 1. Categories
  async getCategories(onlyActive = true): Promise<Category[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('categories').select('*');
        if (onlyActive) {
          query = query.eq('active', true);
        }
        const { data, error } = await query.order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
          return data as Category[];
        }
      } catch {
        // fallback
      }
    }
    return localStore.getCategories(onlyActive);
  },

  async getCategoryById(id: string): Promise<Category | null> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data as Category;
      } catch {
        // fallback
      }
    }
    return localStore.getCategoryById(id) || null;
  },

  // 2. Businesses by Category (Multiple businesses inside a category)
  async getBusinessesByCategory(categoryId: string, onlyActive = true): Promise<Business[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('businesses')
          .select('*')
          .eq('category_id', categoryId);
        if (onlyActive) {
          query = query.eq('active', true);
        }
        const { data, error } = await query.order('rating', { ascending: false });
        if (!error && data) {
          return data as Business[];
        }
      } catch {
        // fallback
      }
    }
    return localStore.getBusinesses(categoryId, onlyActive);
  },

  // 3. Single Business Detail
  async getBusinessById(id: string): Promise<Business | null> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data as Business;
      } catch {
        // fallback
      }
    }
    return localStore.getBusinessById(id) || null;
  },

  // 4. Portfolio Gallery for Business
  async getPortfolio(businessId: string): Promise<PortfolioItem[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*')
          .eq('business_id', businessId)
          .order('sort_order', { ascending: true });
        if (!error && data) return data as PortfolioItem[];
      } catch {
        // fallback
      }
    }
    return localStore.getPortfolio(businessId);
  },

  // 5. Availability Schedule for Business
  async getAvailability(businessId: string): Promise<Availability[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('availability')
          .select('*')
          .eq('business_id', businessId);
        if (!error && data && data.length > 0) return data as Availability[];
      } catch {
        // fallback
      }
    }
    return localStore.getAvailability(businessId);
  },

  // 6. Token Verification for Registration
  async verifyRegistrationToken(token: string): Promise<{
    valid: boolean;
    error?: string;
    link?: RegistrationLink;
    category?: Category;
  }> {
    if (!token || !token.trim()) {
      return { valid: false, error: 'رابط التسجيل غير صالح.' };
    }

    const cleanToken = token.trim();

    // Check Supabase first
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('registration_links')
          .select('*, categories(*)')
          .eq('token', cleanToken)
          .single();

        if (!error && data) {
          if (data.used) {
            return { valid: false, error: 'هذا الرابط تم استخدامه مسبقاً.' };
          }
          if (new Date(data.expires_at) < new Date()) {
            return { valid: false, error: 'هذا الرابط منتهي الصلاحية.' };
          }
          return {
            valid: true,
            link: data as RegistrationLink,
            category: data.categories as Category
          };
        }
      } catch {
        // fallback
      }
    }

    // Local Verification
    const link = localStore.getRegistrationLinkByToken(cleanToken);
    if (!link) {
      return { valid: false, error: 'رابط التسجيل غير صالح.' };
    }
    if (link.used) {
      return { valid: false, error: 'هذا الرابط تم استخدامه مسبقاً.' };
    }
    if (new Date(link.expires_at) < new Date()) {
      return { valid: false, error: 'هذا الرابط منتهي الصلاحية.' };
    }

    const category = localStore.getCategoryById(link.category_id);
    if (!category) {
      return { valid: false, error: 'الفئة المرتبطة بهذا الرابط غير موجودة.' };
    }

    return {
      valid: true,
      link,
      category
    };
  },

  // 7. Owner Registration & Business Creation
  // CRITICAL REQUIREMENT: category_id MUST come strictly from verified Registration Token!
  async registerOwnerAndBusiness(params: {
    token: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    businessName: string;
    businessTitle: string;
    businessDescription: string;
    businessPhone: string;
    businessAddress: string;
    businessLocation?: string;
    businessPrice: number;
    businessPriceUnit?: string;
    businessMainImage: string;
  }): Promise<{ success: boolean; error?: string; business?: Business; profile?: Profile }> {
    // 1. Verify token
    const tokenCheck = await this.verifyRegistrationToken(params.token);
    if (!tokenCheck.valid || !tokenCheck.link || !tokenCheck.category) {
      return { success: false, error: tokenCheck.error || 'رابط التسجيل غير صالح.' };
    }

    const enforcedCategoryId = tokenCheck.link.category_id;
    const newOwnerId = 'owner-' + Math.random().toString(36).substring(2, 9);
    const newBusinessId = 'biz-' + Math.random().toString(36).substring(2, 9);

    const newProfile: Profile = {
      id: newOwnerId,
      full_name: params.ownerName.trim(),
      phone: params.ownerPhone.trim(),
      email: params.ownerEmail.trim().toLowerCase(),
      role: 'owner',
      created_at: new Date().toISOString()
    };

    const newBusiness: Business = {
      id: newBusinessId,
      category_id: enforcedCategoryId, // LOCKED: comes from verified token!
      owner_id: newOwnerId,
      name: params.businessName.trim(),
      title: params.businessTitle.trim() || params.businessName.trim(),
      description: params.businessDescription.trim() || null,
      phone: params.businessPhone.trim() || params.ownerPhone.trim(),
      email: params.ownerEmail.trim().toLowerCase(),
      address: params.businessAddress.trim(),
      location: params.businessLocation?.trim() || 'وهران، الجزائر',
      price: Number(params.businessPrice) || 50000,
      price_unit: params.businessPriceUnit || 'دج',
      rating: 5.0,
      main_image: params.businessMainImage.trim() || tokenCheck.category.image_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save to Supabase if available
    if (isSupabaseConfigured) {
      try {
        await supabase.from('profiles').insert(newProfile);
        await supabase.from('businesses').insert(newBusiness);
        await supabase
          .from('registration_links')
          .update({ used: true })
          .eq('token', params.token.trim());

        // Default availability
        const defaultAvail = DAYS.map(day => ({
          business_id: newBusinessId,
          day,
          available: true
        }));
        await supabase.from('availability').insert(defaultAvail);
      } catch {
        // fallback
      }
    }

    // Save to local store
    localStore.saveProfile(newProfile);
    localStore.saveBusiness(newBusiness);
    localStore.markLinkUsed(params.token);
    localStore.setAvailability(
      newBusinessId,
      DAYS.map((day, i) => ({
        id: `avail-${newBusinessId}-${i}`,
        business_id: newBusinessId,
        day,
        available: true
      }))
    );

    // Broadcast Realtime Event
    realtime.broadcast('businesses', 'create', newBusiness);
    realtime.broadcast('profiles', 'create', newProfile);
    realtime.broadcast('registration_links', 'update', { token: params.token, used: true });

    return {
      success: true,
      business: newBusiness,
      profile: newProfile
    };
  },

  // 8. Admin APIs
  async adminGetCategories(): Promise<Category[]> {
    return this.getCategories(false);
  },

  async adminSaveCategory(category: Category): Promise<Category> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('categories').upsert(category);
      } catch {
        // fallback
      }
    }
    const saved = localStore.saveCategory(category);
    realtime.broadcast('categories', 'save', saved);
    return saved;
  },

  async adminDeleteCategory(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch {
        // fallback
      }
    }
    const ok = localStore.deleteCategory(id);
    realtime.broadcast('categories', 'delete', { id });
    return ok;
  },

  async adminGetBusinesses(): Promise<Business[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data as Business[];
      } catch {
        // fallback
      }
    }
    return localStore.getBusinesses(undefined, false);
  },

  async adminToggleBusinessStatus(id: string, active: boolean): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('businesses').update({ active }).eq('id', id);
      } catch {
        // fallback
      }
    }
    const biz = localStore.getBusinessById(id);
    if (biz) {
      biz.active = active;
      localStore.saveBusiness(biz);
      realtime.broadcast('businesses', 'update', { id, active });
      return true;
    }
    return false;
  },

  async adminGetRegistrationLinks(): Promise<RegistrationLink[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('registration_links')
          .select('*, categories(*)')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data.map(item => ({
            ...item,
            category: item.categories as Category
          })) as RegistrationLink[];
        }
      } catch {
        // fallback
      }
    }
    return localStore.getRegistrationLinks();
  },

  async adminCreateRegistrationLink(categoryId: string, expiresDays = 30): Promise<RegistrationLink> {
    const link = localStore.createRegistrationLink(categoryId, expiresDays);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('registration_links').insert({
          id: link.id,
          category_id: link.category_id,
          token: link.token,
          used: false,
          expires_at: link.expires_at
        });
      } catch {
        // fallback
      }
    }
    realtime.broadcast('registration_links', 'create', link);
    return link;
  },

  // 9. Owner APIs (Strict Isolation: query by ownerId, NEVER data[0])
  async ownerGetMyBusiness(ownerId: string): Promise<Business | null> {
    if (!ownerId) return null;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', ownerId)
          .single();
        if (!error && data) return data as Business;
      } catch {
        // fallback
      }
    }

    return localStore.getBusinessByOwnerId(ownerId) || null;
  },

  // CRITICAL REQUIREMENT: Prevent Owner from altering category_id!
  async ownerUpdateBusiness(
    businessId: string, 
    ownerId: string, 
    updates: Partial<Omit<Business, 'id' | 'category_id' | 'owner_id' | 'created_at'>>
  ): Promise<{ success: boolean; error?: string; business?: Business }> {
    // 1. Verify ownership
    const existing = await this.getBusinessById(businessId);
    if (!existing) {
      return { success: false, error: 'المؤسسة غير موجودة.' };
    }
    if (existing.owner_id !== ownerId) {
      return { success: false, error: 'غير مصرح: لا يمكنك تعديل مؤسسة لا تملكها.' };
    }

    // 2. Reject any attempt to change category_id
    if ('category_id' in (updates as Record<string, unknown>)) {
      return { success: false, error: 'ممنوع أمنياً: لا يمكن تغيير فئة المؤسسة.' };
    }

    const updatedBusiness: Business = {
      ...existing,
      ...updates,
      id: existing.id,
      category_id: existing.category_id, // ENFORCED: preserved unchanged!
      owner_id: existing.owner_id,       // ENFORCED: preserved unchanged!
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('businesses')
          .update(updates)
          .eq('id', businessId)
          .eq('owner_id', ownerId);
        if (error) throw error;
      } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : 'فشل تحديث البيانات في قاعدة البيانات.' };
      }
    }

    localStore.saveBusiness(updatedBusiness);
    realtime.broadcast('businesses', 'update', updatedBusiness);
    return { success: true, business: updatedBusiness };
  },

  async ownerSavePortfolio(businessId: string, ownerId: string, items: PortfolioItem[]): Promise<PortfolioItem[]> {
    const existing = await this.getBusinessById(businessId);
    if (!existing || existing.owner_id !== ownerId) {
      throw new Error('غير مصرح لك بتعديل هذا المعرض.');
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('portfolio').delete().eq('business_id', businessId);
        if (items.length > 0) {
          await supabase.from('portfolio').insert(items);
        }
      } catch {
        // fallback
      }
    }

    const saved = localStore.setPortfolio(businessId, items);
    realtime.broadcast('portfolio', 'update', { businessId, items });
    return saved;
  },

  async ownerSaveAvailability(businessId: string, ownerId: string, list: Availability[]): Promise<Availability[]> {
    const existing = await this.getBusinessById(businessId);
    if (!existing || existing.owner_id !== ownerId) {
      throw new Error('غير مصرح لك بتعديل جدول التوفر.');
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('availability').delete().eq('business_id', businessId);
        if (list.length > 0) {
          await supabase.from('availability').insert(list);
        }
      } catch {
        // fallback
      }
    }

    const saved = localStore.setAvailability(businessId, list);
    realtime.broadcast('availability', 'update', { businessId, list });
    return saved;
  },

  // 10. Simple Auth Helpers for Admin / Owner testing
  async getProfiles(): Promise<Profile[]> {
    return localStore.getProfiles();
  },

  // ============================================================================
  // 11. REAL-TIME API SUBSCRIPTIONS & DATABASE MANAGEMENT
  // ============================================================================
  subscribeToRealtime(callback: (payload: RealtimePayload) => void): () => void {
    return realtime.subscribe(callback);
  },

  broadcastChange(table: string, action: string, data?: any) {
    realtime.broadcast(table, action, data);
  },

  async testRealtimeConnection() {
    return testSupabaseConnection();
  },

  async syncSeedToSupabase(): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'قاعدة بيانات Supabase غير مهيأة بعد.' };
    }
    try {
      const cats = localStore.getCategories(false);
      const bizs = localStore.getBusinesses(undefined, false);
      const profs = localStore.getProfiles();
      const links = localStore.getRegistrationLinks();

      if (cats.length > 0) {
        await supabase.from('categories').upsert(cats);
      }
      if (bizs.length > 0) {
        await supabase.from('businesses').upsert(bizs);
      }
      if (profs.length > 0) {
        await supabase.from('profiles').upsert(profs);
      }
      if (links.length > 0) {
        await supabase.from('registration_links').upsert(links);
      }

      realtime.broadcast('all', 'sync', { count: bizs.length });
      return { success: true, message: 'تمت مزامنة جميع البيانات بنجاح مع قاعدة البيانات السحابية الحقيقية!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'فشلت المزامنة مع Supabase' };
    }
  }
};
