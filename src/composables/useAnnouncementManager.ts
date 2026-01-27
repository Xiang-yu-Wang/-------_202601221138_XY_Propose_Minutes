import { ref, computed } from 'vue'
import type { Announcement } from '@/data/announcements'
import { announcements as defaultAnnouncements } from '@/data/announcements'

const STORAGE_KEY = 'announcements_data'

// 初始化：從 localStorage 讀取或使用預設數據
const getInitialAnnouncements = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as Announcement[]
    }
  } catch (e) {
    console.error('讀取公告數據失敗:', e)
  }
  return [...defaultAnnouncements]
}

export const announcements = ref<Announcement[]>(getInitialAnnouncements())

// 保存到 localStorage
const saveToLocalStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements.value))
  } catch (e) {
    console.error('保存公告數據失敗:', e)
  }
}

export function useAnnouncementManager() {
  // 新增公告
  const addAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newId = Math.max(...announcements.value.map(a => a.id), 0) + 1
    const newAnnouncement: Announcement = {
      id: newId,
      title: announcement.title,
      date: announcement.date,
      type: announcement.type,
      tags: announcement.tags,
      content: announcement.content
    }
    announcements.value.unshift(newAnnouncement)
    saveToLocalStorage()
    return newAnnouncement
  }

  // 編輯公告
  const updateAnnouncement = (id: number, updated: Partial<Omit<Announcement, 'id'>>) => {
    const index = announcements.value.findIndex(a => a.id === id)
    if (index !== -1) {
      const current = announcements.value[index]!
      announcements.value[index] = {
        id: current.id,
        title: updated.title || current.title,
        date: updated.date || current.date,
        type: updated.type || current.type,
        tags: updated.tags !== undefined ? updated.tags : current.tags,
        content: updated.content || current.content
      }
      saveToLocalStorage()
      return announcements.value[index]
    }
    return null
  }

  // 刪除公告
  const deleteAnnouncement = (id: number) => {
    const index = announcements.value.findIndex(a => a.id === id)
    if (index !== -1) {
      announcements.value.splice(index, 1)
      saveToLocalStorage()
      return true
    }
    return false
  }

  // 重置為預設
  const resetToDefault = () => {
    announcements.value = [...defaultAnnouncements]
    saveToLocalStorage()
  }

  // 導出為 JSON
  const exportAsJson = () => {
    return JSON.stringify(announcements.value, null, 2)
  }

  // 導入 JSON
  const importFromJson = (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as Announcement[]
      // 驗證數據結構
      if (Array.isArray(imported) && imported.every(a => a.id && a.title && a.date && a.type && a.content)) {
        announcements.value = imported
        saveToLocalStorage()
        return true
      }
      return false
    } catch (e) {
      console.error('導入 JSON 失敗:', e)
      return false
    }
  }

  // 統計資訊
  const stats = computed(() => ({
    total: announcements.value.length,
    important: announcements.value.filter(a => a.type === 'important').length,
    new: announcements.value.filter(a => a.type === 'new').length,
    info: announcements.value.filter(a => a.type === 'info').length
  }))

  return {
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    resetToDefault,
    exportAsJson,
    importFromJson,
    stats
  }
}
