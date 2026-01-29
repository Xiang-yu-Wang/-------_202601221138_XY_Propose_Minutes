import { ref, computed } from 'vue'
import type { Product } from '@/data/products'
import { products as defaultProducts } from '@/data/products'

const STORAGE_KEY = 'products_data'

// 初始化：從 localStorage 讀取或使用預設數據
const getInitialProducts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as Product[]
    }
  } catch (e) {
    console.error('讀取產品數據失敗:', e)
  }
  return [...defaultProducts]
}

export const products = ref<Product[]>(getInitialProducts())

// 保存到 localStorage
const saveToLocalStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products.value))
  } catch (e) {
    console.error('保存產品數據失敗:', e)
    alert('保存失敗！可能是數據過大或瀏覽器儲存空間不足。')
  }
}

export function useProductManager() {
  // 新增產品
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.value.map(p => p.id), 0) + 1
    const newProduct: Product = {
      id: newId,
      name: product.name,
      category: product.category,
      price: product.price,
      image_url: product.image_url,
      description: product.description,
      available: product.available
    }
    products.value.unshift(newProduct)
    saveToLocalStorage()
    return newProduct
  }

  // 編輯產品
  const updateProduct = (id: number, updated: Partial<Omit<Product, 'id'>>) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      const current = products.value[index]!
      products.value[index] = {
        id: current.id,
        name: updated.name || current.name,
        category: updated.category || current.category,
        price: updated.price !== undefined ? updated.price : current.price,
        image_url: updated.image_url || current.image_url,
        description: updated.description || current.description,
        available: updated.available !== undefined ? updated.available : current.available
      }
      saveToLocalStorage()
      return products.value[index]
    }
    return null
  }

  // 刪除產品
  const deleteProduct = (id: number) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value.splice(index, 1)
      saveToLocalStorage()
      return true
    }
    return false
  }

  // 切換上架狀態
  const toggleAvailability = (id: number) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index]!.available = !products.value[index]!.available
      saveToLocalStorage()
      return products.value[index]
    }
    return null
  }

  // 重置為預設
  const resetToDefault = () => {
    products.value = [...defaultProducts]
    saveToLocalStorage()
  }

  // 導出為 JSON
  const exportAsJson = () => {
    return JSON.stringify(products.value, null, 2)
  }

  // 導入 JSON
  const importFromJson = (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as Product[]
      // 驗證數據結構
      if (Array.isArray(imported) && imported.every(p => 
        p.id && p.name && p.category && typeof p.price === 'number' && p.image_url && p.description && typeof p.available === 'boolean'
      )) {
        products.value = imported
        saveToLocalStorage()
        return true
      }
      return false
    } catch (e) {
      console.error('導入 JSON 失敗:', e)
      return false
    }
  }

  // 圖片轉 Base64
  const imageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > 500 * 1024) { // 限制 500KB
        reject(new Error('圖片大小不可超過 500KB，請壓縮後再上傳'))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        resolve(result)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // 統計資訊
  const stats = computed(() => ({
    total: products.value.length,
    available: products.value.filter(p => p.available).length,
    unavailable: products.value.filter(p => !p.available).length,
    categories: [...new Set(products.value.map(p => p.category))].length,
    totalValue: products.value.reduce((sum, p) => sum + p.price, 0)
  }))

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleAvailability,
    resetToDefault,
    exportAsJson,
    importFromJson,
    imageToBase64,
    stats
  }
}
