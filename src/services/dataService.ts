import { Category, Business, PortfolioItem, DayAvailability, BookingRequest, UserProfile, RegistrationLink, AvailabilityItem, WeekDay } from '../types';
import { getSupabase } from '../lib/supabase';

export const ALL_WEEK_DAYS: WeekDay[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'photographe',
    name: 'Photographe',
    icon: '📸',
    description: 'Photographes et vidéastes professionnels pour immortaliser votre grand jour',
    image_url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'salle',
    name: 'Salle',
    icon: '🏛️',
    description: 'Salles des fêtes et domaines somptueux à Oran pour une réception royale',
    image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'costume',
    name: 'Costume',
    icon: '🤵',
    description: 'Costumes de marié, smokings italiens et tenues de cérémonie sur-mesure',
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'voiture',
    name: 'Voiture',
    icon: '🚗',
    description: 'Véhicules de luxe avec chauffeur pour un cortège prestigieux',
    image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'traiteur',
    name: 'Traiteur',
    icon: '🍽️',
    description: 'Gastronomie raffinée, buffets royaux et délices traditionnels et modernes',
    image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'decoration',
    name: 'Décoration',
    icon: '🌸',
    description: 'Scénographies florales féeriques, centres de tables et trônes d\'honneur',
    image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    active: true,
    created_at: new Date().toISOString()
  }
];

