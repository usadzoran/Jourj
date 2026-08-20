export type WeekDay = 'السبت' | 'الأحد' | 'الإثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة';

export interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  active: boolean;
  created_at?: string;
}

export interface Business {
  id: string;
  category_id: string;
  owner_id?: string | null;
  name: string;
  title: string;
  description: string;
  phone: string;
  email?: string;
  address: string;
  location: string;
  price: number;
  price_unit: string;
  rating: number;
  main_image: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioItem {
  id: string;
  business_id: string;
  image_url: string;
  title?: string;
  sort_order: number;
  created_at?: string;
}

export interface AvailabilityItem {
  id?: string;
  business_id: string;
  day: WeekDay;
  available: boolean;
}

export interface RegistrationLink {
  id: string;
  business_id: string;
  token: string;
  used: boolean;
  expires_at: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  email: string;
  role: 'admin' | 'owner';
  created_at?: string;
}

export type AppView = 
  | 'splash'
  | 'home'
  | 'category_detail'
  | 'business_detail'
  | 'admin'
  | 'owner_login'
  | 'owner_register'
  | 'owner_dashboard';
