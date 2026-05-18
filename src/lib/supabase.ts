import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment settings.');
}

// Create a dummy client if credentials are missing to avoid crashing on load
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      storage: { from: () => ({ upload: () => Promise.resolve({ error: new Error("Supabase not configured") }), getPublicUrl: () => ({ data: { publicUrl: "" } }) }) },
      from: () => ({ insert: () => Promise.resolve({ error: new Error("Supabase not configured") }), select: () => ({}) })
    } as any;