export const SEED_BUSINESSES: Business[] = [
  {
    id: 'studio-elegance',
    category_id: 'photographe',
    category_name: 'Photographe',
    owner_id: null,
    name: 'Studio Élégance',
    title: 'Photographie & Vidéographie Cinématique de Mariage',
    description: 'Immortalisez chaque émotion de votre union avec une équipe d\'artistes passionnés. Nous réalisons des prises de vue cinématiques 4K, des albums de luxe en cuir italien, ainsi que des séances de couple féeriques en extérieur.',
    phone: '+213 555 12 34 56',
    email: 'contact@studioelegance-oran.dz',
    address: '12 Rue des Frères Bessol, Akid Lotfi, Oran, Algérie',
    location: 'Oran',
    price: 45000,
    price_unit: 'DA',
    rating: 4.9,
    reviews_count: 128,
    main_image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
    morning_hours: '08:00 — 12:00',
    afternoon_hours: '14:00 — 19:00',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'royal-wedding',
    category_id: 'salle',
    category_name: 'Salle',
    owner_id: null,
    name: 'Royal Wedding',
    title: 'Salle des Fêtes & Domaine Prestigieux pour Réceptions',
    description: 'Une somptueuse salle d\'une capacité de 600 convives, dotée de lustres en cristal de Bohême, d\'une suite privative pour les mariés, d\'une acoustique de concert et d\'un parking privé sécurisé au cœur de la baie d\'Oran.',
    phone: '+213 560 22 44 66',
    email: 'reservation@royalwedding-oran.dz',
    address: 'Boulevard Millenium, Canastel, Oran, Algérie',
    location: 'Oran',
    price: 180000,
    price_unit: 'DA',
    rating: 5.0,
    reviews_count: 214,
    main_image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    cover_image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1400&q=80',
    morning_hours: '08:00 — 12:00',
    afternoon_hours: '14:00 — 19:00',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'luxury-cars',
    category_id: 'voiture',
    category_name: 'Voiture',
    owner_id: null,
    name: 'Luxury Cars',
    title: 'Véhicules de Prestige & Limousines avec Chauffeur Privé',
    description: 'Faites une entrée inoubliable avec nos berlines de grand luxe (Mercedes Classe S, Porsche Panamera, Range Rover Autobiography). Chauffeur bilingue en costume cravate, décoration florale incluse et service VIP.',
    phone: '+213 551 77 88 99',
    email: 'contact@luxurycars-oran.dz',
    address: 'Front de Mer, Seddikia, Oran, Algérie',
    location: 'Oran',
    price: 25000,
    price_unit: 'DA',
    rating: 4.8,
    reviews_count: 96,
    main_image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    cover_image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=80',
    morning_hours: '08:00 — 12:00',
    afternoon_hours: '14:00 — 19:00',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'maison-du-traiteur',
    category_id: 'traiteur',
    category_name: 'Traiteur',
    owner_id: null,
    name: 'Maison du Traiteur',
    title: 'Haute Gastronomie, Buffets Royaux & Service de Table',
    description: 'Une expérience culinaire d\'exception alliant la noblesse de la cuisine traditionnelle algérienne aux créations gastronomiques internationales. Service à l\'assiette impérial, cocktails de bienvenue et pyramides de douceurs orientales.',
    phone: '+213 661 98 76 54',
    email: 'contact@maison-traiteur.dz',
    address: '45 Avenue Larbi Ben M\'hidi, Centre-Ville, Oran, Algérie',
    location: 'Oran',
    price: 3800,
    price_unit: 'DA / pers',
    rating: 4.9,
    reviews_count: 185,
    main_image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    cover_image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1400&q=80',
    morning_hours: '08:00 — 12:00',
    afternoon_hours: '14:00 — 19:00',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'elegance-homme',
    category_id: 'costume',
    category_name: 'Costume',
    owner_id: null,
    name: 'Élégance Homme',
    title: 'Costumes de Marié, Smokings & Haute Couture Italienne',
    description: 'L\'adresse de référence pour le marié moderne à Oran. Découvrez nos collections exclusives de smokings sur-mesure, costumes 3 pièces en laine vierge et soie, souliers patinés à la main et boutons de manchette précieux.',
    phone: '+213 770 33 44 55',
    email: 'boutique@elegancehomme-oran.dz',
    address: 'Boulevard des Lions, Maraval, Oran, Algérie',
    location: 'Oran',
    price: 35000,
    price_unit: 'DA',
    rating: 4.9,
    reviews_count: 82,
    main_image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
    cover_image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=80',
    morning_hours: '08:00 — 12:00',
    afternoon_hours: '14:00 — 19:00',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fleurs-et-merveilles',
    category_id: 'decoration',
    category_name: 'Décoration',
    owner_id: null,
    name: 'Fleurs & Merveilles',
    title: 'Scénographie Florale & Conception de Décors Féeriques',
    description: 'Nous transformons votre lieu de réception en un jardin enchanté. Arches monumentales en fleurs fraîches, allées d\'honneur aux chandelles, centres de tables raffinés et mise en lumière architecturale sur-mesure.',
    phone: '+213 552 66 11 22',
    email: 'contact@fleursmerveilles.dz',
    address: 'Boulevard de l\'USTO, Oran, Algérie',
    location: 'Oran',
    price: 50000,
    price_unit: 'DA',
    rating: 4.8,
    reviews_count: 110,
    main_image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    cover_image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1400&q=80',
    morning_hours: '08:00 — 12:00',
    afternoon_hours: '14:00 — 19:00',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const SEED_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-p1',
    business_id: 'studio-elegance',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    title: 'Séance Couple au Coucher de Soleil',
    sort_order: 1
  },
  {
    id: 'port-p2',
    business_id: 'studio-elegance',
    image_url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=80',
    title: 'Cérémonie & Échange des Alliances',
    sort_order: 2
  },
  {
    id: 'port-p3',
    business_id: 'studio-elegance',
    image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80',
    title: 'Détails des Alliances en Or Blanc',
    sort_order: 3
  },
  {
    id: 'port-p4',
    business_id: 'studio-elegance',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
    title: 'Portrait de la Mariée en Robe Blanche',
    sort_order: 4
  },
  {
    id: 'port-s1',
    business_id: 'royal-wedding',
    image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80',
    title: 'Vue Panoramique de la Grande Salle',
    sort_order: 1
  },
  {
    id: 'port-s2',
    business_id: 'royal-wedding',
    image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    title: 'Trône Royal & Décor Doré',
    sort_order: 2
  },
  {
    id: 'port-v1',
    business_id: 'luxury-cars',
    image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
    title: 'Mercedes Classe S Noire avec Chauffeur',
    sort_order: 1
  },
  {
    id: 'port-v2',
    business_id: 'luxury-cars',
    image_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
    title: 'Porsche Panamera Cortège Prestige',
    sort_order: 2
  },
  {
    id: 'port-t1',
    business_id: 'maison-du-traiteur',
    image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1000&q=80',
    title: 'Buffet Royal & Entrées Festives',
    sort_order: 1
  },
  {
    id: 'port-t2',
    business_id: 'maison-du-traiteur',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    title: 'Salades Prestige & Verrines Gourmandes',
    sort_order: 2
  },
  {
    id: 'port-c1',
    business_id: 'elegance-homme',
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
    title: 'Smoking Sur-Mesure Col Châle Satiné',
    sort_order: 1
  },
  {
    id: 'port-d1',
    business_id: 'fleurs-et-merveilles',
    image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    title: 'Arche de Cérémonie en Roses Blanches',
    sort_order: 1
  }
];

