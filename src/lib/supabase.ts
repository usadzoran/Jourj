/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get credentials from env or local override
export const getStoredSupabaseConfig = () => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('jourj_supabase_url');
  const localKey = localStorage.getItem('jourj_supabase_key');

  const url = (localUrl || envUrl || '').trim();
  const key = (localKey || envKey || '').trim();

  return {
    url,
    key,
    isConfigured: Boolean(url && key && url.startsWith('http') && key.length > 10)
  };
};

let clientInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const config = getStoredSupabaseConfig();
  if (!config.isConfigured) {
    return null;
  }

  if (!clientInstance) {
    try {
      clientInstance = createClient(config.url, config.key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      });
    } catch (err) {
      console.warn('Error initializing Supabase client:', err);
      return null;
    }
  }

  return clientInstance;
};

export const saveSupabaseConfig = (url: string, key: string) => {
  if (url && key) {
    localStorage.setItem('jourj_supabase_url', url.trim());
    localStorage.setItem('jourj_supabase_key', key.trim());
    clientInstance = null; // reset client
    return true;
  } else {
    localStorage.removeItem('jourj_supabase_url');
    localStorage.removeItem('jourj_supabase_key');
    clientInstance = null;
    return false;
  }
};

export const testSupabaseConnection = async (url: string, key: string): Promise<{ success: boolean; message: string }> => {
  try {
    const testClient = createClient(url, key);
    const { error } = await testClient.from('categories').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      return { success: false, message: error.message || 'فشل الاتصال بقاعدة البيانات' };
    }
    return { success: true, message: 'تم الاتصال بنجاح مع Supabase!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'تعذر الاتصال بـ Supabase' };
  }
};
