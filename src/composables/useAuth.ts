import { ref, computed, onMounted } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

// 全局狀態
const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email || '')

  // 初始化：檢查當前 session
  const initialize = async () => {
    if (!isSupabaseConfigured()) {
      loading.value = false
      return
    }

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      session.value = currentSession
      user.value = currentSession?.user ?? null
    } catch (e) {
      console.error('初始化認證失敗:', e)
      error.value = '初始化認證失敗'
    } finally {
      loading.value = false
    }
  }

  // 監聽認證狀態變化
  const setupAuthListener = () => {
    if (!isSupabaseConfigured()) return

    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null
    })
  }

  // Email/密碼登入
  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      error.value = 'Supabase 尚未配置'
      return { success: false, error: error.value }
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) {
        error.value = signInError.message
        return { success: false, error: signInError.message }
      }

      user.value = data.user
      session.value = data.session
      return { success: true, error: null }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : '登入失敗'
      error.value = errMsg
      return { success: false, error: errMsg }
    } finally {
      loading.value = false
    }
  }

  // 註冊新用戶
  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      error.value = 'Supabase 尚未配置'
      return { success: false, error: error.value }
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      })

      if (signUpError) {
        error.value = signUpError.message
        return { success: false, error: signUpError.message }
      }

      // 檢查是否需要確認 email
      if (data.user && !data.session) {
        return { 
          success: true, 
          error: null, 
          message: '請查收確認信件以完成註冊' 
        }
      }

      user.value = data.user
      session.value = data.session
      return { success: true, error: null }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : '註冊失敗'
      error.value = errMsg
      return { success: false, error: errMsg }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const signOut = async () => {
    if (!isSupabaseConfigured()) return

    loading.value = true
    error.value = null

    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) {
        error.value = signOutError.message
        return { success: false, error: signOutError.message }
      }

      user.value = null
      session.value = null
      return { success: true, error: null }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : '登出失敗'
      error.value = errMsg
      return { success: false, error: errMsg }
    } finally {
      loading.value = false
    }
  }

  // 重設密碼（發送 email）
  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured()) {
      error.value = 'Supabase 尚未配置'
      return { success: false, error: error.value }
    }

    loading.value = true
    error.value = null

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`
      })

      if (resetError) {
        error.value = resetError.message
        return { success: false, error: resetError.message }
      }

      return { success: true, error: null, message: '重設密碼信已寄出' }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : '發送重設密碼信失敗'
      error.value = errMsg
      return { success: false, error: errMsg }
    } finally {
      loading.value = false
    }
  }

  // 更新密碼
  const updatePassword = async (newPassword: string) => {
    if (!isSupabaseConfigured()) {
      error.value = 'Supabase 尚未配置'
      return { success: false, error: error.value }
    }

    loading.value = true
    error.value = null

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) {
        error.value = updateError.message
        return { success: false, error: updateError.message }
      }

      return { success: true, error: null }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : '更新密碼失敗'
      error.value = errMsg
      return { success: false, error: errMsg }
    } finally {
      loading.value = false
    }
  }

  // 在組件掛載時初始化
  onMounted(() => {
    initialize()
    setupAuthListener()
  })

  return {
    // 狀態
    user,
    session,
    loading,
    error,
    isAuthenticated,
    userEmail,
    isSupabaseConfigured,
    // 方法
    initialize,
    signInWithEmail,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  }
}
