export type WeekDay = 'Lun' | 'Mar' | 'Mer' | 'Jeu' | 'Ven' | 'Sam' | 'Dim';
export type AvailabilityStatus = 'disponible' | 'partiel' | 'reserve';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  description: string;
  image_url: string;
  active: boolean;
  created_at?: string;
}

export interface Business {
  id: string;
  category_id: string;
  category_name?: string;
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
  reviews_count?: number;
  main_image: string;
  cover_image?: string;
  active: boolean;
  morning_hours?: string;
  afternoon_hours?: string;
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

export interface DayAvailability {
  dayNumber: number;
  dateStr: string;
  status: AvailabilityStatus;
}

export interface BookingRequest {
  id: string;
  business_id: string;
  business_name: string;
  date: string;
  time_slot: string;
  client_name: string;
  client_phone: string;
  notes?: string;
  status: 'en_attente' | 'confirmee';
  created_at: string;
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
  email?: string;
  role: 'admin' | 'owner' | 'client';
  created_at?: string;
}

export type AppView = 
  | 'splash'
  | 'home'
  | 'business_detail'
  | 'favorites'
  | 'reservations'
  | 'moi'
  | 'admin'
  | 'owner_login'
  | 'owner_register'
  | 'owner_dashboard';


