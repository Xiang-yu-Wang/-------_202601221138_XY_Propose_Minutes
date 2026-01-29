import { ref, computed } from 'vue'
import type { DeliveryPhoto } from '@/data/deliveryPhotos'
import { deliveryPhotos as defaultDeliveryPhotos } from '@/data/deliveryPhotos'

const STORAGE_KEY = 'delivery_photos_data'

// 初始化：從 localStorage 讀取或使用預設數據
const getInitialDeliveryPhotos = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as DeliveryPhoto[]
    }
  } catch (e) {
    console.error('讀取交貨照數據失敗:', e)
  }
  return [...defaultDeliveryPhotos]
}

export const deliveryPhotos = ref<DeliveryPhoto[]>(getInitialDeliveryPhotos())

// 保存到 localStorage
const saveToLocalStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deliveryPhotos.value))
  } catch (e) {
    console.error('保存交貨照數據失敗:', e)
  }
}

export function useDeliveryPhotoManager() {
  // 新增交貨照
  const addDeliveryPhoto = (photo: Omit<DeliveryPhoto, 'id'>) => {
    const newId = (Math.max(...deliveryPhotos.value.map(p => parseInt(p.id)), 0) + 1).toString()
    const newPhoto: DeliveryPhoto = {
      id: newId,
      ...photo
    }
    deliveryPhotos.value.unshift(newPhoto)
    saveToLocalStorage()
    return newPhoto
  }

  // 編輯交貨照
  const updateDeliveryPhoto = (id: string, updated: Partial<Omit<DeliveryPhoto, 'id'>>) => {
    const index = deliveryPhotos.value.findIndex(p => p.id === id)
    if (index !== -1) {
      const current = deliveryPhotos.value[index]!
      deliveryPhotos.value[index] = {
        id: current.id,
        url: updated.url || current.url,
        title: updated.title || current.title,
        description: updated.description || current.description,
        date: updated.date || current.date,
        location: updated.location || current.location
      }
      saveToLocalStorage()
      return deliveryPhotos.value[index]
    }
    return null
  }

  // 刪除交貨照
  const deleteDeliveryPhoto = (id: string) => {
    const index = deliveryPhotos.value.findIndex(p => p.id === id)
    if (index !== -1) {
      deliveryPhotos.value.splice(index, 1)
      saveToLocalStorage()
      return true
    }
    return false
  }

  // 重置為預設
  const resetToDefault = () => {
    deliveryPhotos.value = [...defaultDeliveryPhotos]
    saveToLocalStorage()
  }

  // 導出為 JSON
  const exportAsJson = () => {
    return JSON.stringify(deliveryPhotos.value, null, 2)
  }

  // 導入 JSON
  const importFromJson = (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as DeliveryPhoto[]
      // 驗證數據結構
      if (Array.isArray(imported) && imported.every(p => p.id && p.url && p.title && p.date && p.location)) {
        deliveryPhotos.value = imported
        saveToLocalStorage()
        return true
      }
      return false
    } catch (e) {
      console.error('導入數據失敗:', e)
      return false
    }
  }

  // 統計信息
  const stats = computed(() => ({
    total: deliveryPhotos.value.length,
    byLocation: deliveryPhotos.value.reduce((acc, photo) => {
      acc[photo.location] = (acc[photo.location] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }))

  return {
    deliveryPhotos,
    addDeliveryPhoto,
    updateDeliveryPhoto,
    deleteDeliveryPhoto,
    resetToDefault,
    exportAsJson,
    importFromJson,
    stats
  }
}
