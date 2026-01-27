/**
 * SEO 配置數據
 * 為各頁面提供 meta 標籤、標題、描述
 */

export interface SEOConfig {
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  keywords?: string
}

export const seoConfigs: Record<string, SEOConfig> = {
  home: {
    title: '大倉代領股東紀念品 | 專業股東禮品代領服務',
    description: '只需一股即可領取，代購高機率發放股票，代領股東紀念品。870檔精選公司，一鍵買齊，省時省力。聯絡電話：0982-571-134',
    keywords: '股東紀念品,代領,股東禮品,一股,股票代購',
    ogImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&h=630&q=80'
  },
  services: {
    title: '服務介紹 | 大倉代領股東紀念品',
    description: '深入了解我們的股東紀念品代領服務流程，包括代購、代領、物流等完整服務項目。',
    keywords: '股東紀念品,代領服務,代購股票,物流配送'
  },
  plans: {
    title: '方案說明 | 大倉代領股東紀念品',
    description: '全餐方案一和方案二的詳細說明，選擇最適合您的方案。透明收費，無隱藏費用。',
    keywords: '方案,全餐,收費,股東紀念品方案'
  },
  gallery: {
    title: '交貨實績 | 大倉代領股東紀念品',
    description: '展示我們多年的代領實績，各類股東紀念品圖片，讓您安心選擇我們的服務。',
    keywords: '交貨,實績,紀念品圖片,代領成果'
  },
  announcements: {
    title: '公告 | 大倉代領股東紀念品',
    description: '最新的服務公告、方案調整、文件上傳注意事項等重要通知。',
    keywords: '公告,通知,服務更新'
  },
  products: {
    title: '商品區 | 大倉代領股東紀念品',
    description: '精選優質商品和伴手禮，為您的股東紀念品增添特色選項。支援線上選購。',
    keywords: '商品,禮品,伴手禮,購物'
  },
  recruitment: {
    title: '招募 | 大倉代領股東紀念品',
    description: '加入我們的團隊！誠徵熱情、負責的夥伴，一起提供優質服務。',
    keywords: '招募,工作,職位,加入我們'
  },
  community: {
    title: '社群 | 大倉代領股東紀念品',
    description: '加入我們的社群，獲得最新資訊、參與討論、享受會員優惠。',
    keywords: '社群,社團,連絡,Facebook,LINE'
  },
  upload: {
    title: '電投圖上傳 | 大倉代領股東紀念品',
    description: '上傳電子投票委託書截圖，簡單便捷的文件管理系統。',
    keywords: '上傳,電投,委託書,文件'
  },
  contact: {
    title: '聯絡我們 | 大倉代領股東紀念品',
    description: '聯絡大倉代領股東紀念品，電話：0982-571-134，LINE：@792nvftc。我們很樂意為您服務！',
    keywords: '聯絡,電話,LINE,客服,詢問'
  }
}

/**
 * 根據路徑獲取 SEO 配置
 */
export function getSEOConfig(path: string): SEOConfig {
  // 移除前導斜線並轉換為配置鍵
  const key = (path === '/' ? 'home' : path.replace(/^\/?/, '').split('/')[0]) as keyof typeof seoConfigs
  return (seoConfigs[key] as SEOConfig) || seoConfigs.home
}
