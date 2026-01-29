// 交貨照照片數據
export interface DeliveryPhoto {
  id: string
  url: string
  title: string
  description: string
  date: string
  location: string
}

export const deliveryPhotos: DeliveryPhoto[] = [
  {
    id: '1',
    url: 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/240152_580163.jpeg',
    title: '台北地區交貨',
    description: '客戶滿意收到紀念品',
    date: '2026-01-15',
    location: '台北市'
  },
  {
    id: '2',
    url: 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/303791_342347.jpeg',
    title: '新竹地區交貨',
    description: '高效率服務交貨',
    date: '2026-01-14',
    location: '新竹市'
  },
  {
    id: '3',
    url: 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/71050_590858.jpeg',
    title: '台中地區交貨',
    description: '客戶領取紀念品實況',
    date: '2026-01-13',
    location: '台中市'
  },
]
