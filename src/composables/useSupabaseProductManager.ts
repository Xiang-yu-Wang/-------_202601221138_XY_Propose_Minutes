import { ref, computed, onMounted } from 'vue'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Product, ProductInsert, ProductUpdate } from '@/lib/database.types'
import { products as defaultProducts } from '@/data/products'

// 轉換舊格式到新格式
const convertLegacyProduct = (legacy: any): Product => ({
  id: String(legacy.id),
  name: legacy.name,
  category: legacy.category,
  price: legacy.price,
  image_url: legacy.image_url || legacy.image || null,
  description: legacy.description || null,
  available: legacy.available ?? true,
  sort_order: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
})

// 全局狀態
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// localStorage 備援 key
const STORAGE_KEY = 'products_data_v2'

export function useSupabaseProductManager() {
  // 從 Supabase 載入產品
  const fetchProducts = async () => {
    if (!isSupabaseConfigured()) {
      // 如果 Supabase 未配置，使用 localStorage
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        products.value = JSON.parse(stored)
      } else {
        // 轉換預設數據
        products.value = defaultProducts.map(convertLegacyProduct)
      }
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      products.value = data || []
    } catch (e) {
      console.error('載入產品失敗:', e)
      error.value = e instanceof Error ? e.message : '載入產品失敗'
      // 備援：使用 localStorage
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        products.value = JSON.parse(stored)
      }
    } finally {
      loading.value = false
    }
  }

  // 上傳圖片到 Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!isSupabaseConfigured()) {
      // 轉換為 base64（localStorage 模式）
      console.log('📦 使用 localStorage 模式，圖片轉換為 base64')
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => resolve(null)
        reader.readAsDataURL(file)
      })
    }

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      // 使用根目錄，避免重複的 products/products 路徑
      const filePath = fileName

      console.log('📤 上傳圖片到 Supabase Storage:', filePath)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('❌ Supabase Storage 上傳錯誤:', uploadError)
        throw uploadError
      }

      console.log('✅ 上傳成功:', uploadData)

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      console.log('🔗 公開 URL:', publicUrl)
      return publicUrl
    } catch (e) {
      console.error('❌ 上傳圖片失敗:', e)
      // 回退到 base64 模式
      console.log('⚠️ 回退到 base64 模式')
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => resolve(null)
        reader.readAsDataURL(file)
      })
    }
  }

  // 新增產品
  const addProduct = async (product: Omit<ProductInsert, 'id'>) => {
    if (!isSupabaseConfigured()) {
      // localStorage 模式
      const newProduct: Product = {
        id: crypto.randomUUID(),
        name: product.name,
        category: product.category,
        price: product.price || 0,
        image_url: product.image_url || null,
        description: product.description || null,
        available: product.available ?? true,
        sort_order: product.sort_order || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      products.value.unshift(newProduct)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products.value))
      return { success: true, data: newProduct }
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: insertError } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()

      if (insertError) throw insertError

      products.value.unshift(data)
      return { success: true, data }
    } catch (e) {
      console.error('新增產品失敗:', e)
      error.value = e instanceof Error ? e.message : '新增產品失敗'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 更新產品
  const updateProduct = async (id: string, updates: ProductUpdate) => {
    if (!isSupabaseConfigured()) {
      // localStorage 模式
      const index = products.value.findIndex(p => p.id === id)
      const existing = products.value[index]
      if (!existing) {
        return { success: false, error: '找不到產品' }
      }
      products.value[index] = {
        id: existing.id,
        name: updates.name ?? existing.name,
        category: updates.category ?? existing.category,
        price: updates.price ?? existing.price,
        image_url: updates.image_url !== undefined ? updates.image_url : existing.image_url,
        description: updates.description !== undefined ? updates.description : existing.description,
        available: updates.available ?? existing.available,
        sort_order: updates.sort_order ?? existing.sort_order,
        created_at: existing.created_at,
        updated_at: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products.value))
      return { success: true, data: products.value[index] }
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = data
      }
      return { success: true, data }
    } catch (e) {
      console.error('更新產品失敗:', e)
      error.value = e instanceof Error ? e.message : '更新產品失敗'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 切換產品可用性
  const toggleAvailability = async (id: string) => {
    const product = products.value.find(p => p.id === id)
    if (product) {
      return updateProduct(id, { available: !product.available })
    }
    return { success: false, error: '找不到產品' }
  }

  // 刪除產品
  const deleteProduct = async (id: string) => {
    if (!isSupabaseConfigured()) {
      // localStorage 模式
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value.splice(index, 1)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products.value))
        return { success: true }
      }
      return { success: false, error: '找不到產品' }
    }

    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      products.value = products.value.filter(p => p.id !== id)
      return { success: true }
    } catch (e) {
      console.error('刪除產品失敗:', e)
      error.value = e instanceof Error ? e.message : '刪除產品失敗'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 重置為預設
  const resetToDefault = async () => {
    if (!isSupabaseConfigured()) {
      products.value = defaultProducts.map(convertLegacyProduct)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products.value))
      return { success: true }
    }

    loading.value = true
    error.value = null

    try {
      // 刪除所有現有產品
      await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      
      // 插入預設產品
      const defaultData = defaultProducts.map(p => ({
        name: p.name,
        category: p.category,
        price: p.price,
        image_url: p.image_url || null,
        description: p.description || null,
        available: p.available ?? true
      }))

      const { data, error: insertError } = await supabase
        .from('products')
        .insert(defaultData)
        .select()

      if (insertError) throw insertError

      products.value = data || []
      return { success: true }
    } catch (e) {
      console.error('重置產品失敗:', e)
      error.value = e instanceof Error ? e.message : '重置產品失敗'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 導出為 JSON
  const exportAsJson = () => {
    return JSON.stringify(products.value, null, 2)
  }

  // 導入 JSON
  const importFromJson = async (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as Product[]
      
      if (!Array.isArray(imported)) {
        return { success: false, error: '無效的 JSON 格式' }
      }

      if (!isSupabaseConfigured()) {
        products.value = imported
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products.value))
        return { success: true }
      }

      loading.value = true
      error.value = null

      // 刪除所有現有產品
      await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')

      // 插入導入的產品
      const { data, error: insertError } = await supabase
        .from('products')
        .insert(imported.map(p => ({
          name: p.name,
          category: p.category,
          price: p.price,
          image_url: p.image_url || null,
          description: p.description || null,
          available: p.available ?? true,
          sort_order: p.sort_order || 0
        })))
        .select()

      if (insertError) throw insertError

      products.value = data || []
      return { success: true }
    } catch (e) {
      console.error('導入產品失敗:', e)
      error.value = e instanceof Error ? e.message : '導入產品失敗'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 統計資訊
  const stats = computed(() => {
    const categories = [...new Set(products.value.map(p => p.category))]
    return {
      total: products.value.length,
      available: products.value.filter(p => p.available).length,
      unavailable: products.value.filter(p => !p.available).length,
      categories: categories.length
    }
  })

  // 初始化時載入數據
  onMounted(() => {
    fetchProducts()
  })

  return {
    products,
    loading,
    error,
    fetchProducts,
    uploadImage,
    addProduct,
    updateProduct,
    toggleAvailability,
    deleteProduct,
    resetToDefault,
    exportAsJson,
    importFromJson,
    stats
  }
}
