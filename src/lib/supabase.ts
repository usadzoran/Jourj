import { createClient } from '@supabase/supabase-js';

const env = typeof import.meta !== 'undefined' && 'env' in import.meta ? (import.meta as { env?: Record<string, string> }).env : undefined;

const supabaseUrl = env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

// Create standard Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
