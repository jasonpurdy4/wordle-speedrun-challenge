import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string
          updated_at?: string
        }
      }
      game_sessions: {
        Row: {
          id: string
          user_id: string
          current_streak: number
          total_time: number
          current_word: string
          is_active: boolean
          started_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_streak?: number
          total_time?: number
          current_word: string
          is_active?: boolean
          started_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_streak?: number
          total_time?: number
          current_word?: string
          is_active?: boolean
          updated_at?: string
        }
      }
      leaderboards: {
        Row: {
          id: string
          user_id: string
          username: string
          streak_level: number
          completion_time: number
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          streak_level: number
          completion_time: number
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          streak_level?: number
          completion_time?: number
          completed_at?: string
        }
      }
    }
  }
}