import { ref, onMounted, onUnmounted } from 'vue'
import { useScroll } from '@vueuse/core'

/**
 * 返回頂部 composable
 * 管理頁面滾動狀態和返回頂部功能
 */
export function useScrollToTop(threshold = 300) {
  const isVisible = ref(false)

  const { y } = useScroll(window)

  // 監聽滾動位置
  const handleScroll = () => {
    isVisible.value = y.value > threshold
  }

  // 平滑滾動回頂部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    isVisible,
    scrollToTop
  }
}
