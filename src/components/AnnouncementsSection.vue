<script setup lang="ts">
import { Megaphone } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Announcement {
  title: string
  date: string
  tags?: string[]
  content: string
}

const announcements: Announcement[] = [
  {
    title: '春節服務公告',
    date: '2026-02-05',
    tags: ['服務', '時程'],
    content:
      '春節期間照常收件與寄送，配送時程較平常延後 1-2 天，請提前安排。聯絡電話：0982-571-134（贊哥）。'
  },
  {
    title: '2026 Q1 方案調整',
    date: '2026-01-20',
    tags: ['費率', '方案'],
    content:
      '全餐方案一維持不變；方案二（超商儲值卡）調整為單筆加收 30 元通路手續費，詳細內容見方案頁。'
  },
  {
    title: '上傳文件格式提醒',
    date: '2026-01-15',
    tags: ['文件', '上傳'],
    content:
      '建議以 JPG/PNG 單檔 5MB 內，可於「文件上傳」頁使用表單，若失敗請改用 LINE：@792nvftc。'
  }
]
</script>

<template>
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 text-emerald-700 font-semibold">
          <Megaphone class="w-6 h-6" />
          公告區
        </div>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">最新通知與服務更新</h2>
        <p class="mt-4 text-gray-600 max-w-2xl mx-auto">
          提供近期服務時程、方案調整、文件上傳注意事項等重要訊息。
        </p>
      </div>

      <!-- Announcements list -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card v-for="(item, idx) in announcements" :key="idx" class="bg-white/80">
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle class="text-lg font-bold text-gray-900">{{ item.title }}</CardTitle>
              <span class="text-sm text-gray-500">{{ item.date }}</span>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <Badge v-for="tag in item.tags" :key="tag" variant="default">{{ tag }}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p class="text-gray-700 leading-relaxed">{{ item.content }}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
