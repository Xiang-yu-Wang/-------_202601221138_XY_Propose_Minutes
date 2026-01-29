import { ref, computed, onMounted } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Announcement, AnnouncementInsert, AnnouncementUpdate } from '@/lib/database.types'
import { announcements as defaultAnnouncements } from '@/data/announcements'

// 轉換舊格式到新格式的輔助函數
const convertLegacyAnnouncement = (legacy: any): Announcement => ({
  id: String(legacy.id),
  title: legacy.title,
  content: legacy.content,
  type: legacy.type,
  tags: legacy.tags || [],
  date: legacy.date,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
})

// 全局狀態
const announcements = ref<Announcement[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// localStorage 備援 key
const STORAGE_KEY = 'announcements_data_v2'

export function useSupabaseAnnouncementManager() {
  // 從 Supabase 載入公告
  const fetchAnnouncements = async () => {
    if (!isSupabaseConfigured()) {
      // 如果 Supabase 未配置，使用 localStorage
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        announcements.value = JSON.parse(stored)
      } else {
        // 轉換預設數據
        announcements.value = defaultAnnouncements.map(convertLegacyAnnouncement)
      }
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('announcements')
        .select('*')
        .order('date', { ascending: false })

      if (fetchError) throw fetchError

      announcements.value = data || []
    } catch (e) {
      console.error('載入公告失敗:', e)
      error.value = e instanceof Error ? e.message : '載入公告失敗'
      // 備援：使用 localStorage
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        announcements.value = JSON.parse(stored)
      }
    } finally {
      loading.value = false
    }
  }

  // 新增公告
  const addAnnouncement = async (announcement: Omit<AnnouncementInsert, 'id'>) => {
    if (!isSupabaseConfigured()) {
      // localStorage 模式
      const now = new Date().toISOString()
      const defaultDate = now.split('T')[0]
      const newAnnouncement: Announcement = {
        id: crypto.randomUUID(),
        title: announcement.title,
        content: announcement.content,
        type: announcement.type ?? 'info',
        tags: announcement.tags ?? [],
        date: (announcement.date || defaultDate) as string,
        created_at: now,
        updated_at: now
      }
      announcements.value.unshift(newAnnouncement)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements.value))
      return { success: true, data: newAnnouncement }
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: insertError } = await supabase
        .from('announcements')
        .insert(announcement)
        .select()
        .single()

      if (insertError) throw insertError

      announcements.value.unshift(data)
      return { success: true, data }
    } catch (e) {
      console.error('新增公告失敗:', e)
      error.value = e instanceof Error ? e.message : '新增公告失敗'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 更新公告
  const updateAnnouncement = async (id: string, updates: AnnouncementUpdate) => {
    if (!isSupabaseConfigured()) {
      // localStorage 模式
      const index = announcements.value.findIndex(a => a.id === id)
      const existing = announcements.value[index]
      if (!existing) {
        return { success: false, error: '找不到公告' }
      }
      announcements.value[index] = {
        id: existing.id,
        title: updates.title ?? existing.title,
        content: updates.content ?? existing.content,
        type: updates.type ?? existing.type,
        tags: updates.tags ?? existing.tags,
        date: updates.date ?? existing.date,
        created_at: existing.created_at,
        updated_at: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements.value))
      return { success: true, data: announcements.value[index] }
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      const index = announcements.value.findIndex(a => a.id === id)
      if (index !== -1) {
        announcements.value[index] = data
      }
      return { success: true, data }
    } catch (e) {
      console.error('更新公告失敗:', e)
      error.value = e instanceof Error ? e.message : '更新公告失敗'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 刪除公告
  const deleteAnnouncement = async (id: string) => {
    if (!isSupabaseConfigured()) {
      // localStorage 模式
      const index = announcements.value.findIndex(a => a.id === id)
      if (index !== -1) {
        announcements.value.splice(index, 1)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements.value))
        return { success: true }
      }
      return { success: false, error: '找不到公告' }
    }

    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      announcements.value = announcements.value.filter(a => a.id !== id)
      return { success: true }
    } catch (e) {
      console.error('刪除公告失敗:', e)
      error.value = e instanceof Error ? e.message : '刪除公告失敗'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 重置為預設
  const resetToDefault = async () => {
    if (!isSupabaseConfigured()) {
      announcements.value = defaultAnnouncements.map(convertLegacyAnnouncement)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements.value))
      return { success: true }
    }

    loading.value = true
    error.value = null

    try {
      // 刪除所有現有公告
      await supabase.from('announcements').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      
      // 插入預設公告
      const defaultData = defaultAnnouncements.map(a => ({
        title: a.title,
        content: a.content,
        type: a.type,
        tags: a.tags || [],
        date: a.date
      }))

      const { data, error: insertError } = await supabase
        .from('announcements')
        .insert(defaultData)
        .select()

      if (insertError) throw insertError

      announcements.value = data || []
      return { success: true }
    } catch (e) {
      console.error('重置公告失敗:', e)
      error.value = e instanceof Error ? e.message : '重置公告失敗'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 導出為 JSON
  const exportAsJson = () => {
    return JSON.stringify(announcements.value, null, 2)
  }

  // 導入 JSON
  const importFromJson = async (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as Announcement[]
      
      if (!Array.isArray(imported)) {
        return { success: false, error: '無效的 JSON 格式' }
      }

      if (!isSupabaseConfigured()) {
        announcements.value = imported
        localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements.value))
        return { success: true }
      }

      loading.value = true
      error.value = null

      // 刪除所有現有公告
      await supabase.from('announcements').delete().neq('id', '00000000-0000-0000-0000-000000000000')

      // 插入導入的公告
      const { data, error: insertError } = await supabase
        .from('announcements')
        .insert(imported.map(a => ({
          title: a.title,
          content: a.content,
          type: a.type,
          tags: a.tags || [],
          date: a.date
        })))
        .select()

      if (insertError) throw insertError

      announcements.value = data || []
      return { success: true }
    } catch (e) {
      console.error('導入公告失敗:', e)
      error.value = e instanceof Error ? e.message : '導入公告失敗'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 統計資訊
  const stats = computed(() => ({
    total: announcements.value.length,
    important: announcements.value.filter(a => a.type === 'important').length,
    new: announcements.value.filter(a => a.type === 'new').length,
    info: announcements.value.filter(a => a.type === 'info').length
  }))

  // 初始化時載入數據
  onMounted(() => {
    fetchAnnouncements()
  })

  return {
    announcements,
    loading,
    error,
    fetchAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    resetToDefault,
    exportAsJson,
    importFromJson,
    stats
  }
}
