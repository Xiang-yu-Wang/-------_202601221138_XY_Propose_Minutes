import { computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useRoute } from 'vue-router'
import { faqItems } from '@/data/faq'

/**
 * JSON-LD 結構化資料 Composable
 * 提供 Google Rich Results 需要的結構化資料
 * 
 * 支援的 Schema 類型：
 * - Organization: 組織基本資訊
 * - LocalBusiness: 本地商家資訊（用於搜尋結果地圖）
 * - Service: 服務項目
 * - FAQPage: FAQ 常見問題
 * - BreadcrumbList: 麵包屑導航
 * - WebSite: 網站搜尋框
 */

// 基礎 URL 從環境變數讀取
const getBaseURL = () => import.meta.env.VITE_SEO_URL as string

// 組織/品牌基本資訊
const organizationInfo = {
  name: '大倉代領股東紀念品',
  alternateName: '大倉代領',
  description: '專業股東紀念品代領服務，只需一股即可領取，代購高機率發放股票，870檔精選公司，一鍵買齊，省時省力。',
  telephone: '0982-571-134',
  email: 'playegg903@gmail.com',
  logo: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=512&h=512&q=80',
  image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&h=630&q=80',
  priceRange: 'NT$10-NT$30',
  // 社群連結
  sameAs: [
    'https://line.me/ti/p/@792nvftc',
    'https://www.facebook.com/groups/2289633991367498',
  ],
  // 服務區域
  areaServed: {
    '@type': 'Country',
    name: '台灣',
  },
  // 聯絡方式
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+886-982-571-134',
    contactType: 'customer service',
    availableLanguage: ['zh-TW', 'zh-Hant'],
    areaServed: 'TW',
  },
}

// 服務項目資料
const services = [
  {
    name: '自動投票功能',
    description: '透過我們的系統，您可以輕鬆進行自動投票，不再需要繁瑣的手動操作。',
  },
  {
    name: '一鍵購買',
    description: '我們提供一鍵購買一股全餐功能，讓您能夠快速選擇一鍵掛單買進高機率發放870檔公司。',
  },
  {
    name: '全方位配送服務',
    description: '只要是全餐客戶，全台免費送貨到府，且不需任何費用。',
  },
  {
    name: '全餐方案一 - 物品分配',
    description: '每年以實際領到公司數量均分，客戶可自選當年度熱門物品，全台免費送貨到府。',
  },
  {
    name: '全餐方案二 - 超商卡分配',
    description: '適合年輕人在外租屋，無法領取大量生活用品者，只單分配當年7-11與全家超商卡。',
  },
]

/**
 * 生成 Organization Schema
 */
function generateOrganizationSchema() {
  const baseURL = getBaseURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseURL}/#organization`,
    name: organizationInfo.name,
    alternateName: organizationInfo.alternateName,
    description: organizationInfo.description,
    url: baseURL,
    logo: {
      '@type': 'ImageObject',
      url: organizationInfo.logo,
      width: 512,
      height: 512,
    },
    image: organizationInfo.image,
    telephone: organizationInfo.telephone,
    email: organizationInfo.email,
    sameAs: organizationInfo.sameAs,
    contactPoint: organizationInfo.contactPoint,
  }
}

/**
 * 生成 LocalBusiness Schema（本地商家）
 */
function generateLocalBusinessSchema() {
  const baseURL = getBaseURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseURL}/#localbusiness`,
    name: organizationInfo.name,
    description: organizationInfo.description,
    url: baseURL,
    telephone: organizationInfo.telephone,
    email: organizationInfo.email,
    image: organizationInfo.image,
    priceRange: organizationInfo.priceRange,
    areaServed: organizationInfo.areaServed,
    sameAs: organizationInfo.sameAs,
    // 營業時間（假設週一至週五 9:00-18:00）
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
  }
}

/**
 * 生成 Service Schema（服務項目）
 */
