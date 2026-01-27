/**
 * 響應式圖片 Composable
 * 根據屏幕寬度和設備密度優化圖片加載
 * 支援 AVIF/WebP/JPEG 多格式優化
 */

import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

interface ImageConfig {
  baseUrl: string
  widths: number[]
  alt: string
  sizes?: string
  formats?: 'auto' | 'jpg' | 'webp' | 'avif'
}

interface PictureSourceConfig {
  srcSet: string
  type: string
  media?: string
}

/**
 * 生成 Unsplash 圖片的優化 URL
 * @param imageUrl - 原始圖片 URL
 * @param width - 目標寬度
 * @param quality - 品質 (1-100)
 * @param format - 圖片格式 (auto/jpg/webp/avif)
 */
export function optimizeUnsplashUrl(
  imageUrl: string,
  width: number,
  quality = 80,
  format: string = 'auto'
): string {
  const separator = imageUrl.includes('?') ? '&' : '?'
  const formatParam = format === 'auto' ? 'f_auto' : `f_${format}`
  return `${imageUrl}${separator}${formatParam}&fit=crop&w=${width}&q=${quality}`
}

/**
 * 生成支援多格式的 srcset
 * @param baseUrl - 基礎 URL
 * @param widths - 寬度陣列 [320, 640, 1024, 1920]
 * @param format - 圖片格式
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[],
  format: string = 'auto'
): string {
  return widths
    .map(width => `${optimizeUnsplashUrl(baseUrl, width, 80, format)} ${width}w`)
    .join(', ')
}

/**
 * 為 <picture> 元素生成多格式來源
 * 優先順序：AVIF > WebP > JPEG
 */
export function generatePictureSources(
  baseUrl: string,
  widths: number[]
): PictureSourceConfig[] {
  return [
    {
      srcSet: generateSrcSet(baseUrl, widths, 'avif'),
      type: 'image/avif',
    },
    {
      srcSet: generateSrcSet(baseUrl, widths, 'webp'),
      type: 'image/webp',
    },
  ]
}

/**
 * 根據視口寬度計算最佳圖片寬度
 */
export function useResponsiveImage(config: ImageConfig) {
  const { width: windowWidth } = useWindowSize()
  const format = config.formats || 'auto'

  // 計算最佳寬度（選擇最接近的寬度，避免過度加載）
  const optimalWidth = computed(() => {
    const width = windowWidth.value
    // 設備像素密度（假設 1x 到 3x）
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1
    const targetWidth = Math.ceil(width * dpr)

    // 選擇最接近的可用寬度
    return config.widths.reduce((prev, curr) => {
      return Math.abs(curr - targetWidth) < Math.abs(prev - targetWidth)
        ? curr
        : prev
    })
  })

  // 生成優化的 URL
  const optimizedUrl = computed(() =>
    optimizeUnsplashUrl(config.baseUrl, optimalWidth.value, 80, format)
  )

  // 生成 srcset（用於響應式圖片）
  const srcSet = computed(() => generateSrcSet(config.baseUrl, config.widths, format))

  // 為 <picture> 元素生成多格式來源
  const pictureSources = computed(() => 
    generatePictureSources(config.baseUrl, config.widths)
  )

  return {
    src: optimizedUrl,
    srcSet,
    sizes: config.sizes || '100vw',
    alt: config.alt,
    pictureSources,
  }
}

/**
 * 批量優化圖片列表
 */
export function optimizeImages(
  baseUrls: string[],
  widths: number[] = [320, 640, 1024, 1920]
): Array<{ src: string; srcSet: string }> {
  return baseUrls.map(url => ({
    src: optimizeUnsplashUrl(url, widths[widths.length - 1] || 1920),
    srcSet: generateSrcSet(url, widths),
  }))
}
