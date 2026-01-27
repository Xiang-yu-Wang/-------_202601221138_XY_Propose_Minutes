<script setup lang="ts">
import { Briefcase, Check } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface JobPosition {
  id: number
  title: string
  salary: string
  location: string
  type: string
  requirements: string[]
  description: string
}

const positions: JobPosition[] = [
  {
    id: 1,
    title: '業務代理人',
    salary: '時薪 $200-280',
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
    salary: '月薪 $25,000-32,000',
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
    salary: '月薪 $24,000-30,000',
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
</script>

<template>
  <section class="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 text-emerald-700 font-semibold">
          <Briefcase class="w-6 h-6" />
          招募業務
        </div>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold text-gray-900">誠徵優秀夥伴</h2>
        <p class="mt-4 text-gray-600 max-w-2xl mx-auto">
          加入大倉代領股東紀念品，成為我們的業務代理人或後勤支援團隊。
        </p>
      </div>

      <!-- Job Positions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card v-for="job in positions" :key="job.id" class="bg-white/80 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle class="text-lg font-bold text-gray-900">{{ job.title }}</CardTitle>
            <div class="mt-3 space-y-1">
              <p class="text-emerald-700 font-semibold">{{ job.salary }}</p>
              <p class="text-sm text-gray-600">
                📍 {{ job.location }} | {{ job.type }}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div class="mb-4">
              <p class="text-sm font-semibold text-gray-900 mb-2">工作內容</p>
              <p class="text-sm text-gray-700 leading-relaxed">{{ job.description }}</p>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900 mb-2">任職要求</p>
              <ul class="space-y-1">
                <li v-for="(req, idx) in job.requirements" :key="idx" class="flex items-start gap-2 text-sm text-gray-700">
                  <Check class="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  {{ req }}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Additional Info -->
      <div class="mt-12 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 max-w-2xl mx-auto">
        <h4 class="font-bold text-blue-900 mb-3">💡 招募說明</h4>
        <ul class="text-sm text-blue-800 space-y-2">
          <li>✓ 所有職位享勞保、健保與相關福利</li>
          <li>✓ 表現優異者享績效獎金與升遷機會</li>
          <li>✓ 提供完整培訓與工作支援</li>
          <li>✓ 歡迎應屆畢業生應徵（提供新人培訓）</li>
        </ul>
        <p class="text-sm text-blue-900 font-semibold mt-4">
          有意願者，歡迎洽詢：LINE @792nvftc | 電話 0982-571-134（贊哥）
        </p>
      </div>
    </div>
  </section>
</template>
