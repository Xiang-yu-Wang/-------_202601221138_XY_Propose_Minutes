// 社群數據
export interface CommunityLink {
  title: string
  description: string
  icon: string
  link: string
  target: string
}

// 社群 QR code 圖片 URL（請替換為實際的 QR code 圖片）
export const qrCodeUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

export const communityLinks: CommunityLink[] = [
  {
    title: 'LINE 社群',
    description: '加入 LINE 官方帳號，即時獲得最新消息與服務',
    icon: '💬',
    link: 'https://line.me/R/ti/p/@792nvftc',
    target: '_blank'
  },
  {
    title: 'Facebook 社團',
    description: '加入 FB 社團，與其他股東交流與分享',
    icon: '👥',
    link: 'https://www.facebook.com/groups/call0982571134',
    target: '_blank'
  },
  {
    title: '直接聯絡',
    description: '電話洽詢，獲得專人服務',
    icon: '📞',
    link: 'tel:0982571134',
    target: ''
  }
]
