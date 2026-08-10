import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const isDevelopment = process.env.NODE_ENV !== 'production';
const runtimeSupabaseUrl =
  isDevelopment && typeof window !== 'undefined' ? window.location.origin : supabaseUrl;

export const supabase =
  runtimeSupabaseUrl && supabaseAnonKey
    ? createClient(runtimeSupabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;
