// 職位數據
export interface JobPosition {
  id: number
  title: string
  salary: string
  location: string
  type: string
  requirements: string[]
  description: string
}

export const positions: JobPosition[] = [
  {
    id: 1,
    title: '業務代理人',
    salary: '高獎金承攬制 按件計酬',
    location: '全台',
    type: '兼職/全職',
    requirements: [
      '熟悉股東紀念品市場',
      '有販售或物流經驗優先',
      '需配合外勤交貨',
      '溝通表達能力強'
    ],
    description: '負責開發客戶、協助股東紀念品代領，並配合交貨與收款作業。'
  },
  {
    id: 2,
    title: '行政客服',
    salary: '月薪 $30,000 + 獎金',
    location: '台北',
    type: '全職',
    requirements: [
      '熟悉 Excel、Google 表單',
      '細心守時，處理文件無誤',
      '客服經驗優先',
      '能配合班表'
    ],
    description: '處理客戶訊息回覆、訂單管理、文件上傳審核與統計報表製作。'
  },
  {
    id: 3,
    title: '倉儲物流人員',
    salary: '月薪 $30,000 + 獎金',
    location: '台北',
    type: '全職',
    requirements: [
      '能承受物流工作量',
      '細心盤點及分類商品',
      '可開車或騎機車',
      '願意配合加班'
    ],
    description: '負責商品入庫、分類、打包、出貨與交貨記錄管理。'
  }
]
