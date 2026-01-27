// 公告數據
export interface Announcement {
  id: number
  title: string
  date: string
  type: 'important' | 'new' | 'info'
  tags?: string[]
  content: string
}

export const announcements: Announcement[] = [
  {
    id: 1,
    title: '春節服務公告',
    date: '2026-02-05',
    type: 'important',
    tags: ['服務', '時程'],
    content:
      '春節期間照常收件與寄送，配送時程較平常延後 1-2 天，請提前安排。聯絡電話：0982-571-134（贊哥）。'
  },
  {
    id: 2,
    title: '2026 Q1 方案調整',
    date: '2026-01-20',
    type: 'new',
    tags: ['費率', '方案'],
    content:
      '全餐方案一維持不變；方案二（超商儲值卡）調整為單筆加收 30 元通路手續費，詳細內容見方案頁。'
  },
  {
    id: 3,
    title: '上傳文件格式提醒',
    date: '2026-01-15',
    type: 'info',
    tags: ['文件', '上傳'],
    content:
      '建議以 JPG/PNG 單檔 5MB 內，可於「文件上傳」頁使用表單，若失敗請改用 LINE：@792nvftc。'
  }
]
