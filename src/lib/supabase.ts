import { createClient } from "@supabase/supabase-js";

// Supabase Environment Configurations
// These must be provided in your local .env file or production host!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Initialize the single Supabase client for interacting with the Telemetry Database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
