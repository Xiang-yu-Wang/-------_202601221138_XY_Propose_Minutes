// 商品數據
export interface Product {
  id: number
  name: string
  category: string
  price: number
  image: string
  description: string
  available: boolean
}

export const products: Product[] = [
  {
    id: 1,
    name: '高級禮盒組合',
    category: '禮品盒',
    price: 450,
    image: 'https://via.placeholder.com/300x200?text=Gift+Box+1',
    description: '精美包裝的禮盒組合，含精選伴手禮',
    available: true
  },
  {
    id: 2,
    name: '茶葉禮盒',
    category: '飲品',
    price: 580,
    image: 'https://via.placeholder.com/300x200?text=Tea+Gift',
    description: '特選台灣茶葉，禮盒裝，適合送禮',
    available: true
  },
  {
    id: 3,
    name: '糕點精選盒',
    category: '食品',
    price: 320,
    image: 'https://via.placeholder.com/300x200?text=Pastry+Box',
    description: '傳統工藝糕點，新鮮製作',
    available: true
  },
  {
    id: 4,
    name: '蜂蜜禮盒',
    category: '食品',
    price: 680,
    image: 'https://via.placeholder.com/300x200?text=Honey+Gift',
    description: '天然蜂蜜禮盒，三款蜜種組合',
    available: true
  },
  {
    id: 5,
    name: '精油香氛組合',
    category: '香氛',
    price: 420,
    image: 'https://via.placeholder.com/300x200?text=Aromatherapy',
    description: '天然精油香氛套組，舒適氣味',
    available: true
  },
  {
    id: 6,
    name: '咖啡豆禮盒',
    category: '飲品',
    price: 550,
    image: 'https://via.placeholder.com/300x200?text=Coffee+Beans',
    description: '精選咖啡豆，多款風味可選',
    available: false
  }
]
