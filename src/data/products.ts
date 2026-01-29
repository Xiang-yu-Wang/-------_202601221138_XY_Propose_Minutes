// 此檔案由管理後台自動產生，請勿手動編輯
export interface Product {
  id: number
  name: string
  category: string
  price: number
  image_url: string
  description: string
  available: boolean
}

export const products: Product[] = [
  {
    id: 3,
    name: "全家超商 禮物卡 面額100",
    category: "超商卡",
    price: 100,
    image_url: "https://lgqosrzcvmkicxiepwze.supabase.co/storage/v1/object/public/product-images/familymart-100.jpg",
    description: "無使用期限 可當禮物 贈送或自用",
    available: true
  },
  {
    id: 1,
    name: "7-11 商品卡 面額100",
    category: "超商卡",
    price: 100,
    image_url: "https://lgqosrzcvmkicxiepwze.supabase.co/storage/v1/object/public/product-images/711-100.jpg",
    description: "無使用期限 可當禮物 贈送或自用",
    available: true
  }
]
