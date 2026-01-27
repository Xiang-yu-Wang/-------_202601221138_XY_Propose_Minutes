export interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
  avatar?: string
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: '王小姐',
    role: '上班族',
    content: '第一次使用就收到滿滿一箱紀念品，超划算！贊哥服務很親切，有問必答。',
    rating: 5
  },
  {
    id: 2,
    name: '陳先生',
    role: '退休族',
    content: '以前都要自己跑股東會，現在全部交給大倉代領，輕鬆又省時。每年都期待收包裹！',
    rating: 5
  },
  {
    id: 3,
    name: '林太太',
    role: '家庭主婦',
    content: '朋友推薦的服務，沒想到真的這麼方便。商品卡方案特別適合我，直接變成超商購物金。',
    rating: 5
  },
  {
    id: 4,
    name: '張先生',
    role: '工程師',
    content: '電投圖上傳功能很方便，不用寄回委託書。整個流程透明，進度隨時查詢。',
    rating: 5
  }
]
