/**
 * 資源預加載 Composable
 * 管理資源預加載和性能最佳化
 */

/**
 * 預加載圖片資源
 * @param imageSrc - 圖片 URL
 */
export function preloadImage(imageSrc: string) {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = imageSrc
  document.head.appendChild(link)
}

/**
 * 批量預加載多個圖片
 * @param imageSrcs - 圖片 URL 陣列
 */
export function preloadImages(imageSrcs: string[]) {
  imageSrcs.forEach(src => preloadImage(src))
}

/**
 * 動態預連接到外部域名
 * @param url - 外部域名 URL
 * @param crossorigin - 是否需要 crossorigin 屬性
 */
export function preconnectToOrigin(url: string, crossorigin = false) {
  const link = document.createElement('link')
  link.rel = 'preconnect'
  link.href = url
  if (crossorigin) {
    link.crossOrigin = 'anonymous'
  }
  document.head.appendChild(link)
}

/**
 * DNS 預解析
 * @param domain - 域名
 */
export function dnsPrefetch(domain: string) {
  const link = document.createElement('link')
  link.rel = 'dns-prefetch'
  link.href = domain
  document.head.appendChild(link)
}

/**
 * 報告 Core Web Vitals（用於監控性能）
 * 僅在開發環境啟用
 */
export function reportWebVitals() {
  if (typeof window === 'undefined' || import.meta.env.PROD) return

  // 監控 Cumulative Layout Shift (CLS)
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.info('CLS:', entry)
    }
  }).observe({ entryTypes: ['layout-shift'] })

  // 監控 First Input Delay (FID)
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.info('FID:', entry)
    }
  }).observe({ entryTypes: ['first-input'] })

  // 監控 Largest Contentful Paint (LCP)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries()
    const lastEntry = entries[entries.length - 1]
    console.info('LCP:', lastEntry)
  }).observe({ entryTypes: ['largest-contentful-paint'] })
}
