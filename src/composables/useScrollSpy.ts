import { ref, onMounted, onUnmounted } from 'vue'
import { useScroll, useThrottleFn } from '@vueuse/core'

/**
 * Custom composable using VueUse for scroll spy functionality
 * Tracks which section is currently visible in the viewport
 */
export function useScrollSpy(sectionIds: string[]) {
  const activeSection = ref<string>('')
  const { y } = useScroll(window)

  const updateActiveSection = useThrottleFn(() => {
    const scrollPosition = y.value + 100 // Offset for navbar

    for (const id of sectionIds) {
      const element = document.getElementById(id)
      if (element) {
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + window.scrollY
        const elementBottom = elementTop + rect.height

        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          activeSection.value = id
          break
        }
      }
    }
  }, 100)

  onMounted(() => {
    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateActiveSection)
  })

  return {
    activeSection,
    y,
  }
}
