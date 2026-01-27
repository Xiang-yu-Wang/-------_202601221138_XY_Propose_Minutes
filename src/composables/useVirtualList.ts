import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

/**
 * 虛擬列表 Composable
 * 支援水平和垂直滾動，優化大列表性能
 * 
 * 使用場景：
 * - 畫廊（grid佈局）：useVirtualList(items, 6) // 每頁6個
 * - 列表（垂直）：useVirtualList(items, 10) // 每頁10個
 */

interface VirtualListOptions {
  /** 每個項目的高度（必須） */
  itemHeight: number
  /** 容器高度（必須） */
  containerHeight: number
  /** 預留緩衝區大小（預設 3 頁） */
  bufferSize?: number
  /** 是否為grid佈局 */
  isGrid?: boolean
  /** grid每行項目數 */
  itemsPerRow?: number
}

export function useVirtualList<T>(
  items: T[],
  options: VirtualListOptions
) {
  const {
    itemHeight,
    containerHeight,
    bufferSize = 3,
    isGrid = false,
    itemsPerRow = 1
  } = options

  // 計算網格參數（如果使用grid）
  const rowHeight = itemHeight
  const itemsPerPage = isGrid ? itemsPerRow : Math.ceil(containerHeight / itemHeight)
  const totalPages = Math.ceil(items.length / itemsPerPage)

  // 狀態
  const containerRef = ref<HTMLElement | null>(null)
  const scrollTop = ref(0)

  // 計算可見範圍
  const startIndex = computed(() => {
    const visiblePage = Math.floor(scrollTop.value / containerHeight)
    const startPage = Math.max(0, visiblePage - bufferSize)
    return startPage * itemsPerPage
  })

  const endIndex = computed(() => {
    const visiblePage = Math.floor((scrollTop.value + containerHeight) / containerHeight)
    const endPage = Math.min(totalPages - 1, visiblePage + bufferSize)
    return Math.min((endPage + 1) * itemsPerPage, items.length)
  })

  const visibleItems = computed(() => {
    return items.slice(startIndex.value, endIndex.value)
  })

  // 偏移量（用於transform: translateY）
  const offsetY = computed(() => {
    return startIndex.value * itemHeight
  })

  // 容器高度（用於占位符）
  const totalHeight = computed(() => {
    if (isGrid) {
      const rows = Math.ceil(items.length / itemsPerRow)
      return rows * rowHeight
    }
    return items.length * itemHeight
  })

  // 滾動事件處理
  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement
    scrollTop.value = target.scrollTop
  }

  // 獲取項目的實際索引
  const getItemIndex = (visibleIndex: number): number => {
    return startIndex.value + visibleIndex
  }

  // 初始化
  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener('scroll', handleScroll, { passive: true })
    }
  })

  onBeforeUnmount(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('scroll', handleScroll)
    }
  })

  return {
    containerRef,
    visibleItems,
    offsetY,
    totalHeight,
    startIndex,
    endIndex,
    getItemIndex,
    itemsPerPage,
    totalPages
  }
}

/**
 * 輕量級虛擬Grid Composable（針對GallerySection優化）
 * 用於固定大小的網格項目（如圖片gallery）
 */
export function useVirtualGrid<T>(
  items: T[],
  itemWidth: number,
  itemHeight: number,
  containerWidth: number
) {
  const itemsPerRow = Math.max(1, Math.floor(containerWidth / itemWidth))
  const rowHeight = itemHeight

  // 容器和滾動狀態
  const containerRef = ref<HTMLElement | null>(null)
  const scrollTop = ref(0)

  // 計算可見行範圍
  const visibleRowStart = computed(() => {
    return Math.floor(scrollTop.value / rowHeight)
  })

  const visibleRowEnd = computed(() => {
    // 假設容器高度約3倍行高（可見3行）
    const visibleRows = 3
    return visibleRowStart.value + visibleRows + 1
  })

  // 計算項目索引範圍
  const startIndex = computed(() => {
    return Math.max(0, visibleRowStart.value * itemsPerRow - itemsPerRow)
  })

  const endIndex = computed(() => {
    return Math.min(items.length, visibleRowEnd.value * itemsPerRow + itemsPerRow)
  })

  const visibleItems = computed(() => {
    return items.slice(startIndex.value, endIndex.value)
  })

  // 計算偏移量
  const offsetY = computed(() => {
    return startIndex.value * rowHeight / itemsPerRow
  })

  const totalHeight = computed(() => {
    const rows = Math.ceil(items.length / itemsPerRow)
    return rows * rowHeight
  })

  // 滾動事件
  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement
    scrollTop.value = target.scrollTop
  }

  const getItemIndex = (visibleIndex: number): number => {
    return startIndex.value + visibleIndex
  }

  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener('scroll', handleScroll, { passive: true })
    }
  })

  onBeforeUnmount(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('scroll', handleScroll)
    }
  })

  return {
    containerRef,
    visibleItems,
    offsetY,
    totalHeight,
    startIndex,
    endIndex,
    getItemIndex,
    itemsPerRow,
    visibleRowStart,
    visibleRowEnd
  }
}

/**
 * 簡單的視口交集觀察器版本（更簡單的替代方案）
 * 自動檢測元素是否在視口中，無需複雜計算
 */
export function useIntersectionObserver(
  callback: (isVisible: boolean) => void,
  options?: IntersectionObserverInit
) {
  const elementRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!elementRef.value) return

    observer = new IntersectionObserver(([entry]) => {
      if (entry) {
        callback(entry.isIntersecting)
      }
    }, {
      threshold: 0.1,
      ...options
    })

    observer.observe(elementRef.value)
  })

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return { elementRef }
}
