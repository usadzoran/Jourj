import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = typeof import.meta !== 'undefined' && 'env' in import.meta 
  ? (import.meta as { env?: Record<string, string> }).env 
  : undefined;

function getInitialConfig(): { url: string; key: string } {
  const envUrl = env?.VITE_SUPABASE_URL || '';
  const envKey = env?.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey && envUrl.startsWith('http') && !envUrl.includes('placeholder')) {
    return { url: envUrl, key: envKey };
  }

  // Fallback to local storage configuration if set by admin in the live app
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const savedUrl = localStorage.getItem('JOURJ_SUPABASE_URL');
      const savedKey = localStorage.getItem('JOURJ_SUPABASE_ANON_KEY');
      if (savedUrl && savedKey && savedUrl.startsWith('http')) {
        return { url: savedUrl, key: savedKey };
      }
    } catch {
      // ignore
    }
  }

  return { url: '', key: '' };
}

let activeConfig = getInitialConfig();

export let isSupabaseConfigured = Boolean(
  activeConfig.url && 
  activeConfig.key && 
  activeConfig.url.startsWith('http') &&
  !activeConfig.url.includes('placeholder')
);

export let supabase: SupabaseClient = createClient(
  activeConfig.url || 'https://placeholder.supabase.co',
  activeConfig.key || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Allow dynamically connecting/switching Supabase in real-time
export function setSupabaseConfig(url: string, anonKey: string): boolean {
  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();

  if (!cleanUrl.startsWith('http') || !cleanKey) {
    return false;
  }

  try {
    activeConfig = { url: cleanUrl, key: cleanKey };
    isSupabaseConfigured = true;

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('JOURJ_SUPABASE_URL', cleanUrl);
      localStorage.setItem('JOURJ_SUPABASE_ANON_KEY', cleanKey);
    }

    supabase = createClient(cleanUrl, cleanKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });

    return true;
  } catch (err) {
    console.error('Failed to configure Supabase:', err);
    return false;
  }
}

export function clearSupabaseConfig() {
  activeConfig = { url: '', key: '' };
  isSupabaseConfigured = false;
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('JOURJ_SUPABASE_URL');
    localStorage.removeItem('JOURJ_SUPABASE_ANON_KEY');
  }
}

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'قاعدة بيانات Supabase غير مهيأة بعد' };
  }

  const start = Date.now();
  try {
    const { error } = await supabase.from('categories').select('id').limit(1);
    const latencyMs = Date.now() - start;

    if (error) {
      return { 
        success: false, 
        message: `فشل الاتصال: ${error.message} (كود: ${error.code || 'غير معروف'})` 
      };
    }

    return { 
      success: true, 
      message: `تم الاتصال بنجاح بقاعدة البيانات في الوقت الحقيقي (Real-Time)`,
      latencyMs
    };
  } catch (err: any) {
    return { 
      success: false, 
      message: `خطأ أثناء الاتصال: ${err?.message || 'تعذر الوصول إلى الخادم'}` 
    };
  }
}
