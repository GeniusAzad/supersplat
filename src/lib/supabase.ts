import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          is_seller: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          is_seller?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          is_seller?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      splats: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          file_url: string
          thumbnail_url: string | null
          category: string
          tags: string[]
          seller_id: string
          is_featured: boolean
          download_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          file_url: string
          thumbnail_url?: string | null
          category: string
          tags?: string[]
          seller_id: string
          is_featured?: boolean
          download_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          file_url?: string
          thumbnail_url?: string | null
          category?: string
          tags?: string[]
          seller_id?: string
          is_featured?: boolean
          download_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          splat_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          splat_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          splat_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          splat_id: string
          buyer_id: string
          seller_id: string
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          splat_id: string
          buyer_id: string
          seller_id: string
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          splat_id?: string
          buyer_id?: string
          seller_id?: string
          amount?: number
          created_at?: string
        }
      }
    }
  }
}