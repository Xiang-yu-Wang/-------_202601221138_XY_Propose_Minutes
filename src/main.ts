import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { isSupabaseConfigured } from '@/lib/supabase'

const app = createApp(App)

// 開發環境調試信息
if (import.meta.env.DEV) {
  console.log('🚀 應用啟動中...')
  console.log('📋 環境變數:')
  console.log('  - VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ 已配置' : '❌ 未配置')
  console.log('  - VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ 已配置' : '❌ 未配置')
  console.log('  - Supabase 連接狀態:', isSupabaseConfigured() ? '✅ 已連接' : '❌ 未連接')
}

app.use(router)
app.mount('#app')
