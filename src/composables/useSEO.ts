import { computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useRoute } from 'vue-router'
import { getSEOConfig } from '@/data/seo'

/**
 * SEO composable
 * 自動管理每個頁面的 meta 標籤
 */
export function useSEO() {
  const route = useRoute()
  
  // 基礎 URL（開發環境使用 localhost，生產環境替換）
  const baseURL = import.meta.env.PROD ? 'https://example.com' : 'http://localhost:5173'
  
  // 獲取當前頁面的 SEO 配置
  const seoConfig = computed(() => getSEOConfig(route.path))
  
  // 設置 head 標籤
  useHead({
    title: () => seoConfig.value.title,
    meta: () => [
      {
        name: 'description',
        content: seoConfig.value.description
      },
      {
        name: 'keywords',
        content: seoConfig.value.keywords || '股東紀念品,代領,股票,禮品'
      },
      // Open Graph 標籤（社群分享）
      {
        property: 'og:title',
        content: seoConfig.value.ogTitle || seoConfig.value.title
      },
      {
        property: 'og:description',
        content: seoConfig.value.ogDescription || seoConfig.value.description
      },
      {
        property: 'og:image',
        content: seoConfig.value.ogImage || 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&h=630&q=80'
      },
      {
        property: 'og:type',
        content: 'website'
      },
      {
        property: 'og:url',
        content: `${baseURL}${route.path}`
      },
      // Twitter Card
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:title',
        content: seoConfig.value.title
      },
      {
        name: 'twitter:description',
        content: seoConfig.value.description
      },
      // 其他重要 meta
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        httpEquiv: 'x-ua-compatible',
        content: 'ie=edge'
      },
      {
        name: 'theme-color',
        content: '#059669'
      }
    ],
    link: () => [
      {
        rel: 'canonical',
        href: `${baseURL}${route.path}`
      }
    ]
  })
  
  return { seoConfig }
}