function generateServiceSchema() {
  const baseURL = getBaseURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseURL}/#service`,
    name: '股東紀念品代領服務',
    description: organizationInfo.description,
    provider: {
      '@type': 'Organization',
      '@id': `${baseURL}/#organization`,
    },
    areaServed: organizationInfo.areaServed,
    serviceType: '股東紀念品代領',
    // 子服務
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '服務項目',
      itemListElement: services.map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description,
        },
        position: index + 1,
      })),
    },
  }
}

/**
 * 生成 FAQPage Schema
 */
function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

/**
 * 生成 WebSite Schema（網站搜尋框）
 */
function generateWebSiteSchema() {
  const baseURL = getBaseURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseURL}/#website`,
    name: organizationInfo.name,
    url: baseURL,
    description: organizationInfo.description,
    publisher: {
      '@type': 'Organization',
      '@id': `${baseURL}/#organization`,
    },
  }
}

/**
 * 生成 BreadcrumbList Schema
 */
function generateBreadcrumbSchema(path: string) {
  const baseURL = getBaseURL()
  
  const breadcrumbMap: Record<string, { name: string; position: number }[]> = {
    '/': [{ name: '首頁', position: 1 }],
    '/services': [
      { name: '首頁', position: 1 },
      { name: '服務介紹', position: 2 },
    ],
    '/plans': [
      { name: '首頁', position: 1 },
      { name: '方案說明', position: 2 },
    ],
    '/gallery': [
      { name: '首頁', position: 1 },
      { name: '交貨實績', position: 2 },
    ],
    '/announcements': [
      { name: '首頁', position: 1 },
      { name: '公告', position: 2 },
    ],
    '/products': [
      { name: '首頁', position: 1 },
      { name: '商品區', position: 2 },
    ],
    '/recruitment': [
      { name: '首頁', position: 1 },
      { name: '招募', position: 2 },
    ],
    '/community': [
      { name: '首頁', position: 1 },
      { name: '社群', position: 2 },
    ],
    '/upload': [
      { name: '首頁', position: 1 },
      { name: '電投圖上傳', position: 2 },
    ],
    '/contact': [
      { name: '首頁', position: 1 },
      { name: '聯絡我們', position: 2 },
    ],
  }

  const items = breadcrumbMap[path] || breadcrumbMap['/'] || []

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: index === 0 ? baseURL : `${baseURL}${path}`,
    })),
  }
}

/**
 * 根據頁面路徑獲取適合的 JSON-LD schemas
 */
function getPageSchemas(path: string) {
  const schemas: object[] = []

  // 所有頁面都包含 Organization 和 WebSite
  schemas.push(generateOrganizationSchema())
  schemas.push(generateWebSiteSchema())

  // 首頁包含 LocalBusiness
  if (path === '/' || path === '') {
    schemas.push(generateLocalBusinessSchema())
    schemas.push(generateFAQSchema()) // 首頁顯示 FAQ
  }

  // 服務頁面
  if (path === '/services' || path === '/') {
    schemas.push(generateServiceSchema())
  }

  // FAQ 單獨頁面（如果有的話）
  // schemas.push(generateFAQSchema())

  // 麵包屑導航（非首頁）
  if (path !== '/' && path !== '') {
    schemas.push(generateBreadcrumbSchema(path))
  }

  return schemas
}

/**
 * useJsonLd Composable
 * 自動管理頁面的 JSON-LD 結構化資料
 */
export function useJsonLd() {
  const route = useRoute()

  // 計算當前頁面的 schemas
  const schemas = computed(() => getPageSchemas(route.path))

  // 交由 useHead 管理 script 標籤，避免手動操作 DOM 並確保與 SSR 兼容
  useHead({
    script: () => schemas.value.map((schema, index) => ({
      type: 'application/ld+json',
      'data-json-ld': `schema-${index}`,
      children: JSON.stringify(schema),
    })),
  })

  return {
    schemas,
    // 公開方法以便手動使用
    generateOrganizationSchema,
    generateLocalBusinessSchema,
    generateServiceSchema,
    generateFAQSchema,
    generateWebSiteSchema,
    generateBreadcrumbSchema,
  }
}

/**
 * 導出獨立的 Schema 生成函數，供 SSR 或其他用途使用
 */
export {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateServiceSchema,
  generateFAQSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  getPageSchemas,
}
