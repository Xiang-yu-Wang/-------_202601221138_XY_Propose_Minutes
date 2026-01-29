import { ref, computed, onMounted } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { deliveryPhotos as defaultDeliveryPhotos, type DeliveryPhoto } from '@/data/deliveryPhotos'

// Supabase 表結構類型
interface DeliveryPhotoRow {
  id: string
  url: string
  title: string
  description: string | null
  date: string
  location: string
  sort_order: number
  created_at: string
  updated_at: string
}

// 轉換 Supabase row 到前端格式
const convertToDeliveryPhoto = (row: DeliveryPhotoRow): DeliveryPhoto => ({
  id: row.id,
  url: row.url,
  title: row.title,
  description: row.description || '',
  date: row.date,
  location: row.location
})

// 全局狀態
const deliveryPhotos = ref<DeliveryPhoto[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// localStorage 備援 key
const STORAGE_KEY = 'delivery_photos_data'

// 追蹤訂閱狀態，避免重複訂閱
let isSubscribed = false

export function useSupabaseDeliveryPhotoManager() {
  // 從 Supabase 載入交貨照
  const fetchDeliveryPhotos = async () => {
    if (!isSupabaseConfigured()) {
      // 如果 Supabase 未配置，使用 localStorage
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        deliveryPhotos.value = JSON.parse(stored)
        // 按日期降序排序（最新的在前）
        deliveryPhotos.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        console.log('📖 從 localStorage 載入交貨照:', deliveryPhotos.value.length, '筆')
      } else {
        // 使用預設數據
        deliveryPhotos.value = [...defaultDeliveryPhotos]
        // 按日期降序排序（最新的在前）
        deliveryPhotos.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        console.log('📖 使用預設交貨照:', deliveryPhotos.value.length, '筆')
      }
      return
    }

    loading.value = true
    error.value = null

    try {
      console.log('📡 正在從 Supabase 載入交貨照...')
      const { data, error: fetchError } = await supabase
        .from('delivery_photos')
        .select('*')
        .order('date', { ascending: false })

      if (fetchError) {
        console.error('❌ Supabase fetch 錯誤:', fetchError)
        throw fetchError
      }

      deliveryPhotos.value = (data || []).map(convertToDeliveryPhoto)
      console.log('✅ 已載入交貨照:', deliveryPhotos.value.length, '筆')
    } catch (e) {
      console.error('❌ 載入交貨照失敗:', e)
      error.value = e instanceof Error ? e.message : '載入交貨照失敗'
      // 備援：使用 localStorage
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        deliveryPhotos.value = JSON.parse(stored)
        deliveryPhotos.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        console.log('📖 備援：從 localStorage 載入交貨照')
      } else {
        deliveryPhotos.value = [...defaultDeliveryPhotos]
        console.log('📖 備援：使用預設交貨照')
      }
    } finally {
      loading.value = false
    }
  }

  // 保存到 localStorage（備援）
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deliveryPhotos.value))
    } catch (e) {
      console.error('保存交貨照數據失敗:', e)
    }
  }

  // 新增交貨照
  const addDeliveryPhoto = async (photo: Omit<DeliveryPhoto, 'id'>) => {
    if (!isSupabaseConfigured()) {
      // localStorage 模式
      const newId = (Math.max(...deliveryPhotos.value.map(p => parseInt(p.id) || 0), 0) + 1).toString()
      const newPhoto: DeliveryPhoto = { id: newId, ...photo }
      deliveryPhotos.value.unshift(newPhoto)
      saveToLocalStorage()
      return newPhoto
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: insertError } = await supabase
        .from('delivery_photos')
        .insert({
          url: photo.url,
          title: photo.title,
          description: photo.description || null,
          date: photo.date,
          location: photo.location
        })
        .select()
        .single()

      if (insertError) throw insertError

      const newPhoto = convertToDeliveryPhoto(data)
      deliveryPhotos.value.unshift(newPhoto)
      console.log('✅ 已新增交貨照:', newPhoto.title)
      return newPhoto
    } catch (e) {
      console.error('❌ 新增交貨照失敗:', e)
      error.value = e instanceof Error ? e.message : '新增交貨照失敗'
      throw e
    } finally {
      loading.value = false
    }
  }

  // 更新交貨照
  const updateDeliveryPhoto = async (id: string, updates: Partial<Omit<DeliveryPhoto, 'id'>>) => {
    if (!isSupabaseConfigured()) {
      // localStorage 模式
      const index = deliveryPhotos.value.findIndex(p => p.id === id)
      const current = deliveryPhotos.value[index]
      if (index !== -1 && current) {
        deliveryPhotos.value[index] = {
          id: current.id,
          url: updates.url ?? current.url,
          title: updates.title ?? current.title,
          description: updates.description ?? current.description,
          date: updates.date ?? current.date,
          location: updates.location ?? current.location
        }
        saveToLocalStorage()
        return deliveryPhotos.value[index]
      }
      return null
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('delivery_photos')
        .update({
          url: updates.url,
          title: updates.title,
          description: updates.description || null,
          date: updates.date,
          location: updates.location
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      const updatedPhoto = convertToDeliveryPhoto(data)
      const index = deliveryPhotos.value.findIndex(p => p.id === id)
      if (index !== -1) {
        deliveryPhotos.value[index] = updatedPhoto
      }
      console.log('✅ 已更新交貨照:', updatedPhoto.title)
      return updatedPhoto
    } catch (e) {
      console.error('❌ 更新交貨照失敗:', e)
      error.value = e instanceof Error ? e.message : '更新交貨照失敗'
      throw e
    } finally {
      loading.value = false
    }
  }

  // 刪除交貨照
  const deleteDeliveryPhoto = async (id: string) => {
    if (!isSupabaseConfigured()) {
      // localStorage 模式
      const index = deliveryPhotos.value.findIndex(p => p.id === id)
      if (index !== -1) {
        deliveryPhotos.value.splice(index, 1)
        saveToLocalStorage()
        return true
      }
      return false
    }

    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('delivery_photos')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      deliveryPhotos.value = deliveryPhotos.value.filter(p => p.id !== id)
      console.log('✅ 已刪除交貨照:', id)
      return true
    } catch (e) {
      console.error('❌ 刪除交貨照失敗:', e)
      error.value = e instanceof Error ? e.message : '刪除交貨照失敗'
      throw e
    } finally {
      loading.value = false
    }
  }

  // 重置為預設
  const resetToDefault = async () => {
    if (!isSupabaseConfigured()) {
      deliveryPhotos.value = [...defaultDeliveryPhotos]
      saveToLocalStorage()
      return
    }

    // Supabase 模式：刪除所有再插入預設
    loading.value = true
    try {
      // 刪除所有
      await supabase.from('delivery_photos').delete().neq('id', '')

      // 插入預設數據
      for (const photo of defaultDeliveryPhotos) {
        await supabase.from('delivery_photos').insert({
          url: photo.url,
          title: photo.title,
          description: photo.description,
          date: photo.date,
          location: photo.location
        })
      }

      await fetchDeliveryPhotos()
      console.log('✅ 已重置為預設交貨照')
    } catch (e) {
      console.error('❌ 重置失敗:', e)
      error.value = e instanceof Error ? e.message : '重置失敗'
    } finally {
      loading.value = false
    }
  }

  // 導出為 JSON
  const exportAsJson = () => {
    return JSON.stringify(deliveryPhotos.value, null, 2)
  }

  // 導入 JSON
  const importFromJson = async (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as DeliveryPhoto[]
      if (!Array.isArray(imported) || !imported.every(p => p.id && p.url && p.title && p.date && p.location)) {
        return false
      }

      if (!isSupabaseConfigured()) {
        deliveryPhotos.value = imported
        saveToLocalStorage()
        return true
      }

      // Supabase 模式：刪除所有再插入
      loading.value = true
      try {
        await supabase.from('delivery_photos').delete().neq('id', '')

        for (const photo of imported) {
          await supabase.from('delivery_photos').insert({
            url: photo.url,
            title: photo.title,
            description: photo.description,
            date: photo.date,
            location: photo.location
          })
        }

        await fetchDeliveryPhotos()
        return true
      } finally {
        loading.value = false
      }
    } catch (e) {
      console.error('導入數據失敗:', e)
      return false
    }
  }

  // 設置即時訂閱
  const setupRealtimeSubscription = () => {
    if (!isSupabaseConfigured() || isSubscribed) return

    const channel = supabase
      .channel('delivery_photos_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'delivery_photos' },
        (payload) => {
          console.log('📡 收到交貨照即時更新:', payload.eventType)

          if (payload.eventType === 'INSERT') {
            const newPhoto = convertToDeliveryPhoto(payload.new as DeliveryPhotoRow)
            // 插入到正確位置（按日期排序）
            const insertIndex = deliveryPhotos.value.findIndex(
              p => new Date(p.date) < new Date(newPhoto.date)
            )
            if (insertIndex === -1) {
              deliveryPhotos.value.push(newPhoto)
            } else {
              deliveryPhotos.value.splice(insertIndex, 0, newPhoto)
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedPhoto = convertToDeliveryPhoto(payload.new as DeliveryPhotoRow)
            const index = deliveryPhotos.value.findIndex(p => p.id === updatedPhoto.id)
            if (index !== -1) {
              deliveryPhotos.value[index] = updatedPhoto
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as DeliveryPhotoRow).id
            deliveryPhotos.value = deliveryPhotos.value.filter(p => p.id !== deletedId)
          }
        }
      )
      .subscribe()

    isSubscribed = true
    console.log('📡 已訂閱交貨照即時更新')

    return () => {
      supabase.removeChannel(channel)
      isSubscribed = false
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

  // 初始化
  onMounted(() => {
    fetchDeliveryPhotos()
    setupRealtimeSubscription()
  })

  return {
    deliveryPhotos,
    loading,
    error,
    stats,
    fetchDeliveryPhotos,
    addDeliveryPhoto,
    updateDeliveryPhoto,
    deleteDeliveryPhoto,
    resetToDefault,
    exportAsJson,
    importFromJson
  }
}
