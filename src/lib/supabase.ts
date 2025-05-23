import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbRecipe {
  id: string;
  user_id: string;
  title: string;
  category: string;
  prep_time: string;
  difficulty: string;
  spicy_level: number;
  image_url: string;
  ingredients: {
    item: string;
    amount: string;
    notes?: string;
  }[];
  instructions: {
    step: number;
    description: string;
  }[];
  tips: string[];
  substitutions: {
    ingredient: string;
    alternatives: string[];
  }[];
  created_at: string;
  updated_at: string;
} 