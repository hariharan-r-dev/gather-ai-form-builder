import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database";

const getEnv = (key: string): string => {
  try {
    if (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch {}
  try {
    if (typeof process !== "undefined" && process.env) {
      if (process.env[key]) {
        return process.env[key] as string;
      }
      if (typeof (process as any).loadEnvFile === "function") {
        try { (process as any).loadEnvFile(); } catch {}
        if (process.env[key]) {
          return process.env[key] as string;
        }
      }
    }
  } catch {}
  return "";
};

const supabaseUrl = getEnv("VITE_SUPABASE_URL");
const supabaseAnonKey =
  getEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ||
  getEnv("VITE_SUPABASE_ANON_KEY");

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Please verify your environment configuration in .env."
  );
}

export const SUPABASE_URL = supabaseUrl || "https://coqkkheuittnjsvtymno.supabase.co";
export const SUPABASE_ANON_KEY = supabaseAnonKey || "sb_publishable_HzwRtt2cCkvcK-wONpM2OQ_pdJMFFAy";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
