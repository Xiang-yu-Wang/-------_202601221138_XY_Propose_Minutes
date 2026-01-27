import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import { products } from '@/data/products'

// 使用 useStorage 持久化購物車數據到 localStorage
const cartStorage = useStorage('cart', {} as Record<string, number>, localStorage)

/**
 * 購物車 composable
 * 提供購物車的基本操作和持久化存儲
 */
export function useCart() {
  const addToCart = (productId: number) => {
    const key = productId.toString()
    cartStorage.value[key] = (cartStorage.value[key] || 0) + 1
  }

  const removeFromCart = (productId: number) => {
    const key = productId.toString()
    const current = cartStorage.value[key] || 0
    if (current > 1) {
      cartStorage.value[key] = current - 1
    } else {
      delete cartStorage.value[key]
    }
  }

  const getCartCount = (productId: number) => {
    return cartStorage.value[productId.toString()] || 0
  }

  const getTotalPrice = () => {
    let total = 0
    Object.entries(cartStorage.value).forEach(([productIdStr, count]) => {
      const productId = parseInt(productIdStr)
      const product = products.find(p => p.id === productId)
      if (product) {
        total += product.price * count
      }
    })
    return total
  }

  const getCartItems = () => {
    return Object.entries(cartStorage.value).map(([productIdStr, count]) => {
      const productId = parseInt(productIdStr)
      const product = products.find(p => p.id === productId)
      return {
        productId,
        count,
        product,
        subtotal: product ? product.price * count : 0
      }
    })
  }

  const clearCart = () => {
    cartStorage.value = {}
  }

  // 購物車商品數量
  const cartSize = computed(() => {
    return Object.keys(cartStorage.value).length
  })

  // 購物車總項數（商品數量之和）
  const cartTotal = computed(() => {
    return Object.values(cartStorage.value).reduce((sum, count) => sum + count, 0)
  })

  return {
    cart: cartStorage,
    addToCart,
    removeFromCart,
    getCartCount,
    getTotalPrice,
    getCartItems,
    clearCart,
    cartSize,
    cartTotal
  }
}