export const SEED_BOOKINGS: BookingRequest[] = [
  {
    id: 'book-1',
    business_id: 'studio-elegance',
    business_name: 'Studio Élégance',
    date: '2026-09-12',
    time_slot: 'Après-midi (14:00 — 19:00)',
    client_name: 'Yacine & Amira Benali',
    client_phone: '+213 550 11 22 33',
    notes: 'Mariage à Canastel Oran, pack album prestige souhaité.',
    status: 'confirmee',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

const SEED_AVAILABILITY: AvailabilityItem[] = [
  { business_id: 'studio-elegance', day: 'Sam', available: true },
  { business_id: 'studio-elegance', day: 'Dim', available: true },
  { business_id: 'studio-elegance', day: 'Lun', available: true },
  { business_id: 'studio-elegance', day: 'Mar', available: true },
  { business_id: 'studio-elegance', day: 'Mer', available: true },
  { business_id: 'studio-elegance', day: 'Jeu', available: true },
  { business_id: 'studio-elegance', day: 'Ven', available: true },
];

const SEED_REG_LINKS: RegistrationLink[] = [
  {
    id: 'link-1',
    business_id: 'studio-elegance',
    token: 'TOKEN_STUDIO_ELEGANCE_2026',
    used: false,
    expires_at: new Date(Date.now() + 86400000 * 30).toISOString(),
    created_at: new Date().toISOString()
  }
];

const SEED_PROFILES: UserProfile[] = [
  {
    id: 'admin-001',
    full_name: 'Admin JOUR J',
    email: 'admin@jourj.dz',
    phone: '+213 550 00 00 00',
    role: 'admin',
    created_at: new Date().toISOString()
  },
  {
    id: 'owner-studio-elegance',
    full_name: 'Karim Boumediene',
    email: 'contact@studioelegance-oran.dz',
    phone: '+213 555 12 34 56',
    role: 'owner',
    created_at: new Date().toISOString()
  }
];

const STORAGE_KEYS = {
  CATEGORIES: 'jourj_categories_v2',
  BUSINESSES: 'jourj_businesses_v2',
  PORTFOLIO: 'jourj_portfolio_v2',
  AVAILABILITY: 'jourj_availability_v2',
  BOOKINGS: 'jourj_bookings_v2',
  FAVORITES: 'jourj_favorites_v2',
  REG_LINKS: 'jourj_reg_links_v2',
  PROFILES: 'jourj_profiles_v2',
  ACTIVE_USER: 'jourj_active_user_v2',
};

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

export const DataService = {
  // ---- CATEGORIES ----
  async getCategories(): Promise<Category[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (!error && data && data.length > 0) {
          LocalSyncStore.set(STORAGE_KEYS.CATEGORIES, data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase fallback:', err);
      }
    }
    return LocalSyncStore.get<Category[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
  },

  async addCategory(category: Partial<Category>): Promise<Category> {
    const newCat: Category = {
      id: category.id || 'cat-' + Math.random().toString(36).substring(2, 9),
      name: category.name || '',
      icon: category.icon || '✨',
      description: category.description || '',
      image_url: category.image_url || '',
      active: category.active !== undefined ? category.active : true,
      created_at: new Date().toISOString()
    };
    const list = await this.getCategories();
    const updated = [...list, newCat];
    LocalSyncStore.set(STORAGE_KEYS.CATEGORIES, updated);
    return newCat;
  },

  async updateCategory(idOrCategory: string | Category, updates?: Partial<Category>): Promise<Category | null> {
    const list = await this.getCategories();
    let id: string;
    let up: Partial<Category>;

    if (typeof idOrCategory === 'object') {
      id = idOrCategory.id;
      up = idOrCategory;
    } else {
      id = idOrCategory;
      up = updates || {};
    }

    const index = list.findIndex(c => c.id === id);
    if (index === -1) return null;
    const updatedCat = { ...list[index], ...up };
    list[index] = updatedCat;
    LocalSyncStore.set(STORAGE_KEYS.CATEGORIES, list);
    return updatedCat;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const list = await this.getCategories();
    const updated = list.filter(c => c.id !== id);
    LocalSyncStore.set(STORAGE_KEYS.CATEGORIES, updated);
    return true;
  },

  // ---- BUSINESSES ----
  async getBusinesses(): Promise<Business[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('businesses').select('*').order('rating', { ascending: false });
        if (!error && data && data.length > 0) {
          LocalSyncStore.set(STORAGE_KEYS.BUSINESSES, data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase fallback:', err);
      }
    }
    return LocalSyncStore.get<Business[]>(STORAGE_KEYS.BUSINESSES, SEED_BUSINESSES);
  },

  async getBusinessById(id: string): Promise<Business | null> {
    const businesses = await this.getBusinesses();
    return businesses.find(b => b.id === id) || null;
  },

  async createBusiness(business: Partial<Business>): Promise<Business> {
    const id = business.id || 'biz-' + Math.random().toString(36).substring(2, 9);
    const newBiz: Business = {
      id,
      category_id: business.category_id || 'photographe',
      category_name: business.category_name,
      owner_id: business.owner_id || null,
      name: business.name || 'Nouveau Prestataire',
      title: business.title || '',
      description: business.description || '',
      phone: business.phone || '',
      email: business.email || '',
      address: business.address || '',
      location: business.location || 'Oran',
      price: business.price || 0,
      price_unit: business.price_unit || 'DA',
      rating: business.rating || 5.0,
      reviews_count: business.reviews_count || 1,
      main_image: business.main_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      cover_image: business.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
      active: business.active !== undefined ? business.active : true,
      morning_hours: business.morning_hours || '08:00 — 12:00',
      afternoon_hours: business.afternoon_hours || '14:00 — 19:00',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const list = await this.getBusinesses();
    const updated = [newBiz, ...list];
    LocalSyncStore.set(STORAGE_KEYS.BUSINESSES, updated);
    return newBiz;
  },

  async updateBusiness(idOrBusiness: string | Business, updates?: Partial<Business>): Promise<Business | null> {
    const list = await this.getBusinesses();
    let id: string;
    let up: Partial<Business>;

    if (typeof idOrBusiness === 'object') {
      id = idOrBusiness.id;
      up = idOrBusiness;
    } else {
      id = idOrBusiness;
      up = updates || {};
    }

    const index = list.findIndex(b => b.id === id);
    if (index === -1) return null;
    const updatedBiz = { ...list[index], ...up, updated_at: new Date().toISOString() };
    list[index] = updatedBiz;
    LocalSyncStore.set(STORAGE_KEYS.BUSINESSES, list);
    return updatedBiz;
  },

  async deleteBusiness(id: string): Promise<boolean> {
    const list = await this.getBusinesses();
    const updated = list.filter(b => b.id !== id);
    LocalSyncStore.set(STORAGE_KEYS.BUSINESSES, updated);
    return true;
  },

  // ---- PORTFOLIO ----
  async getPortfolio(businessId: string): Promise<PortfolioItem[]> {
    const all = LocalSyncStore.get<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, SEED_PORTFOLIO);
    return all.filter(p => p.business_id === businessId).sort((a, b) => a.sort_order - b.sort_order);
  },

  async addPortfolioItem(item: Omit<PortfolioItem, 'id' | 'created_at'> | PortfolioItem): Promise<PortfolioItem> {
    const newItem: PortfolioItem = {
      ...item,
      id: ('id' in item && item.id) ? item.id : 'port-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString()
    };
    const all = LocalSyncStore.get<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, SEED_PORTFOLIO);
    const updated = [...all, newItem];
    LocalSyncStore.set(STORAGE_KEYS.PORTFOLIO, updated);
    return newItem;
  },

  async deletePortfolioItem(id: string): Promise<boolean> {
    const all = LocalSyncStore.get<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO, SEED_PORTFOLIO);
    const updated = all.filter(p => p.id !== id);
    LocalSyncStore.set(STORAGE_KEYS.PORTFOLIO, updated);
    return true;
  },

  // ---- AVAILABILITY ----
  async getAvailability(businessId: string): Promise<AvailabilityItem[]> {
    const all = LocalSyncStore.get<AvailabilityItem[]>(STORAGE_KEYS.AVAILABILITY, SEED_AVAILABILITY);
    return all.filter(a => a.business_id === businessId);
  },

  async updateAvailability(businessId: string, items: { day: WeekDay; available: boolean }[]): Promise<boolean> {
    const all = LocalSyncStore.get<AvailabilityItem[]>(STORAGE_KEYS.AVAILABILITY, SEED_AVAILABILITY);
    const otherBiz = all.filter(a => a.business_id !== businessId);
    const newItems = items.map(item => ({
      id: `avail-${businessId}-${item.day}`,
      business_id: businessId,
      day: item.day,
      available: item.available
    }));
    LocalSyncStore.set(STORAGE_KEYS.AVAILABILITY, [...otherBiz, ...newItems]);
    return true;
  },

  async getMonthlyAvailability(businessId: string, year: number, month: number): Promise<DayAvailability[]> {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: DayAvailability[] = [];
    const seed = businessId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayHash = (day * 7 + seed + (month + 1) * 3) % 10;
      
      let status: 'disponible' | 'partiel' | 'reserve';
      if (dayHash === 3 || dayHash === 7) {
        status = 'reserve';
      } else if (dayHash === 1 || dayHash === 6) {
        status = 'partiel';
      } else {
        status = 'disponible';
      }

      result.push({
        dayNumber: day,
        dateStr,
        status
      });
    }

    return result;
  },

  // ---- BOOKINGS ----
  async getBookings(businessId?: string): Promise<BookingRequest[]> {
    const all = LocalSyncStore.get<BookingRequest[]>(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
    if (businessId) {
      return all.filter(b => b.business_id === businessId);
    }
    return all;
  },

  async createBooking(booking: Omit<BookingRequest, 'id' | 'created_at' | 'status'>): Promise<BookingRequest> {
    const newBooking: BookingRequest = {
      ...booking,
      id: 'book-' + Math.random().toString(36).substring(2, 9),
      status: 'en_attente',
      created_at: new Date().toISOString()
    };

    const current = LocalSyncStore.get<BookingRequest[]>(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
    const updated = [newBooking, ...current];
    LocalSyncStore.set(STORAGE_KEYS.BOOKINGS, updated);
    return newBooking;
  },

  // ---- REGISTRATION LINKS ----
  async getRegistrationLinks(): Promise<RegistrationLink[]> {
    return LocalSyncStore.get<RegistrationLink[]>(STORAGE_KEYS.REG_LINKS, SEED_REG_LINKS);
  },

  async createRegistrationLink(businessId: string, customToken?: string): Promise<RegistrationLink> {
    const token = customToken || ('TOKEN_' + Math.random().toString(36).substring(2, 10).toUpperCase());
    const link: RegistrationLink = {
      id: 'link-' + Math.random().toString(36).substring(2, 9),
      business_id: businessId,
      token,
      used: false,
      expires_at: new Date(Date.now() + 86400000 * 30).toISOString(),
      created_at: new Date().toISOString()
    };
    const current = await this.getRegistrationLinks();
    LocalSyncStore.set(STORAGE_KEYS.REG_LINKS, [link, ...current]);
    return link;
  },

  async verifyRegistrationToken(token: string): Promise<{ valid: boolean; business?: Business; link?: RegistrationLink; error?: string; message?: string }> {
    const links = await this.getRegistrationLinks();
    const link = links.find(l => l.token === token);
    if (!link) return { valid: false, error: 'Jeton d\'invitation invalide ou expiré.', message: 'Jeton d\'invitation invalide ou expiré.' };
    if (link.used) return { valid: false, error: 'Ce lien d\'invitation a déjà été utilisé.', message: 'Ce lien d\'invitation a déjà été utilisé.' };
    const biz = await this.getBusinessById(link.business_id);
    return { valid: true, business: biz || undefined, link };
  },

  async registerOwnerWithToken(token: string, data: { fullName: string; phone: string; email?: string; password?: string }): Promise<{ success: boolean; user?: UserProfile; business?: Business; error?: string; message?: string }> {
    const verify = await this.verifyRegistrationToken(token);
    if (!verify.valid || !verify.link) return { success: false, error: verify.error || 'Erreur de vérification', message: verify.message };

    const newProfile: UserProfile = {
      id: 'owner-' + Math.random().toString(36).substring(2, 9),
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      role: 'owner',
      created_at: new Date().toISOString()
    };

    // Update business owner
    if (verify.business) {
      await this.updateBusiness(verify.business.id, { owner_id: newProfile.id });
    }

    // Mark link as used
    const links = await this.getRegistrationLinks();
    const updatedLinks = links.map(l => l.token === token ? { ...l, used: true } : l);
    LocalSyncStore.set(STORAGE_KEYS.REG_LINKS, updatedLinks);

    // Save profile and set active
    const profiles = LocalSyncStore.get<UserProfile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
    LocalSyncStore.set(STORAGE_KEYS.PROFILES, [...profiles, newProfile]);
    this.setActiveUser(newProfile);

    return { success: true, user: newProfile, business: verify.business };
  },

  // ---- FAVORITES ----
  getFavorites(): string[] {
    return LocalSyncStore.get<string[]>(STORAGE_KEYS.FAVORITES, ['studio-elegance', 'royal-wedding']);
  },

  toggleFavorite(businessId: string): boolean {
    const favs = this.getFavorites();
    let updated: string[];
    let isFav: boolean;
    if (favs.includes(businessId)) {
      updated = favs.filter(id => id !== businessId);
      isFav = false;
    } else {
      updated = [...favs, businessId];
      isFav = true;
    }
    LocalSyncStore.set(STORAGE_KEYS.FAVORITES, updated);
    return isFav;
  },

  isFavorite(businessId: string): boolean {
    return this.getFavorites().includes(businessId);
  },

  // ---- AUTHENTICATION / USER PROFILE ----
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

  async login(emailOrPhone: string, password?: string): Promise<{ success: boolean; user?: UserProfile; business?: Business; error?: string; message?: string }> {
    const profiles = LocalSyncStore.get<UserProfile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
    const cleaned = emailOrPhone.trim().toLowerCase();
    
    // Check admin
    if (cleaned.includes('admin') || cleaned === 'admin@jourj.dz') {
      const admin = profiles.find(p => p.role === 'admin') || SEED_PROFILES[0];
      this.setActiveUser(admin);
      return { success: true, user: admin };
    }

    // Match profile
    const found = profiles.find(p => 
      (p.email && p.email.toLowerCase() === cleaned) || 
      (p.phone && p.phone.replace(/[^0-9]/g, '').includes(cleaned.replace(/[^0-9]/g, '')))
    );

    if (found) {
      this.setActiveUser(found);
      const businesses = await this.getBusinesses();
      const userBiz = businesses.find(b => b.owner_id === found.id || (found.email && b.email?.toLowerCase() === found.email.toLowerCase()));
      return { success: true, user: found, business: userBiz };
    }

    // Auto-create or demo login as client/owner
    const newProfile: UserProfile = {
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      full_name: cleaned.includes('@') ? cleaned.split('@')[0] : 'Client JOUR J',
      phone: cleaned.includes('@') ? '+213 555 00 00 00' : cleaned,
      email: cleaned.includes('@') ? cleaned : undefined,
      role: 'owner',
      created_at: new Date().toISOString()
    };
    this.setActiveUser(newProfile);
    const businesses = await this.getBusinesses();
    return { success: true, user: newProfile, business: businesses[0] };
  },

  async loginSimple(name: string, phone: string): Promise<UserProfile> {
    const profile: UserProfile = {
      id: 'client-' + Math.random().toString(36).substring(2, 9),
      full_name: name,
      phone: phone,
      role: 'client',
      created_at: new Date().toISOString()
    };
    this.setActiveUser(profile);
    return profile;
  },

  logout(): void {
    this.setActiveUser(null);
    const supabase = getSupabase();
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  },

  // ---- IMAGE STORAGE HELPER ----
  async uploadImage(file: File, path?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
};
