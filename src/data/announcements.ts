// 此檔案由管理後台自動產生，請勿手動編輯
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
    "id": 4,
    "title": "散單 上傳完電投圖 請記得加line留下資料核對",
    "date": "2026-01-28",
    "type": "important",
    "tags": [
      "重要"
    ],
    "content": "加line: @792nvftc 留下 姓名 聯繫方式 與所提供的電投圖是那些 核對該公司的電投領取規則 以免不符規則 或是已超過印單時間 來不及"
  },
  {
    "id": 1,
    "title": "春節服務公告",
    "date": "2026-02-05",
    "type": "important",
    "tags": [
      "服務",
      "時程"
    ],
    "content": "春節期間照常收單,若要提供證件或是使用模組,請提前預約安排。聯絡電話：0982-571-134（贊哥）。"
  },
  {
    "id": 2,
    "title": "2026 Q1 散單 需配合全餐行程",
    "date": "2026-01-20",
    "type": "new",
    "tags": [
      "費率",
      "方案"
    ],
    "content": "全餐代領期間 無法處理散單寄運"
  },
  {
    "id": 3,
    "title": "上傳文件格式提醒",
    "date": "2026-01-15",
    "type": "info",
    "tags": [
      "文件",
      "上傳"
    ],
    "content": "建議以 JPG/PNG 單檔 5MB 內，可於「文件上傳」頁使用表單，若失敗請改用 LINE：@792nvftc。"
  }
]
