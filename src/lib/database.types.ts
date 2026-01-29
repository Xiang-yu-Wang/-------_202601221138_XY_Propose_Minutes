export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          type: 'important' | 'new' | 'info'
          tags: string[]
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          type?: 'important' | 'new' | 'info'
          tags?: string[]
          date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: 'important' | 'new' | 'info'
          tags?: string[]
          date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          category: string
          price: number
          image_url: string | null
          description: string | null
          available: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          price?: number
          image_url?: string | null
          description?: string | null
          available?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          price?: number
          image_url?: string | null
          description?: string | null
          available?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// 方便使用的類型別名
export type Announcement = Database['public']['Tables']['announcements']['Row']
export type AnnouncementInsert = Database['public']['Tables']['announcements']['Insert']
export type AnnouncementUpdate = Database['public']['Tables']['announcements']['Update']

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']
