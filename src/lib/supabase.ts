import { createClient } from '@supabase/supabase-js';

// BACKEND INTEGRATION: Replace with your actual Supabase project URL and anon key
// These should be stored in environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          name: string;
          email: string;
          project_type: string;
          description: string;
          budget: string;
          status: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          name: string;
          email: string;
          project_type?: string;
          description: string;
          budget?: string;
          status?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          name?: string;
          email?: string;
          project_type?: string;
          description?: string;
          budget?: string;
          status?: string;
        };
      };
    };
  };
};