export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  created_at: string;
}

export interface Business {
  id: string;
  category_id: string;
  owner_id: string | null;
  name: string;
  title: string;
  description: string | null;
  phone: string;
  email: string | null;
  address: string;
  location: string;
  price: number;
  price_unit: string;
  rating: number;
  main_image: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  business_id: string;
  image_url: string;
  title: string | null;
  sort_order: number;
  created_at: string;
}

export type DayOfWeek = 'السبت' | 'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة';

export interface Availability {
  id: string;
  business_id: string;
  day: DayOfWeek;
  available: boolean;
}

export interface RegistrationLink {
  id: string;
  category_id: string;
  token: string;
  used: boolean;
  expires_at: string;
  created_at: string;
  // Expanded relation
  category?: Category;
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  email: string;
  role: 'admin' | 'owner';
  created_at: string;
}

export interface AuthSession {
  user: Profile;
  business?: Business | null;
}
