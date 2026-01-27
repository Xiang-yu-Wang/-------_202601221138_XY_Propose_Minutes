// 導航數據
export interface NavItem {
  name: string
  to: string
}

// 主導航（Navbar 顯示）
export const navItems: NavItem[] = [
  { name: '首頁', to: '/' },
  { name: '服務介紹', to: '/services' },
  { name: '方案說明', to: '/plans' },
  { name: '商品', to: '/products' },
  { name: '文件上傳', to: '/upload' },
  { name: '聯絡我們', to: '/contact' },
]

// 頁尾額外導航
export const footerNavItems: NavItem[] = [
  { name: '交貨實績', to: '/gallery' },
  { name: '公告', to: '/announcements' },
  { name: '招募', to: '/recruitment' },
  { name: '社群', to: '/community' },
]
