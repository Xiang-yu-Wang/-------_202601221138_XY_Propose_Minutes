import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// 輔助函數：檢查 Supabase 是否已配置
export const isSupabaseConfigured = (): boolean => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

// 創建 Supabase 客戶端
// 即使 URL 為空也會創建（用於類型推斷），但實際使用前應檢查 isSupabaseConfigured()
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

if (!isSupabaseConfigured()) {
  console.warn('Supabase 環境變數未設定，請設定 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
}
